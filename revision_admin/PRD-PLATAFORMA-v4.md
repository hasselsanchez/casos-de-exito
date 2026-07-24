# PRD — T1 Blog Engine (v4, estado vigente)

> **Documento maestro del funcionamiento de la plataforma.**
> Refleja el sistema **tal como corre hoy en producción**, después de la migración a AWS
> (ECS/Fargate + RDS) y de las correcciones del motor de keywords.
> Sustituye a `prd-cross-t1-blog-engine-v3.md`, que describe el stack anterior
> (Vercel + Supabase + Inngest) y ya no aplica.
>
> **Última actualización:** julio 2026 · **Dominio prod:** `admin-blog.t1.com`

---

## 1. Resumen ejecutivo

T1 Blog Engine es una **plataforma autónoma de generación de contenido SEO** para el blog
de T1 (ecosistema de commerce en México). Investiga keywords, escribe artículos con IA,
los somete a control de calidad, genera sus imágenes, los enlaza internamente y los
publica — con un humano revisando en medio mientras el sistema no haya demostrado
suficiente precisión.

**Qué resuelve:** producir contenido SEO consistente y a escala para tres productos T1
(Envíos, Pagos, Tienda) más contenido transversal del ecosistema, sin depender de una
agencia ni de un equipo de redacción.

**Cómo se mide:** artículos publicados por mes, calidad (score QA ≥ 80), tasa de
aprobación humana, costo por artículo y tráfico orgánico.

**Restricción dura:** presupuesto mensual de IA con tope configurable (**$200 USD/mes**
por defecto), aplicado programáticamente.

---

## 2. Usuarios y roles

| Rol | Quién | Puede |
|---|---|---|
| **admin** | Natalia Ruiz, Bryant Rodríguez | Todo: configuración, generación manual, keywords, costos, comparador A/B, aprobar/rechazar |
| **reviewer** | Nelly Cruz | Revisar artículos: aprobar, rechazar, editar. **No** toca configuración ni dispara generación |
| **Lector final** | Merchants y PyMEs mexicanas | Consume el blog público |

**Registro cerrado por lista blanca en código** (`src/app/admin/auth-actions.ts`). Un
correo fuera de la lista no puede crear cuenta, aunque conozca la URL. El rol se asigna
automáticamente según el correo.

**Autenticación:** JWT propio (`jose` + `bcryptjs`), sesión por cookie. No hay RLS en la
base — **la autorización vive en la aplicación**.

---

## 3. Arquitectura

Todo corre en **AWS**. No hay Vercel, Supabase, Amplify ni Inngest.

```
                        ┌──────────────┐
   Lectores ──HTTPS──►  │  CloudFront  │
                        └──────┬───────┘
                               ▼
                        ┌──────────────┐        ┌──────────────┐
                        │     ALB      │───────►│  ECS web     │  Next.js 16 SSR
                        └──────────────┘        │  (Fargate)   │  standalone
                                                └──────┬───────┘
                                                       │
   EventBridge Scheduler                               ▼
   (6 schedules)  ──►  ECS task "cron"  ────────►  RDS Postgres
                        (run-cron.ts)               (privada, TLS)
   Botones admin  ──►  Lambda trigger-cron ─┘           │
                                                        ▼
                                              S3 (imágenes) + ECR
```

| Componente | Tecnología |
|---|---|
| Frontend + SSR | **Next.js 16.2.1** (App Router, `proxy.ts`, Turbopack, `output: standalone`) |
| Hosting web | **ECS/Fargate** detrás de **ALB** + **CloudFront** (TLS en el edge) |
| Trabajos programados | **ECS/Fargate task** disparada por **EventBridge Scheduler** |
| Disparo manual | **Lambda `trigger-cron`** → `ecs:RunTask` (el rol SSR no puede `PassRole`) |
| Base de datos | **RDS PostgreSQL** — cliente `pg` propio en `src/lib/db/` |
| Imágenes | **S3** (`IMAGES_BUCKET`) |
| Registro de imágenes | **ECR** (dos imágenes: `web` y `cron`) |
| Infraestructura | **Terraform** (`terraform/cron/`), entornos dev y prod |
| CI/CD | **GitHub Actions** (`web-image`, `cron-image`, `cron-infra`) |

