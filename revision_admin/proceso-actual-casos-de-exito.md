# Proceso de publicación de Historias de Éxito T1

> **Propósito de este documento.** Explicar, de punta a punta, cómo producimos y
> publicamos hoy una historia de éxito en la landing, y cómo **este proceso se adapta
> al T1 Blog Engine (admin)** bajo la definición congelada del Blog T1 v2. Describe
> TODO lo que una historia necesita para existir (datos, redacción, imágenes, video,
> la tarjeta con hover, SEO) para que quede como insumo único del equipo del admin + Antar.
>
> **Nombre canónico:** "**Historias de éxito**" (antes "Casos de éxito"). El rename es un
> pendiente de código — ver §10.1. En este documento ya se usa el nombre nuevo; las rutas
> y nombres de archivo que dicen `casos-de-exito` reflejan el estado actual del código.
>
> **Estado hoy:** la landing es una app Next independiente. Cada historia vive
> **hardcodeada** en `src/lib/articles.ts` y sus assets visuales en
> `src/lib/cardAssets.ts`. Publicar = editar código + deploy. La landing seguiría
> igual; solo cambiaría de vivir sola a vivir bajo `/blog/...` alimentada por el admin.
>
> Secciones **§0–§9**: el proceso actual, tal cual corre hoy.
> Sección **§10**: cómo se adapta al Blog T1 v2 (los cambios acordados).

---

## 0. Antes de empezar: hay DOS flujos

Todo caso entra por uno de dos caminos, según **si hay video de entrevista o no**.
Esta decisión determina qué campos se llenan y cuánta libertad editorial hay.

| | **Flujo A — Video** | **Flujo B — Solo artículo** |
|---|---|---|
| **Insumo que llega** | Transcript de la entrevista grabada al cliente | Respuestas de un formulario llenado |
| **`contentType`** | `"video"` | `"article"` |
| **Testimonial** | `quote` real: cita textual + autor + cargo + foto | `callout` editorial (frase de impacto, **sin** atribución) |
| **Video** | `videoId` de YouTube + `videoCaption` | — (no hay) |
| **Imágenes** | Fotos reales del shoot (varias) | 1 imagen generada con IA (Midjourney) |
| **Libertad editorial** | **Alta** — el transcript da voz validada del cliente | **Baja** — regla estricta de no-invención |
| **Casos existentes** | Círculo de Crédito, Doto, Makora, PASE, Sears, Sesen | Claro Colombia, Ticketopolis |

**Cómo se identifica el flujo al recibir el caso:**

- Llega un transcript / Q&A largo / liga de YouTube → **Flujo A (Video)**.
- Llega el formulario lleno (marca, autorización, soluciones, KPIs…) → **Flujo B (Solo artículo)**.

---

## 1. Los datos de un caso (el modelo completo)

Todo caso es un objeto con estos campos. **Casi todo el texto es bilingüe**: cada
campo trae su versión `{ es, en }` en el mismo lugar (no son dos artículos separados).

### 1.1 Identidad y taxonomía (para filtros y URLs)

| Dato | Qué es |
|---|---|
| `slug` / `slugEn` | Identificador en URL. ES → `/casos-de-exito/{slug}`, EN → `/success-stories/{slugEn}`. Alimenta hreflang. |
| `company` | Nombre visible de la marca (ej. "Sears México"). |
| `logoSrc` | Ruta al logo de la marca (`/images/partners/…`). |
| `industry` `{es,en}` + `industrySlug` | Industria visible + su slug para páginas de filtro/cluster SEO. Se **reutiliza** el mismo `industrySlug` entre casos de la misma industria para compartir cluster. |
| `size` | Segmento: `startup` (<1K órdenes/mes), `growth` (1K–10K), `enterprise` (10K+). |
| `solutions[]` | Productos T1 usados. Strings exactos: `"T1 Envíos"`, `"T1 Pagos"`, `"T1 Tienda"`, `"T1Score"`. Alimenta filtros, keywords y JSON-LD. |
| `contentType` | `"video"` o `"article"` (define el flujo, ver §0). |
| `readingTime` | Minutos de lectura (manual: ~3 para artículo corto, 4–5 para video/largo). |
| `publishedAt` | Fecha ISO `YYYY-MM-DD`. Alimenta JSON-LD y señal de frescura. |