**Nota clave:** el contenedor del cron es **el mismo binario** para los 6 trabajos; el tipo
se elige en runtime con la variable `CRON_TYPE`. `CRON_FORCE=1` salta los guardas de
horario (lo usan los botones "ahora" del admin).

---

## 4. Modelo de datos

| Tabla | Para qué |
|---|---|
| `articles` | El artículo y todo su ciclo de vida |
| `keyword_opportunities` | El **pool de keywords** — el inventario que alimenta la generación |
| `topics` | Categorías del blog (`/blog/categoria/{slug}`) |
| `cron_executions` | Bitácora de cada corrida, con trazas paso a paso |
| `trend_alerts` | Tendencias detectadas y qué se hizo con ellas |
| `review_actions` | Cada aprobación/rechazo humano (alimenta el gate de auto-aprobación) |
| `cost_records` | Costo de cada llamada a IA |
| `cost_reconciliation` | Conciliación contra el gasto real de la API |
| `user_roles` | Rol por usuario |
| `settings` | Configuración editable desde el admin (clave/valor jsonb) |

**Columnas notables de `articles`:** `title`, `body`, `meta_description`, `slug`,
`keyword_target`, `product_t1`, `topics` (TEXT[]), `sources`, `schema_markup_suggestion`,
`image_url`, `status`, `is_urgent`, `rejection_reason`, `reviewer_id`, `publish_datetime`,
`published_at`, `model_used`, `cost_breakdown`, `search_vector` (tsvector español + GIN).

---

## 5. Ciclo de vida del artículo

```
investigando → generando → ┬─► error_generacion
                           │
                           └─► pendiente_revision ─┬─► aprobado ──► encolado_publicacion ──► publicado
                                                   │
                                                   └─► rechazado
                           (auto, si los 4 candados abren)
                           └────────────────────────────────► encolado_publicacion ──► publicado
```

| Estado | Significado |
|---|---|
| `investigando` / `generando` | En proceso |
| `error_generacion` | Falló; no se publica |
| `pendiente_revision` | Espera a un humano |
| `aprobado` / `rechazado` | Decisión humana registrada en `review_actions` |
| `encolado_publicacion` | Listo, con `publish_datetime` futuro (+1h) |
| `publicado` | Visible en el blog |
| `descartado` | Retirado |

---

## 6. El motor de IA — pipeline de generación

Por cada artículo (`scripts/run-cron.ts`, tipo `generate`):

1. **Selección de keyword** del pool, respetando la **distribución por producto**.
2. **Deduplicación**: rechaza si el mismo `keyword_target` se usó en los últimos **30 días**.
3. **Redacción** (`article-generator.ts`) — **Claude Sonnet 4.6** (o Haiku según ajuste).
   Produce cuerpo, título, meta description, fuentes citadas, sugerencia de schema markup y
   `topics` **validados contra la tabla `topics`**.
4. **QA** (`qa-agent.ts`) — evalúa y da un **score 0–100**. Si falla con score ≥ 60,
   **reintenta una vez** con retroalimentación.
5. **Anti-colisión de slug** + **imagen** (`image-generator.ts` → Gemini → sube a **S3**).
6. **Guardado** con estado según `review_mode` y los candados (§7).
7. **Enlazado interno hacia adelante**: el artículo nuevo enlaza a los **ya publicados**.
8. **Enlazado inverso al publicar**: cuando se publica, los publicados relevantes se editan
   para apuntarle. Así el destino del enlace **siempre existe** (nunca 404).

### Control de calidad (QA)