### 1.2 Contenido editorial (bilingüe)

| Dato | Qué es / dónde sale |
|---|---|
| `title` `{es,en}` | Título del caso. Va al `<title>`, OG, JSON-LD `headline`. |
| `subtitle` `{es,en}` | Subtítulo visible en el hero (secundario al título). |
| `executiveSummary` `{es,en}` | Resumen ejecutivo. **Es la meta description** + OG + Twitter + JSON-LD `description`. ~150–200 caracteres, con marca + producto T1 + KPI principal. |
| `content.intro` `{es,en}` | Cuerpo — presentación de la empresa. |
| `content.challenge` `{es,en}` | Cuerpo — "El reto". |
| `content.solution` `{es,en}` | Cuerpo — "La solución". |
| `content.results` `{es,en}` | Cuerpo — "Resultados". |

> El cuerpo **no es un blob**: son cuatro secciones separadas (intro / challenge /
> solution / results), cada una bilingüe. Esto importa para el enlazado automático (§6).

### 1.3 Métricas (las tarjetas de números duros)

`metrics[]` — lista de 2–3 métricas, cada una con `value {es,en}` + `label {es,en}`.
Ej.: `{ value: "40%", label: "Reducción en mora temprana" }`. Se muestran como
tarjetas de estadística en el artículo.

### 1.4 Testimonial — `quote` **o** `callout` (nunca ambos)

- **`quote`** (Flujo A, video): `text {es,en}` (cita textual), `short {es,en}`
  (versión ≤110 car. para las tarjetas "Por tamaño"), `highlight {es,en}`
  (substring de `text` que se pinta en rojo de marca), `author`, `role {es,en}`,
  `photo` (ruta a la foto del vocero).
- **`callout`** (Flujo B, solo artículo): `text {es,en}` + `highlight {es,en}`.
  Es una frase editorial de impacto **sin** atribución a persona. Reemplaza a la
  quote para que el artículo mantenga su ritmo visual.

### 1.5 Video (solo Flujo A)

- `videoId` — ID del video de YouTube (se embebe con reproductor ligero).
- `videoCaption` `{es,en}` — frase del vocero que se muestra como overlay sobre el video.

---

## 2. Redacción / generación del contenido

**No se genera con IA desde keywords.** El contenido sale de un insumo humano
(transcript o formulario) y se redacta con reglas editoriales:

- **Regla de no-invención (Flujo B, crítica):** solo hechos validados del formulario
  + verdades de industria seguras. Prohibido inventar métricas, nombres de
  paqueterías/tecnologías no confirmados, narrativas de fundador o quotes.
- **Flujo B es un proceso de 8 pasos** con preguntas de validación **antes** de escribir
  (país/mercado, categoría, `size`, industria, qué nombres específicos están validados,
  si hay quote real — casi siempre no, `slugEn`).
- **Revisión sección por sección (obligatoria):** se entrega primero un preview legible;
  el humano aprueba o pide ajustes por sección (intro / reto / solución / resultados /
  callout / resumen). No se pasa a código hasta la aprobación explícita.
- **Convención de nombres de producto en el cuerpo:** en todo texto visible se escribe
  **`T1pagos`, `T1score`, `T1tienda`, `T1envíos`, `T1pos`** (sin espacio, segunda palabra
  en minúscula). Ojo: el campo `solutions[]` se queda en formato legacy (`"T1 Pagos"`)
  para no romper filtros ni keywords.

---

## 3. Imágenes (el punto con más matices)

Aquí está la parte que más se malentiende. Un caso maneja **varias imágenes con
funciones distintas**, y no todas se ven donde uno esperaría:

| Campo | Qué es | **Dónde se ve realmente** |
|---|---|---|
| `heroImage` | Imagen "principal" | **NO se ve en el artículo NI como thumbnail del listado.** Solo alimenta Open Graph / redes + imagen de JSON-LD (SEO). Igual debe apuntar a un archivo válido. |
| `images[]` | Imagen(es) del cuerpo | La **única** imagen visible dentro del artículo: decorativa, entre "El reto" y "La solución". Si hay varias, se usa la última disponible. |
| `quote.photo` | Foto del vocero | En el bloque de testimonial (Flujo A). |
| `logoSrc` | Logo de la marca | Solo en la ficha meta del artículo (aside, ~110px) y en la tarjeta del listado (§5). |

**Ajustes finos por imagen (se calibran a mano para cada foto):**

- `heroImageFocal` — `object-position` del hero en las tarjetas de preview (para que las
  caras sobrevivan al recorte 5/4 desde una fuente 3/2).
- `articleImageFocal` — `object-position` de la imagen del cuerpo (recorte 16/9 agresivo).
  Solo se referencian fuentes horizontales aquí, nunca verticales.
- `heroPreviewDarken` — flag para oscurecer el degradado superior cuando la foto tiene
  branding blanco que compite con el logo blanco sobreimpuesto.

**De dónde salen las imágenes según el flujo:**

- **Flujo A (video):** fotos reales del shoot. Se dejan en
  `/public/images/articles/{MARCA}/` (varias: hero, cuerpo, foto del vocero).
- **Flujo B (solo artículo):** **una sola** imagen generada con IA (Midjourney, ratio
  3:2 para que recorte limpio a 16:9 y 5:4). Ese mismo `hero.png` sirve a la vez como
  `heroImage` y como `images[0]`. Estilo fotográfico editorial anclado a referencias
  reales (no lenguaje stock/lifestyle).

---

## 4. Video / YouTube (Flujo A)

Cuando el caso tiene video, se sube a YouTube y se guarda su `videoId`. En el artículo
se embebe con un reproductor ligero (carga diferida) y se le pone el `videoCaption`
(frase del vocero) como overlay. Los casos solo-artículo no llevan nada de esto.

---

## 5. La tarjeta del preview y su **hover** (lo que aparece al pasar el mouse)

Esto es específico y fácil de olvidar: **la tarjeta del listado NO lleva foto.**
Es un **logo centrado** de la marca + el tag de industria. Al hacer **hover**, la
tarjeta revela un **degradado pictórico** de fondo, elegido por marca.

Todo eso vive en `src/lib/cardAssets.ts` (fuente única, la leen tanto la parrilla del
home como la sección "Más casos de éxito" al pie de cada caso):

| Mapa | Qué controla |
|---|---|
| `CARD_GRADIENT` (por `slug`) | El **fondo que aparece en hover**. Es un degradado pictórico de un pool de imágenes de marca T1. **Se elige por tono/mood de la marca** (marca cálida → tonos rojo/coral; marca azul → azul/violeta; etc.). Se puede reusar un fondo re-encuadrándolo (`position` + `origin` + `scale`). **El build FALLA si un caso nuevo no tiene su entrada aquí.** |
| `CENTERED_LOGO` (por `company`) | Altura del logo dentro de la tarjeta. Se afina por tipo de logo (wordmark ancho → más bajo; marca cuadrada → más alto; logo apilado → ~2× la altura). |
| `CENTERED_LOGO_MAX_W` (por `company`) | Ancho máximo del logo. Solo para logos apilados que necesitan más ancho que el default `max-w-[68%]`. |
| `META_LOGO_SIZING` (en `ArticleMetaCard.tsx`, por `company`) | Tamaño del logo en la ficha meta del artículo. Solo para logos apilados. |

**Además:** el logo se coloca en `/images/partners/`. Si viene con mucho padding
transparente (típico de PNGs generados), se recorta automáticamente antes de usarlo.

> **Regla de oro operativa:** en el **mismo commit** que agrega el caso a `articles.ts`
> hay que agregar su `CARD_GRADIENT` (y ajustar `CENTERED_LOGO`). No es "para después":
> sin eso el build no compila y la tarjeta se ve rota frente a las demás.

---

## 6. SEO — se genera solo a partir de los campos

No se escribe SEO aparte; sale de los datos del caso:

- **Meta description** ← `executiveSummary`. OG/Twitter ← title + summary + heroImage.
- **JSON-LD `Article`** ← headline, description, image, datePublished/Modified, autor
  (T1), publisher (T1), `about` (la empresa), keywords (desde `solutions`).
- **Hreflang ES/EN** ← `slug` / `slugEn` (siempre se llenan ambos).
- **Enlazado interno automático (`linkifyT1`):** en cada sección del cuerpo, la **primera**
  mención de cada producto T1 se convierte en link a su página. Por eso conviene mencionar
  el producto en cada sección (hasta 4 links salientes por artículo).
- **Clusters:** `industrySlug` agrupa casos de la misma industria; `solutions` alimenta
  páginas de filtro.

---

## 7. Publicación (hoy)

Hoy publicar es **código**: se agrega el objeto a `src/lib/articles.ts`, se agregan sus
assets (`cardAssets.ts` + archivos de imagen/logo), se hace commit, el build valida
(safeguard del `CARD_GRADIENT`) y se despliega. No hay bandeja, ni estados, ni scheduling:
lo aprobado por el humano en la revisión sección-por-sección se codifica y sale.

---

## 8. Checklist — qué necesita un caso para estar "completo"

Un caso no está listo hasta tener TODO esto:

- [ ] Flujo identificado (video / solo artículo).
- [ ] Identidad + taxonomía: `slug`/`slugEn`, `company`, `industry`+`industrySlug`, `size`, `solutions[]`.
- [ ] Texto bilingüe aprobado sección por sección: `title`, `subtitle`, `executiveSummary`, `content.{intro,challenge,solution,results}`.
- [ ] `metrics[]` (2–3).
- [ ] Testimonial: `quote` (video) **o** `callout` (solo artículo).
- [ ] Video (si aplica): `videoId` + `videoCaption`.
- [ ] Imágenes: `heroImage` (OG/SEO) + `images[]` (cuerpo) + `quote.photo` (video) en `/images/articles/{MARCA}/`, con `heroImageFocal` / `articleImageFocal` / `heroPreviewDarken` calibrados.
- [ ] Logo en `/images/partners/` (recortado).
- [ ] Assets de tarjeta en `cardAssets.ts`: `CARD_GRADIENT` (obligatorio, build falla sin él) + `CENTERED_LOGO` (+ overrides de ancho/meta si es logo apilado).
- [ ] `readingTime` + `publishedAt`.

---

## 9. Qué implica esto para el admin

Para que este proceso viva en el admin, el admin tiene que poder **reproducir cada
pieza de arriba**. Los puntos que hoy el Blog Engine no contempla y que este proceso
requiere son, en resumen:

1. **Dos vías de alta que no son "generación por keyword":** intake por transcript (video)
   e intake por formulario (solo artículo), con revisión sección por sección.
2. **Contenido estructurado**, no un solo `body`: resumen ejecutivo, subtítulo,
   4 secciones, métricas, y quote/callout.
3. **Bilingüe por campo** (`es`/`en` juntos), no dos artículos ligados.
4. **Varias imágenes con funciones distintas** (hero=solo SEO, imagen de cuerpo, foto de
   vocero) + focos por imagen + el flag de oscurecido.
5. **Video de YouTube** con caption.
6. **Taxonomía propia:** industria + tamaño + soluciones T1 (además de topics/producto).
7. **La tarjeta de listado con logo centrado + degradado en hover** (no una imagen plana),
   con los tamaños de logo por marca.

Ese es el mapa completo de lo que hay que acomodar. La §10 concreta cómo se adapta cada
pieza bajo la definición del Blog T1 v2.

---

## 10. Adaptación al Blog T1 v2 (definición congelada 23–24 jul 2026)

> La **Definición del Blog T1 v2** gobierna todo lo que se redacte después. Sus mandatos
> raíz: **O1** tráfico masivo pero calificado (se mide en registros conciliados vs CRM,
> no en sesiones), **O2** AI por encima de SEO (el juez son ChatGPT/Perplexity/Gemini;
> baseline TN ~1,253 páginas citadas vs T1 ~30), **O3** motor automatizado y global
> (es/en/pt; país = configuración, no proyecto).
>
> **Decisión madre:** el blog se organiza por **IDIOMA**; el país es una **capa**
> (slug, etiqueta, curación), jamás estructura. **URL única por pieza** — prohibido
> versionar la misma pieza por país.