**Aprueba si `score ≥ 80` y no hay fallos automáticos.** Fallos automáticos (score → 0):

- Citar a un **competidor** como fuente
- Citar un **documento interno**

Penalizaciones: sin fuentes (−50), sin fuente institucional SAT/PROFECO/INEGI/AMVO (−10),
más de 6 fuentes (−5, relleno), fuentes sin URL verificable (−5 c/u).

### Modelos

| Uso | Modelo |
|---|---|
| Redacción | `claude-sonnet-4-6` (o `claude-haiku-4-5` si se configura) |
| QA y enlazado | `claude-haiku-4-5` |
| Keyword research y tendencias | `claude-sonnet-4-6` (web search) o `gemini-2.5-flash` |
| Imágenes | `gemini-3.1-flash-image-preview` |

---

## 7. Reglas de negocio (las que gobiernan la publicación)

### Los 4 candados de la auto-publicación

Un artículo **solo** se publica sin humano si **las cuatro** condiciones se cumplen:

1. **Opt-in explícito** — `review_mode ≠ obligatoria`
2. **Gate de confianza** — la tasa histórica de aprobación humana es **≥ 70%** sobre una
   muestra mínima de **50 decisiones**. Las ediciones no cuentan (neutrales)
3. **QA aprobado** — score ≥ 80 sin fallos automáticos
4. **Muestreo** — en modo `muestreo`, 1 de cada N igual va a revisión humana

Si cualquiera falla → `pendiente_revision`. **El default es `obligatoria`**: nada se
publica solo hasta que alguien lo decida y el sistema se haya ganado la confianza.

### Otras reglas duras

- **Temas prohibidos**: envíos internacionales, aduanas, exportación/importación. T1 Envíos
  solo opera nacional; ese tráfico no convierte. Se veta por regex, no solo por prompt.
- **Competidores**: las keywords de competidor se **transforman** en keywords genéricas de
  problema (ej. "skydropx" → "comparar plataformas de gestión de envíos México").
- **Anti-canibalización**: dedup semántico (Jaccard) contra artículos, contra el pool y
  dentro del mismo lote.
- **Presupuesto**: al llegar al tope mensual, la generación y el research **se detienen** y
  se notifica.

---

## 8. Keyword research — el inventario que alimenta todo

Es el sistema que decide **sobre qué se escribe**. Funciona como control de inventario.

### Dos fuentes

| Fuente | Quién la produce | `source` |
|---|---|---|
| **Tendencias** | `trend-detector` dentro de la corrida | `trending` |
| **Research por producto** | 4 workers, uno por producto | `web_search` |

### Modelo mínimo/objetivo

- **`keyword_pool_target`** — cuántas keywords mantener listas. **Configurable desde el
  admin** (default 120; admite de 5 a 500+). Se reparte por la distribución por producto.
- **`PER_PRODUCT_MIN = 20`** — si un producto baja de aquí, se repone.

**Reposición por lotes (top-up):** cada producto pide lotes de **25** keywords hasta cubrir
su **déficit** (`objetivo − pendientes actuales`). Corta cuando llega al objetivo, cuando el
pool se seca (2 lotes casi vacíos) o cuando topa el presupuesto. El consumo de tokens es
**proporcional a la demanda**.

> **Por qué por lotes:** una sola llamada no puede traer 30+ keywords de forma confiable —
> las búsquedas web consumen del mismo presupuesto de tokens y truncaban la respuesta. Con
> lotes chicos cada llamada es segura y el ciclo alcanza cualquier objetivo.

### Deduplicación en 3 capas

1. **Regex** de temas prohibidos
2. **Coincidencia exacta** contra el pool y contra keywords ya usadas
3. **Jaccard semántico (umbral 0.50)** contra: artículos existentes + **el pool pendiente** +
   **las ya aceptadas en el mismo lote**

### Comportamiento manual vs automático

| | Automático (EventBridge) | Manual (botón admin) |
|---|---|---|
| Disparo | Día 1 del mes, 6am CST | Cuando se aprieta |
| Alcance | Solo productos por debajo del mínimo | Barrido de todos los productos con peso |
| Guardas | Respeta `cron_enabled` y umbrales | `CRON_FORCE=1` los salta |

---

## 9. Los 6 trabajos programados

| Trabajo | Frecuencia | Qué hace |
|---|---|---|
| `generate_articles` | Cada hora UTC (se auto-salta fuera de la hora configurada) | Genera el lote diario |
| `auto_publish` | Cada hora | Publica lo `encolado_publicacion` cuya hora ya llegó + enlazado inverso |
| `research_keywords` | Día 1 del mes, 12 UTC | Tendencias + reposición del pool |
| `weekly_summary` | Lunes 15 UTC | Resumen semanal a Slack |
| `reconcile_costs` | Diario 14 UTC | Concilia el costo estimado contra el real de la API |
| `clean_orphans` | Cada 30 min | Limpia artículos atorados en `generando` |

Todas las schedules están **ENABLED** en Terraform; el encendido/apagado real lo controla
`cron_enabled` desde el admin.

---

## 10. Panel de administración

**`/admin/settings` — Configuración**

| Ajuste | Qué controla |
|---|---|
| Generación automática | Enciende/apaga el cron de artículos |
| Artículos por ejecución | Cuántos por corrida |
| Distribución por producto | % Envíos / Pagos / Tienda / Ecosistema |
| Modelo default | Auto · Solo Haiku · Solo Sonnet |
| Modelo de keyword research | Gemini (gratis) · Claude (web search, pagado) |
| **Objetivo de keywords en el pool** | Volumen a mantener; muestra proyección de artículos y días |
| Hora del cron / Días activos | Cuándo corre |
| Generación de imágenes + versión de prompt | Si llevan imagen y con qué estilo |
| Tope mensual + % de alerta | Presupuesto |
| Modo de revisión | `obligatoria` · `muestreo` · `auto` |
| Slack / correo / notificaciones | Alertas |

**Otras pantallas:** `/admin/articles` (bandeja + revisión, aprobar/rechazar/editar),
`/admin/keywords` (pool, filtros, descartar/restaurar, "Generar keywords"),
`/admin/costs` (gasto vs tope), `/admin/performance` (desempeño),
`/admin/compare` (comparador A/B Claude vs Gemini).

---

## 11. Sitio público y API

**Blog:** `/blog`, `/blog/[slug]`, `/blog/todos`, `/blog/categoria/[slug]`,
`/blog/autor/[slug]`. Renderizado estático con ISR (`generateStaticParams`), `sitemap.xml`
y `robots.txt`. Búsqueda full-text en español (tsvector + GIN).

**API pública v1** (para que otros equipos T1 consuman el contenido):
`/api/v1/articles`, `/api/v1/articles/[slug]`, `/api/v1/articles/slugs`,
`/api/v1/topics`, `/api/v1/topics/[slug]`, `/api/v1/authors/[slug]`.
Además `/api/search` y `/api/health`.

---

## 12. Costos y presupuesto

- Cada llamada a IA se registra en `cost_records` con modelo, tokens, estado y etapa.
- `reconcile_costs` compara diario contra el gasto real de la API.
- Al **% de alerta** (default 80%) se notifica; al **100%** se **detiene** generación y research.
- Referencia: una reposición completa del pool (~170 keywords) cuesta **≈ $2–3 USD**.

---

## 13. Seguridad

| Control | Estado |
|---|---|
| Registro por lista blanca | ✅ |
| Roles aplicados en cada acción de servidor | ✅ |
| Secretos en Secrets Manager / GitHub Environments | ✅ (nunca en git ni en `NEXT_PUBLIC_*`) |
| Candado anti-duplicados en generación | ✅ |
| TLS a la RDS **con validación de certificado** | ⚠️ **Pendiente** — hoy cifra pero no valida (`rejectUnauthorized:false`) |