Bajo esa definición, las **Historias de éxito = una categoría del blog**, servida como
**capa general por casa de idioma** (una historia MX se muestra a todo hispanohablante con
su chip 🇲🇽; una historia inspira más allá de su país). No salen del pipeline automatizado:
son el **carril curado** del blog.

### 10.1 Cambio de nombre: "Casos de éxito" → "Historias de éxito"

Rename global, alineado con la propia v2 (§4 la nombra "Historias de éxito"). Se separa en dos:

| Alcance | Qué se cambia | Cuándo |
|---|---|---|
| **Copy visible** (~18 strings en `src/**` y `locales/es`) | ES "Casos de éxito" → "**Historias de éxito**". El **inglés ya dice "Success stories"** (= historias de éxito) → **no cambia**. | Ahora (rename de código) |
| **Slug de URL** (`/casos-de-exito/`, en `src/i18n/routing.ts` + carpeta de ruta, ~12 refs) | Es ruta + SEO. Se decide junto con **P3-K** (nombres/URLs de taxonomía) y la migración a `/blog`. | **No tocar aún** — evita romper enlaces dos veces |

### 10.2 Dónde ya encajamos (sin cambios)

| Definición v2 | Nuestro modelo hoy | Estado |
|---|---|---|
| Organizar por idioma; país = capa | Bilingüe `{es,en}` con `slug`/`slugEn` | ✅ es→`/blog`, en→`/en/blog` |
| URL única por pieza, sin país en la estructura | Slugs ya **sin país** (`/casos-de-exito/{slug}`) | ✅ Solo migra a `/blog/{slug}` |
| Historias = categoría del blog | Colección con taxonomía propia | ✅ Se vuelve una categoría/`topic` |
| El motor ya enlaza a `/blog/{slug}` sin país | — | ✅ Consumimos ese contrato |

### 10.3 Qué cambia en NUESTRO lado

**a) Traducción completa es→en de TODAS las historias.**
Cada historia existe en las dos casas de idioma. `slug` (es, en `/blog`) + `slugEn`
(en, en `/en/blog`), ligados por **`translated_from_id`** (el admin ya lo tiene ✓) + **revisor
nativo**. Las historias existentes reutilizan su copy en inglés ya redactado a mano; las
nuevas pasan por traducir + revisar. (No es curaduría de 2–3: **todas** se traducen.)

**b) `country` = tag INTERNO del admin, NO un campo ni una categoría de la landing.**
El taggeo de país es **interno**, para geo-curación y para servir la landing vía
`/api/v1/articles?country=`. En la landing **no es un filtro clickeable** ni una categoría;
a lo sumo se renderiza como **chip pasivo** junto al título. **Los filtros de la landing
siguen siendo tamaño / industria / solución** — no se agrega país. La geo-curación
(prioriza lo local cuando existe, nunca esconde lo demás) vive en el admin, no en la landing.

**c) Migración de URL a casas de idioma.**
`/blog/{slug}` (es) y `/en/blog/{slug}` (en). **País jamás en la ruta.** Se matan las rutas
país (`/mx|co|us|br/blog/*`) y `t1.com.mx` → **301** a la casa correspondiente. (Ligado a
§10.1 slug + P3-K; no se ejecuta hasta esa definición.)

**d) CTA atribuido al CRM (O1).**
El `FinalCta` de la historia debe medir **registros conciliados contra CRM** (UTM/journey),
no sesiones. El mismo endpoint `/api/v1/articles?country=` alimenta también newsletter y journeys.

### 10.4 Las historias como carril curado (corrección a O3)

La v2 manda "motor automatizado, sin persona o casi". Las historias son la **excepción
explícita** (§4 v2: *"caso = pieza curada, no producción en masa"*). Esto hay que blindarlo
para que nadie las meta al pipeline de keywords:

- **NO** salen del pool de keywords ni del generador IA con QA. Entran por **intake humano**:
  transcript (video) o formulario (solo artículo), con **regla de no-invención** y **revisión
  sección por sección** (ver §0–§2). El admin las trata como un **content type distinto**,
  no como artículo generado.