---

## 14. Despliegue

`dev` y `main` disparan GitHub Actions según qué cambió:

| Workflow | Se dispara con | Hace |
|---|---|---|
| `web-image` | `src/**`, `next.config.ts`, `Dockerfile.web`… | Construye la imagen web, la sube a ECR y **refresca el servicio ECS** |
| `cron-image` | `src/**`, `scripts/run-cron.ts`, `Dockerfile.cron` | Construye y sube la imagen del cron |
| `cron-infra` | **solo** `terraform/cron/**` | `terraform apply` |

`main` usa el entorno **Production** (cuenta AWS de prod); `dev`, el de **Development**.

> ⚠️ **Regla de oro:** no mergear a `main` con cambios de `terraform/cron/**` hasta que
> `prod.tfvars` tenga valores reales — dispararía un `terraform apply` contra prod.

**Migraciones SQL:** los archivos en `supabase/*.sql` (nombre heredado; **se aplican contra
la RDS**) se corren **a mano**. No hay auto-run.

---

## 15. Estado actual y pendientes

### ✅ Funcionando en producción

- Generación de artículos (manual y automática), QA, imágenes, enlazado, publicación
- **Keyword research por producto** — corregido y validado: de traer 0 a **+174 keywords**
  en una corrida, pool balanceado en ~78 por producto
- **Objetivo de pool dinámico** (5 a 500) configurable desde el admin
- **Deduplicación semántica** contra pool y lote
- Presupuesto, notificaciones Slack, seguridad de acceso, API v1

### ⏸️ Pendiente

| # | Pendiente | Dueño | Impacto |
|---|---|---|---|
| 1 | Aplicar `11_seed_orphan_topics.sql` en la RDS | Infra | **9 categorías del blog dan 404 hoy** |
| 2 | Llenar `prod.tfvars` + resto del checklist de prod | Infra | Bloquea `terraform apply` de prod |
| 3 | TLS a la RDS con CA bundle | Infra | Seguridad |
| 4 | Limpiar keywords duplicadas antiguas del pool | Marketing | Riesgo de canibalización SEO |
| 5 | Encender la generación automática | Marketing | Hoy apagada a propósito |
| 6 | Página `/admin/cron` para ver trazas sin CloudWatch | Producto | Autonomía de diagnóstico |
| 7 | Generador Gemini no produce `topics` | Producto | Solo afecta el comparador A/B |

---

## 16. Roadmap propuesto

**Corto plazo** — cerrar los pendientes 1–3 (infra) y 4–5 (marketing) para dejar la
plataforma produciendo sola.

**Mediano plazo**
- `/admin/cron`: bitácora de corridas con trazas
- Proyección de costo antes de una corrida grande ("500 keywords ≈ $X")
- Limpieza automática de duplicados del pool con vista previa
- Google Search Console conectado + sitemap enviado

**Largo plazo**
- Medición de desempeño real por artículo (posiciones, tráfico) para retroalimentar qué
  keywords priorizar
- Ampliar el gate de auto-aprobación con señales de desempeño, no solo de revisión
- Más idiomas / mercados (la tabla ya contempla `locale` y `translated_from_id`)

---

## Anexo — Glosario

| Término | Significado |
|---|---|
| **Pool de keywords** | Inventario de keywords pendientes que alimenta la generación |
| **Top-up** | Reponer solo el déficit contra el objetivo, sin sobreproducir |
| **Lote (batch)** | Una llamada al modelo pidiendo un bloque acotado de keywords |
| **Pool seco** | Un producto donde ya casi todo lo propuesto es duplicado |
| **Gate de auto-aprobación** | Umbral de 70% de aprobación humana sobre 50 decisiones |
| **Canibalización** | Dos artículos del mismo tema compitiendo entre sí en Google |
| **Jaccard** | Métrica de similitud entre textos; umbral 0.50 para vetar duplicados |