- Son una **tercera capa**, no encajan en General vs Operativa (§5 v2): tienen **alcance de
  idioma** (se muestran en toda la casa) **+ sello de país** (chip), pero **sin gate de
  producto duro**. Alcance general, marcadas por país.

### 10.5 SEO / AI — parámetros alineados (reframe O2: AI > Google)

El juez pasa de Google a los motores de IA. Aquí las historias juegan a favor de forma
desproporcionada: son **materia de cita ideal** (entidad nombrada = la empresa + números
duros = `metrics` + cita atribuida = `quote`).

| Parámetro | Postura v2 | Qué hacemos con las historias |
|---|---|---|
| Estructura de URL | Casa de idioma + slug sin país | `/blog/{slug}` (es), `/en/blog/{slug}` (en). Cero país en la ruta. 301 de las rutas viejas |
| hreflang | "Convención de Google, no de crawlers de IA" | Se mantiene es↔en (no estorba a Google); **no es la palanca** — cada doc se cita solo |
| Meta description | — | `executiveSummary` (marca + producto + KPI): snippet ideal para IA ✅ |
| Datos citables | AI-first | KPIs y quotes **en el texto visible**, no solo en JSON-LD (ya es el caso) |
| JSON-LD | Señal de entidad | `Article` + `about`=empresa + métricas → alta señal para citas de IA |
| Enlazado interno | Recomendación semántica (IA blog fase 1) | `linkifyT1` + relacionar historia ↔ operativa del mismo país/producto |
| "Pregúntale a T1" (⌘K, fase 2) | Cita piezas, remata en producto | **Priorizar historias en el índice**: mejor materia de cita (hecho + número + nombre) |
| Medición | O1: registros vs CRM | CTA con atribución al CRM, no vanity metrics |
| Geo-curación | Chip + IP (CloudFront); selector gana a IP | `country` **interno** (dato, no URL) + feed `/api/v1/articles?country=` |

**Riesgo a evitar:** al integrar al admin, **NO** reintroducir país en la ruta
(`/co/blog/claro-colombia`). Es UNA pieza en `/blog/claro-colombia` con chip 🇨🇴, mostrada a
todo hispanohablante y geo-curada al tope para CO. Nuestro modelo ya es country-less: solo
hay que no romperlo.

### 10.6 Dependencias y pendientes (fuera de nuestro control)

| # | Pendiente | Dueño | Impacto para las historias |
|---|---|---|---|
| 1 | **BRY-13 — integración landing↔admin** | Nuestra mitad + **Antar** la otra | La landing se alimenta de `/api/v1/articles?country=`; sin esto, las historias siguen hardcodeadas |
| 2 | **P3-K — nombres/URLs exactos de la taxonomía** | Contenido | **No congelar** el slug de la categoría ni la nueva ruta `/blog/...` hasta P3-K |
| 3 | **Aprobación Natalia** + **insumos Antar** (registry de países, ADR-003) | Producto / Antar | Condición de la propia v2 para ejecutar |
| 4 | `translated_from_id` en el admin | Admin | ✅ Ya existe — habilita la traducción es↔en |

### 10.7 Checklist de cambios para dejar las historias listas en el admin

- [ ] Rename de copy visible ES: "Casos de éxito" → "Historias de éxito" (inglés ya OK).
- [ ] **No** cambiar el slug `/casos-de-exito/` todavía (espera P3-K + migración a `/blog`).
- [ ] Definir el **content type "historia de éxito"** en el admin (carril curado, no pipeline de keywords).
- [ ] Modelo: reutilizar todos los campos de §1; el `country` vive **en el admin**, no en la landing.
- [ ] Traducción completa es→en de todas las historias vía `translated_from_id` + revisor nativo.
- [ ] Geo-curación por `country` + feed `/api/v1/articles?country=` (BRY-13, con Antar).
- [ ] CTA con atribución a CRM (O1).
- [ ] Al migrar a `/blog`: casas de idioma, sin país en la ruta, 301 de rutas viejas.
