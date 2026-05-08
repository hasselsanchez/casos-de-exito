export interface Article {
  slug: string;
  slugEn: string;
  company: string;
  logoSrc: string;
  industry: { es: string; en: string };
  industrySlug: string;
  size: "startup" | "growth" | "enterprise";
  solutions: string[];
  contentType: "article" | "video";
  /** YouTube video ID (only when contentType === "video") */
  videoId?: string;
  /** Speaker quote shown as overlay on the hero video */
  videoCaption?: { es: string; en: string };
  heroImage: string;
  /** CSS object-position for the heroImage when shown in landscape preview cards.
     Tuned per photo so faces survive the side-cropping that 5/4 cards apply
     to a 3/2 source. Defaults to "center" if omitted. */
  heroImageFocal?: string;
  /** When true, preview cards apply a stronger dark gradient at the top of the
     hero image. Use it when the photo's environment has white/bright branding
     that visually competes with the white logo overlay (e.g. Makora's wall). */
  heroPreviewDarken?: boolean;
  images: string[];
  /** CSS object-position for the in-article decorative image (16/9 frame that
     aggressively crops top + bottom of the 3/2 source). Tuned per photo so the
     subject's face stays in frame. Defaults to "center top" if omitted.
     Only landscape sources should be referenced here — never images from the
     "Verticales/" capture folders, since portrait sources collapse into a
     close-up of the head once forced into a 16/9 box. */
  articleImageFocal?: string;
  title: {
    es: string;
    en: string;
  };
  subtitle: {
    es: string;
    en: string;
  };
  /** Editorial executive summary shown in the article hero. Original copy, not a paraphrase of the interview transcript. */
  executiveSummary: {
    es: string;
    en: string;
  };
  metrics: {
    value: { es: string; en: string };
    label: { es: string; en: string };
  }[];
  quote: {
    text: { es: string; en: string };
    /** ≤ 110 char punch-line for the "Por tamaño" preview cards */
    short: { es: string; en: string };
    /** Optional substring of `text` to render in brand red as the moneyline of the pull quote */
    highlight?: { es: string; en: string };
    author: string;
    role: { es: string; en: string };
    photo: string;
  };
  content: {
    intro: { es: string; en: string };
    challenge: { es: string; en: string };
    solution: { es: string; en: string };
    results: { es: string; en: string };
  };
  readingTime: number;
  /** ISO date the case study was published — used in JSON-LD and OpenGraph metadata */
  publishedAt: string;
}

export const articles: Article[] = [
  {
    slug: "circulo-de-credito",
    slugEn: "circulo-de-credito",
    company: "Círculo de Crédito",
    logoSrc: "/images/partners/circulo-de-credito.svg",
    industry: { es: "Servicios Financieros", en: "Financial Services" },
    industrySlug: "servicios-financieros",
    size: "enterprise",
    solutions: ["T1Score"],
    contentType: "video",
    videoId: "MPXrBe7iNgE",
    videoCaption: {
      es: "Nuestra alianza con T1 reduce la mora temprana hasta un 40%.",
      en: "Our alliance with T1 cuts early arrears by up to 40%.",
    },
    heroImage: "/images/articles/CIRCULO/AZT17438.JPG",
    heroImageFocal: "70% 30%",
    images: [
      "/images/articles/CIRCULO/AZT17449.JPG",
      "/images/articles/CIRCULO/AZT17472.JPG",
      "/images/articles/CIRCULO/AZT17477.JPG",
    ],
    articleImageFocal: "center 25%",
    title: {
      es: "Cómo Círculo de Crédito está repensando el acceso al crédito en México",
      en: "How Círculo de Crédito is rethinking credit access in Mexico",
    },
    subtitle: {
      es: "Data alternativa que da certeza y confianza al sistema financiero mexicano",
      en: "Alternative data bringing certainty and trust to Mexico's financial system",
    },
    executiveSummary: {
      es: "Círculo de Crédito, una de las dos sociedades de información crediticia más grandes de México, integró T1Score como capa de inteligencia de datos alternativos. Hoy reduce hasta un 40% la mora temprana en perfiles sin historial.",
      en: "Círculo de Crédito, one of Mexico's two largest credit bureaus, integrated T1Score as an alternative data intelligence layer. It now cuts early arrears by up to 40% on profiles without traditional credit history.",
    },
    metrics: [
      { value: { es: "40%", en: "40%" }, label: { es: "Reducción en mora temprana", en: "Reduction in early arrears" } },
      { value: { es: "85M+", en: "85M+" }, label: { es: "Historiales crediticios administrados", en: "Credit histories managed" } },
      { value: { es: "20M", en: "20M" }, label: { es: "Consultas procesadas", en: "Queries processed" } },
    ],
    quote: {
      text: {
        es: "La alianza que tenemos con T1 reduce hasta en un 40% la mora temprana. Es muy valioso para el sistema financiero el contar con esta alianza porque no nada más es un dato alternativo valioso, sino es un dato alternativo valioso de contactabilidad sobre la persona.",
        en: "Our alliance with T1 cuts early arrears by up to 40%. This partnership is incredibly valuable to the financial system — it's not just high-quality alternative data, it's alternative data that tells you how reachable a person actually is.",
      },
      short: {
        es: "T1 nos da el dato alternativo que el sistema financiero necesitaba.",
        en: "T1 gives us the alternative data the financial system was missing.",
      },
      highlight: {
        es: "T1 reduce hasta en un 40% la mora temprana",
        en: "T1 cuts early arrears by up to 40%",
      },
      author: "Juan Manuel Ruiz",
      role: { es: "Director General, Círculo de Crédito", en: "CEO, Círculo de Crédito" },
      photo: "/images/articles/CIRCULO/AZT17498.JPG",
    },
    content: {
      intro: {
        es: "Círculo de Crédito es una de las dos sociedades de información crediticia más grandes de México. Administra más de 85 millones de historiales de personas físicas y 2 millones de empresas, y su trabajo sostiene gran parte de las decisiones de crédito que se toman cada día en el país. Sus consultas son la materia prima del sistema financiero mexicano: bancos, fintechs, retailers y emisores de crédito apoyan en este bureau buena parte de su evaluación de riesgo.",
        en: "Círculo de Crédito is one of Mexico's two largest credit bureaus. It manages over 85 million credit histories for individuals and 2 million for companies, and its work underpins a large share of the credit decisions made in the country every day. Its queries are the raw material of the Mexican financial system: banks, fintechs, retailers and credit issuers rely on this bureau for a large portion of their risk evaluation.",
      },
      challenge: {
        es: "De cada diez consultas que procesa Círculo de Crédito, una pertenece a un perfil sin historial crediticio. Para ese segmento — la economía informal, jóvenes ingresando al sistema financiero — el bureau tradicional no tiene respuesta. Sin datos no hay crédito; sin crédito no hay inclusión financiera. El sistema mexicano necesitaba una capa de información complementaria que permitiera otorgar crédito a personas no bancarizadas sin asumir el riesgo de morosidad asociado a la falta de historial.",
        en: "One in every ten queries Círculo de Crédito processes belongs to a profile with no credit history. For that segment — the informal economy, young adults entering the financial system — the traditional bureau has no answer. No data, no credit; no credit, no financial inclusion. The Mexican system needed a complementary information layer that would let issuers extend credit to the unbanked without taking on the default risk associated with the lack of history.",
      },
      solution: {
        es: "La integración con T1Score añadió a Círculo de Crédito una capa de inteligencia que no existía en el ecosistema crediticio mexicano. T1Score se construye sobre datos transaccionales, señales de contactabilidad y comportamiento digital — variables que predicen capacidad y voluntad de pago en perfiles donde el bureau tradicional está ciego. La alianza permite a las instituciones financieras consultar al mismo tiempo el historial tradicional y el score alternativo de T1 en una sola llamada API, sin reescribir su flujo de evaluación.",
        en: "The integration with T1Score added an intelligence layer to Círculo de Crédito that didn't exist in the Mexican credit ecosystem. T1Score is built on transactional data, reachability signals and digital behavior — variables that predict ability and willingness to pay where the traditional bureau is blind. The alliance lets financial institutions query the traditional history and T1's alternative score in a single API call, without rewriting their evaluation flow.",
      },
      results: {
        es: "La mora temprana cae hasta un 40% en perfiles evaluados con la combinación bureau + T1Score. Los emisores de crédito acceden a un universo de aprobaciones que antes era pura intuición y la inclusión financiera deja de ser una promesa para convertirse en una métrica medible. El mercado adoptó la solución de T1 con rapidez y Círculo de Crédito quedó posicionado a la vanguardia de las decisiones crediticias basadas en datos alternativos en México.",
        en: "Early arrears drop by up to 40% on profiles evaluated with the bureau + T1Score combination. Credit issuers tap into an approval universe that was previously pure guesswork, and financial inclusion shifts from promise to measurable metric. The market adopted T1's solution quickly, positioning Círculo de Crédito at the forefront of alternative-data credit decisions in Mexico.",
      },
    },
    readingTime: 4,
    publishedAt: "2026-02-10",
  },
  {
    slug: "doto",
    slugEn: "doto",
    company: "Doto",
    logoSrc: "/images/partners/doto.png",
    industry: { es: "Tecnología", en: "Technology" },
    industrySlug: "tecnologia",
    size: "growth",
    solutions: ["T1 Envíos"],
    contentType: "video",
    videoId: "nKPCKDAd8Vg",
    videoCaption: {
      es: "Mejoramos los tiempos de entrega un 30% con T1.",
      en: "We improved delivery times by 30% with T1.",
    },
    heroImage: "/images/articles/DOTO/AZT18598.JPG",
    heroImageFocal: "55% 25%",
    images: [
      "/images/articles/DOTO/AZT18599.JPG",
      "/images/articles/DOTO/AZT18610.JPG",
      "/images/articles/DOTO/AZT18628.JPG",
    ],
    articleImageFocal: "55% 25%",
    title: {
      es: "Doto y la apuesta por una logística unificada en el e-commerce de electrónica",
      en: "Doto's bet on unified logistics for electronics e-commerce",
    },
    subtitle: {
      es: "Centralización logística que transformó la operación de e-commerce de electrónica",
      en: "Logistics centralization that transformed the electronics e-commerce operation",
    },
    executiveSummary: {
      es: "Doto, la marca de electrónica del grupo DGL LATAM, centralizó su operación logística multi-paquetería con T1 Envíos. El resultado: 30% más velocidad de entrega y 20% menos costo de last-mile.",
      en: "Doto, DGL LATAM's electronics brand, centralized its multi-carrier logistics with T1 Envíos. The result: 30% faster deliveries and 20% lower last-mile costs.",
    },
    metrics: [
      { value: { es: "30%", en: "30%" }, label: { es: "Mejora en tiempos de entrega", en: "Improvement in delivery times" } },
      { value: { es: "20%", en: "20%" }, label: { es: "Reducción en costos logísticos", en: "Reduction in logistics costs" } },
    ],
    quote: {
      text: {
        es: "Nuestros tiempos de entrega mejoraron en un 30% gracias a tener el seguimiento centralizado y logramos reducir en un 20% los costos por la orquestación que tenemos con diferentes paqueterías.",
        en: "Our delivery times improved by 30% thanks to centralized tracking and we reduced costs by 20% through the orchestration we have with different carriers.",
      },
      short: {
        es: "Centralizar con T1 nos dio 30% más velocidad y 20% menos costo.",
        en: "Centralizing with T1 gave us 30% more speed and 20% less cost.",
      },
      highlight: {
        es: "tiempos de entrega mejoraron en un 30%",
        en: "delivery times improved by 30%",
      },
      author: "Jacobo Zutton",
      role: { es: "Jefe de E-commerce, DGL LATAM", en: "Head of E-commerce, DGL LATAM" },
      photo: "/images/articles/DOTO/AZT18598.JPG",
    },
    content: {
      intro: {
        es: "Doto es la marca de electrónica de consumo de DGL LATAM. Su catálogo cubre smartphones, laptops, gadgets y accesorios a precios competitivos para el mercado mexicano, y su tienda en línea es el motor del negocio: el canal donde se concentra el crecimiento doble dígito año tras año. Doto compite en una de las verticales de e-commerce más exigentes — donde el precio se compara en tiempo real y la experiencia post-compra define la recompra.",
        en: "Doto is DGL LATAM's consumer electronics brand. Its catalog covers smartphones, laptops, gadgets and accessories at competitive pricing for the Mexican market, and its online store is the business engine — the channel where double-digit annual growth happens. Doto competes in one of the toughest e-commerce verticals, where price is compared in real time and the post-purchase experience defines repeat sales.",
      },
      challenge: {
        es: "Antes de centralizar, Doto operaba con cuatro paqueterías en paralelo, cada una con su propio convenio, su propia API y su propia conciliación. Un equipo entero juntaba archivos de Excel cada mes para reconciliar facturas y resolver incidencias. Una queja de un cliente — pedido perdido, retraso, daño en tránsito — era un problema de detective. Y el cliente final no veía estatus consistentes: cada paquetería entregaba etiquetas, tracking y nomenclaturas distintas, fragmentando la experiencia post-compra.",
        en: "Before centralizing, Doto ran four carriers in parallel, each with its own contract, API and reconciliation. An entire team stitched together Excel files every month to reconcile invoices and resolve incidents. A customer complaint — lost order, delay, in-transit damage — was a detective problem. And the end customer didn't see consistent statuses: each carrier delivered different labels, tracking, and naming, fragmenting the post-purchase experience.",
      },
      solution: {
        es: "Con T1 Envíos, Doto consolidó toda su operación logística en una sola plataforma. T1 Envíos se encarga de la generación automática de guías, el ruteo dinámico según reglas y cotizaciones por código postal, la conciliación unificada de todas las paqueterías, y el tracking en tiempo real con estatus homologados. La integración con T1 dejó a Doto con una sola fuente de verdad para todo el last-mile, una sola consola operativa, y una sola conversación coherente con su cliente final.",
        en: "With T1 Envíos, Doto consolidated its entire logistics operation onto a single platform. T1 Envíos handles automatic label generation, dynamic routing based on rules and postal-code quotes, unified reconciliation across carriers, and real-time tracking with standardized statuses. The integration with T1 left Doto with a single source of truth for the entire last-mile, a single operations console, and a single coherent conversation with its end customer.",
      },
      results: {
        es: "Tiempos de entrega 30% más rápidos. Costos logísticos 20% menores gracias a la orquestación multi-paquetería de T1 Envíos. La visibilidad en tiempo real cambió por completo la conversación con el cliente: lo que antes eran reclamos retroactivos, hoy son alertas proactivas que se resuelven antes de que el cliente las note. La fricción del post-venta dejó de ser un costo oculto del crecimiento.",
        en: "30% faster delivery times. 20% lower logistics costs thanks to T1 Envíos' multi-carrier orchestration. Real-time visibility completely changed the customer conversation: what used to be retroactive complaints are now proactive alerts that get resolved before the customer notices. Post-purchase friction stopped being a hidden cost of growth.",
      },
    },
    readingTime: 5,
    publishedAt: "2026-02-24",
  },
  {
    slug: "makora",
    slugEn: "makora",
    company: "Makora",
    logoSrc: "/images/partners/makora.svg",
    industry: { es: "Hogar y Decoración", en: "Home & Decor" },
    industrySlug: "hogar-y-decoracion",
    size: "startup",
    solutions: ["T1 Tienda", "T1 Envíos", "T1 Pagos"],
    contentType: "video",
    videoId: "7l0BDngMRUk",
    videoCaption: {
      es: "Creamos nuestra tienda en línea en un minuto.",
      en: "We built our online store in one minute.",
    },
    heroImage: "/images/articles/MAKORA/AZT17583.JPG",
    heroImageFocal: "58% 40%",
    heroPreviewDarken: true,
    images: ["/images/articles/MAKORA/AZT17566.JPG"],
    articleImageFocal: "42% 30%",
    title: {
      es: "Makora redefine el retail de muebles desde lo digital",
      en: "Makora is redefining furniture retail from a digital-first lens",
    },
    subtitle: {
      es: "Una marca de muebles 100% online que transformó su operación con el ecosistema completo de T1",
      en: "A 100% online furniture brand that transformed its operations with T1's complete ecosystem",
    },
    executiveSummary: {
      es: "Makora, la marca mexicana de muebles modulares, lanzó su tienda en línea con el ecosistema T1 completo: tienda, pagos y envíos en una sola integración. Lo que un equipo de e-commerce tradicional construye en meses, Makora lo activó en un minuto.",
      en: "Makora, the Mexican modular furniture brand, launched its online store with the full T1 ecosystem — store, payments, and shipping in a single integration. What traditional e-commerce teams build in months, Makora activated in one minute.",
    },
    metrics: [
      { value: { es: "1 min", en: "1 min" }, label: { es: "Tiempo de lanzamiento de tienda", en: "Store launch time" } },
      { value: { es: "3", en: "3" }, label: { es: "Productos T1 integrados", en: "T1 products integrated" } },
      { value: { es: "100%", en: "100%" }, label: { es: "Operación online", en: "Online operation" } },
    ],
    quote: {
      text: {
        es: "Lo puedes crear en cinco minutos, lo que a nosotros nos tardó seis meses en poder realizar. Realmente te están solucionando todas las herramientas que tú necesitas para que tu tienda tenga éxito.",
        en: "You can set it up in five minutes — something that took us six months to pull off. They truly give you every tool you need for your store to succeed.",
      },
      short: {
        es: "Lo que tardó 6 meses, ahora se hace en 5 minutos.",
        en: "What took us 6 months now takes 5 minutes.",
      },
      highlight: {
        es: "crear en cinco minutos",
        en: "set it up in five minutes",
      },
      author: "Marín Ramos",
      role: { es: "Fundador y Director General, Makora", en: "Founder & CEO, Makora" },
      photo: "/images/articles/MAKORA/AZT17583.JPG",
    },
    content: {
      intro: {
        es: "Makora es una marca mexicana de muebles modulares pensada para la vida 100% online. Sus piezas se arman en cinco minutos sin herramientas y se envían en una sola caja a toda la república mexicana. Desde el día cero, Makora se concibió como una marca digital nativa, sin tienda física, sin showroom, y con una propuesta clara: democratizar el mueble bien diseñado a precios accesibles.",
        en: "Makora is a Mexican modular furniture brand built for 100% online living. Its pieces assemble in five minutes without tools and ship in a single box across Mexico. From day zero, Makora was conceived as a digitally native brand — no physical store, no showroom — with a clear mission: democratize well-designed furniture at accessible prices.",
      },
      challenge: {
        es: "Lanzar una tienda en línea desde cero requiere tres piezas que rara vez encajan: una plataforma e-commerce, una pasarela de pagos confiable y logística con cobertura nacional. Cada una con su propio proveedor, su propio contrato, su propia curva de integración. Para una startup de muebles, el camino tradicional son seis meses de ingeniería y desarrollo antes de poder vender la primera pieza — tiempo y capital que una marca naciente no tiene.",
        en: "Launching an online store from scratch requires three pieces that rarely fit together: an e-commerce platform, a reliable payment gateway, and logistics with nationwide coverage. Each with its own provider, contract, and integration curve. For a furniture startup, the traditional path is six months of engineering before selling the first piece — time and capital a young brand simply doesn't have.",
      },
      solution: {
        es: "Makora integró el ecosistema T1 completo en una sola decisión. T1 Tienda creó la plataforma con configuración asistida por inteligencia artificial. T1 Pagos resolvió la pasarela con tasas de aprobación competitivas y métodos de pago locales (tarjetas, SPEI, OXXO Pay, meses sin intereses). T1 Envíos cubrió la logística con tarifas escalables y cobertura de códigos postales en todo el país. Tres productos, una sola integración, un solo equipo de soporte.",
        en: "Makora integrated the full T1 ecosystem in a single decision. T1 Tienda built the platform with AI-assisted setup. T1 Pagos solved the payment gateway with competitive approval rates and local payment methods (cards, SPEI, OXXO Pay, installments). T1 Envíos covered logistics with scalable rates and postal code coverage nationwide. Three products, a single integration, a single support team.",
      },
      results: {
        es: "La tienda quedó lista para vender en un minuto. La conversión subió desde el primer día gracias a una pasarela que no añade fricción al checkout. Los envíos llegan a costos comparables con los de un retailer establecido. Hoy Makora compite con marcas de muebles que tienen diez veces su tamaño operativo, sin haber construido infraestructura propia y sin distraer al equipo del foco real: el producto.",
        en: "The store was ready to sell in one minute. Conversion went up from day one thanks to a gateway that adds no checkout friction. Shipments arrive at costs comparable to an established retailer's. Today Makora competes with furniture brands ten times its operational size, without building infrastructure of its own and without distracting the team from the real focus: the product.",
      },
    },
    readingTime: 4,
    publishedAt: "2026-03-10",
  },
  {
    slug: "pase",
    slugEn: "pase",
    company: "PASE",
    logoSrc: "/images/partners/pase.png",
    industry: { es: "Tecnología", en: "Technology" },
    industrySlug: "tecnologia",
    size: "enterprise",
    solutions: ["T1 Pagos", "T1 Envíos"],
    contentType: "video",
    videoId: "ezeCCveM8y4",
    videoCaption: {
      es: "Aprobamos el 98% de las transacciones en menos de medio segundo.",
      en: "We approve 98% of transactions in under half a second.",
    },
    heroImage: "/images/articles/PASE/AZT17352.jpg",
    heroImageFocal: "37% 30%",
    images: [
      "/images/articles/PASE/AZT17356.jpg",
      "/images/articles/PASE/AZT17359.jpg",
      "/images/articles/PASE/AZT17427.JPG",
    ],
    articleImageFocal: "45% 30%",
    title: {
      es: "Cómo PASE construyó la infraestructura de pago de la movilidad mexicana",
      en: "How PASE built the payment infrastructure for Mexican mobility",
    },
    subtitle: {
      es: "Seguridad, velocidad y cero fraudes en la operación de movilidad más grande de México",
      en: "Security, speed, and zero fraud in Mexico's largest mobility operation",
    },
    executiveSummary: {
      es: "PASE, la red más grande de telepeaje y movilidad en México, adoptó T1 Pagos para procesar transacciones en menos de medio segundo, con tasa de aprobación del 98% y operación libre de fraude.",
      en: "PASE, Mexico's largest electronic toll and mobility network, adopted T1 Pagos to process transactions in under half a second, with a 98% approval rate and fraud-free operations.",
    },
    metrics: [
      { value: { es: "98%", en: "98%" }, label: { es: "Tasa de aprobación de transacciones", en: "Transaction approval rate" } },
      { value: { es: "<0.5s", en: "<0.5s" }, label: { es: "Tiempo de decisión por transacción", en: "Decision time per transaction" } },
      { value: { es: "700K+", en: "700K+" }, label: { es: "Recargas administradas", en: "Top-ups managed" } },
    ],
    quote: {
      text: {
        es: "Tenemos la capacidad de tomar una decisión de aprobación de una transacción en menos de medio segundo. Y el 98% de estas operaciones son aprobadas. Nos da la garantía de una operación sin fraudes.",
        en: "We can make a transaction approval decision in under half a second. And 98% of those transactions go through. It guarantees us a completely fraud-free operation.",
      },
      short: {
        es: "Aprobamos 98% de transacciones en menos de medio segundo.",
        en: "We approve 98% of transactions in under half a second.",
      },
      highlight: {
        es: "el 98% de estas operaciones son aprobadas",
        en: "98% of those transactions go through",
      },
      author: "Alexis Reséndiz Mesa",
      role: { es: "Director General, PASE", en: "CEO, PASE" },
      photo: "/images/articles/PASE/AZT17427.JPG",
    },
    content: {
      intro: {
        es: "PASE opera la red de telepeaje y servicios de movilidad más grande de México. Tags, recargas, estacionamientos, asistencias en carretera y soluciones de turismo conviven en una infraestructura por la que pasa casi toda la red carretera de cuota del país. Más de 700 mil recargas mensuales sostienen la operación, y cada una de ellas debe procesarse al ritmo del flujo vehicular en una caseta — no al ritmo de un checkout tradicional.",
        en: "PASE runs Mexico's largest electronic toll and mobility services network. Tags, recharges, parking, roadside assistance and tourism solutions sit on infrastructure that handles nearly the entire toll road network in the country. Over 700,000 monthly recharges sustain the operation, and each one has to process at the pace of toll-booth traffic flow — not at the pace of a traditional checkout.",
      },
      challenge: {
        es: "A esa escala, cada milisegundo de latencia y cada punto de tasa de aprobación se traducen en miles de transacciones perdidas y filas embotelladas en caseta. Y en una operación que toca datos sensibles del usuario — saldo, tag, vehículo, recorrido — la seguridad no es opcional. PASE necesitaba procesar más rápido sin abrir frente a fraudes, y simultáneamente entregar tags físicos a usuarios en todo el país con visibilidad de cada paso del envío.",
        en: "At that scale, every millisecond of latency and every approval rate point translates into thousands of lost transactions and bottlenecked toll lines. And in an operation that touches sensitive user data — balance, tag, vehicle, journey — security isn't optional. PASE needed to process faster without opening doors to fraud, and simultaneously deliver physical tags to users nationwide with visibility into every shipment step.",
      },
      solution: {
        es: "T1 Pagos se convirtió en el motor de procesamiento transaccional de PASE. Decisiones de aprobación en menos de medio segundo, reglas anti-fraude calibradas específicamente para el patrón de movilidad y casetas, y arquitectura redundante para garantizar continuidad operativa 24/7. En paralelo, T1 Envíos se hizo cargo de la logística de distribución de tags a todo el país, con visibilidad de entrega en tiempo real para cada usuario.",
        en: "T1 Pagos became PASE's transactional processing engine. Approval decisions in under half a second, fraud rules calibrated specifically for the mobility and toll-booth pattern, and redundant architecture for guaranteed 24/7 operational continuity. In parallel, T1 Envíos took over tag distribution logistics nationwide, with real-time delivery visibility for every user.",
      },
      results: {
        es: "El 98% de las transacciones se aprueban; el resto cae en revisión, no en fraude. La operación procesa al ritmo del flujo vehicular en una caseta sin embotellar la fila. Más de 2 mil entregas mensuales de tags llegan a destino con tracking auditable, eliminando del reporte la categoría de tag perdido en tránsito. PASE pasó de tener un cuello de botella tecnológico a operar con la latencia de una infraestructura de pagos de clase mundial.",
        en: "98% of transactions are approved; the rest fall into review, not fraud. The operation processes at toll-booth traffic pace without bottlenecking the line. Over 2,000 monthly tag deliveries reach destination with auditable tracking, eliminating the lost-in-transit category from the incident report. PASE went from having a technology bottleneck to operating with the latency of a world-class payments infrastructure.",
      },
    },
    readingTime: 4,
    publishedAt: "2026-03-24",
  },
  {
    slug: "sears",
    slugEn: "sears",
    company: "Sears México",
    logoSrc: "/images/partners/sears.png",
    industry: { es: "Retail y Moda", en: "Retail & Fashion" },
    industrySlug: "retail-y-moda",
    size: "enterprise",
    solutions: ["T1 Envíos", "T1 Tienda"],
    contentType: "video",
    videoId: "KtUy7AhmdlA",
    videoCaption: {
      es: "En T1 encontramos un partner que escala con nosotros.",
      en: "In T1 we found a partner that scales with us.",
    },
    heroImage: "/images/articles/SEARS/AZT18725.JPG",
    heroImageFocal: "center 25%",
    images: [
      "/images/articles/SEARS/AZT18695.JPG",
      "/images/articles/SEARS/AZT18714.JPG",
    ],
    articleImageFocal: "center 20%",
    title: {
      es: "Sears México: la reinvención de un ícono del retail mexicano",
      en: "Sears México: reinventing a Mexican retail icon",
    },
    subtitle: {
      es: "De operación convencional a alta competitividad digital con T1 como socio tecnológico",
      en: "From conventional operations to high digital competitiveness with T1 as technology partner",
    },
    executiveSummary: {
      es: "Sears México, el retailer omnicanal de Grupo Sanborns, convirtió a T1 en su core logístico para todas sus marcas. Hoy entrega el mismo día en zonas metropolitanas y opera con la velocidad de una tech company sin perder su ADN retail.",
      en: "Sears México, Grupo Sanborns' omnichannel retailer, made T1 its logistics core across all brands. It now delivers same-day in metro areas and operates at tech-company speed without losing its retail DNA.",
    },
    metrics: [
      { value: { es: "Mismo día", en: "Same day" }, label: { es: "Entregas en áreas metropolitanas", en: "Delivery in metro areas" } },
      { value: { es: "Nacional", en: "Nationwide" }, label: { es: "Cobertura logística", en: "Logistics coverage" } },
    ],
    quote: {
      text: {
        es: "Encontramos en T1 un partner que nos solucionó toda la parte de tecnología pero que además crece en función de nuestras necesidades. Estamos logrando una cobertura a nivel nacional que en radios cortos de áreas metropolitanas podemos entregar el mismo día.",
        en: "In T1 we found a partner that solved our entire technology stack — and one that scales with us as we grow. We now have nationwide coverage, and in metro areas we can deliver the same day.",
      },
      short: {
        es: "Cobertura nacional con entregas el mismo día en metropolitanas.",
        en: "Nationwide coverage with same-day delivery in metro areas.",
      },
      highlight: {
        es: "podemos entregar el mismo día",
        en: "we can deliver the same day",
      },
      author: "Mario Muñoz",
      role: { es: "Chief Digital Officer, Grupo Sanborns", en: "Chief Digital Officer, Grupo Sanborns" },
      photo: "/images/articles/SEARS/AZT18725.JPG",
    },
    content: {
      intro: {
        es: "Sears México es parte de Grupo Sanborns, uno de los conglomerados retailers más reconocidos del país. Tiendas físicas, e-commerce, marketplace y omnicanalidad genuina conviven en un solo grupo. La estrategia digital de Sears se sostiene sobre dos diferenciadores que el cliente percibe en cada compra: velocidad de entrega y cobertura nacional. En un mercado donde los players nativamente digitales redefinen las expectativas de servicio cada trimestre, mantener esa promesa requiere una infraestructura logística que escale al ritmo del consumidor.",
        en: "Sears México is part of Grupo Sanborns, one of Mexico's most recognized retail conglomerates. Physical stores, e-commerce, marketplace, and genuine omnichannel coexist in a single group. Sears' digital strategy relies on two differentiators that the customer feels in every purchase: delivery speed and nationwide coverage. In a market where digitally-native players redefine service expectations every quarter, keeping that promise requires logistics infrastructure that scales at the consumer's pace.",
      },
      challenge: {
        es: "La velocidad del comercio digital obligó a una decisión estratégica: o construir una empresa de tecnología logística dentro de Sears, o aliarse con quien ya la tuviera. La primera opción significaba años de inversión en talento e infraestructura, distrayendo al grupo de su foco real, que es el retail. La segunda, encontrar un partner tecnológico que escalara al ritmo del negocio y se integrara limpiamente con todas las marcas y formatos del grupo, sin imponer fricciones operativas.",
        en: "The speed of digital commerce forced a strategic decision: either build a logistics tech company inside Sears, or partner with someone who already had one. The first option meant years of investment in talent and infrastructure, distracting the group from its real focus, retail. The second, finding a technology partner that would scale at business pace and integrate cleanly with all the group's brands and formats without imposing operational friction.",
      },
      solution: {
        es: "T1 se convirtió en el core logístico de todas las marcas y formatos de Grupo Sanborns. T1 orquesta tracking, sellers, marketplaces y entregas con un solo set de APIs integrado al stack interno de Sears. Las marcas que operan dentro del marketplace de Sears acceden a la misma experiencia de envío, sin importar el carrier final ni el formato de la tienda. T1 Tienda y T1 Envíos trabajan en conjunto sobre la misma plataforma, lo que elimina las inconsistencias clásicas de un setup multi-vendor.",
        en: "T1 became the logistics core for all brands and formats in Grupo Sanborns. T1 orchestrates tracking, sellers, marketplaces and deliveries with a single set of APIs integrated into Sears' internal stack. Brands operating inside Sears' marketplace access the same shipping experience regardless of final carrier or store format. T1 Tienda and T1 Envíos work together on the same platform, eliminating the typical inconsistencies of a multi-vendor setup.",
      },
      results: {
        es: "Cobertura logística nacional. Entrega el mismo día en zonas metropolitanas. Sears compite contra players nativamente digitales sin perder su músculo de retail físico — una ventaja competitiva que pocos retailers tradicionales logran articular. La alianza con T1 dejó a Sears con la velocidad de una tech company y la escala de un grupo retail consolidado, una combinación que en el comercio mexicano se cuenta con los dedos de una mano.",
        en: "Nationwide logistics coverage. Same-day delivery in metro areas. Sears competes against digitally-native players without losing its physical retail muscle — a competitive edge few traditional retailers manage to articulate. The partnership with T1 gave Sears the speed of a tech company and the scale of a consolidated retail group, a combination you can count on one hand in Mexican commerce.",
      },
    },
    readingTime: 5,
    publishedAt: "2026-04-07",
  },
  {
    slug: "sesen",
    slugEn: "sesen",
    company: "Sesen",
    logoSrc: "/images/partners/sesen.png",
    industry: { es: "Salud y Belleza", en: "Health & Beauty" },
    industrySlug: "salud-y-belleza",
    size: "growth",
    solutions: ["T1 Tienda", "T1 Envíos", "T1 Pagos"],
    contentType: "video",
    videoId: "9RhBr228C_o",
    videoCaption: {
      es: "Sin la infraestructura de T1, escalar sería imposible.",
      en: "Without T1's infrastructure, scaling would be impossible.",
    },
    heroImage: "/images/articles/SESEN/AZT17596.JPG",
    heroImageFocal: "center 25%",
    images: [
      "/images/articles/SESEN/AZT17598.JPG",
      "/images/articles/SESEN/AZT17600.JPG",
    ],
    articleImageFocal: "center 25%",
    title: {
      es: "Sesen y la nueva generación de marcas de bienestar D2C en México",
      en: "Sesen and the new wave of D2C wellness brands in Mexico",
    },
    subtitle: {
      es: "Suplementos de alta calidad que crecieron de cero a escala nacional con el ecosistema T1",
      en: "High-quality supplements that grew from zero to national scale with the T1 ecosystem",
    },
    executiveSummary: {
      es: "Sesen, la marca mexicana de suplementos alimenticios, escaló con T1 desde su día uno. Hoy procesa más de 15 mil órdenes al año y cerca de un millón de visitas, sin construir infraestructura propia.",
      en: "Sesen, the Mexican supplements brand, scaled with T1 from day one. Today it processes over 15,000 annual orders and nearly a million visits — without building its own infrastructure.",
    },
    metrics: [
      { value: { es: "~1M", en: "~1M" }, label: { es: "Visitas anuales al sitio", en: "Annual website visits" } },
      { value: { es: "15K+", en: "15K+" }, label: { es: "Órdenes de compra anuales", en: "Annual purchase orders" } },
    ],
    quote: {
      text: {
        es: "Tenemos casi un millón de visitas al año, tenemos más de 15 mil órdenes de compra. Si no tuviéramos un aliado con la infraestructura que tiene T1, para nosotros sería muy complicado.",
        en: "We get nearly one million visits a year and over 15,000 purchase orders. Without a partner with T1's infrastructure behind us, things would be incredibly difficult.",
      },
      short: {
        es: "Sin la infraestructura de T1, todo esto sería imposible.",
        en: "Without T1's infrastructure, none of this would be possible.",
      },
      highlight: {
        es: "casi un millón de visitas al año",
        en: "nearly one million visits a year",
      },
      author: "Karim Nakid",
      role: { es: "Cofundador, Sesen Company", en: "Co-founder, Sesen Company" },
      photo: "/images/articles/SESEN/AZT17600.JPG",
    },
    content: {
      intro: {
        es: "Sesen es una marca 100% mexicana de suplementos alimenticios. Manejan la vertical completa desde Tehuacán: recepción de materias primas, producción, empacado, control de calidad y comercialización. El canal e-commerce es la columna comercial del negocio y el motor de su expansión nacional. En un sector donde la confianza del consumidor es el activo principal, Sesen apuesta por el control end-to-end de la experiencia, desde la formulación hasta el unboxing.",
        en: "Sesen is a 100% Mexican brand of dietary supplements. They run the full vertical from Tehuacán: raw materials reception, production, packaging, quality control and commercialization. The e-commerce channel is the commercial backbone of the business and the engine of its national expansion. In a sector where consumer trust is the core asset, Sesen bets on end-to-end control of the experience, from formulation to unboxing.",
      },
      challenge: {
        es: "Cuando Sesen empezó, el e-commerce mexicano todavía era territorio sin mapear. La pregunta no era qué plataforma usar — era cuál existía, cuál era confiable, cuál podía resolver pagos y envíos a la vez. Una marca recién nacida no tiene tiempo ni recursos para construir cada pieza desde cero, ni para integrar tres proveedores distintos antes de procesar el primer pedido. La fricción de armar el stack es lo que mata a la mayoría de los proyectos antes de su primer trimestre.",
        en: "When Sesen started, Mexican e-commerce was still uncharted territory. The question wasn't which platform to use — it was which existed, which was reliable, which could solve payments and shipping at once. A new brand has neither time nor resources to build each piece from scratch, nor to integrate three separate vendors before processing its first order. The friction of assembling the stack is what kills most projects before their first quarter.",
      },
      solution: {
        es: "Sesen integró el ecosistema T1 desde su día uno. T1 Tienda como plataforma de venta, T1 Pagos para resolver la pasarela de cobro con métodos locales y tasas de aprobación competitivas, y T1 Envíos para mover producto desde Tehuacán a toda la república mexicana. Tres productos en una sola integración, una sola consola, un solo equipo de soporte. El stack de T1 acompañó al negocio desde sus primeros mil pedidos hasta su escala actual sin necesidad de migrar plataforma.",
        en: "Sesen integrated the T1 ecosystem from day one. T1 Tienda as the sales platform, T1 Pagos to solve the payment gateway with local methods and competitive approval rates, and T1 Envíos to move product from Tehuacán across Mexico. Three products in a single integration, a single console, a single support team. T1's stack accompanied the business from its first thousand orders to its current scale without ever requiring a platform migration.",
      },
      results: {
        es: "Casi un millón de visitas anuales al sitio. Más de 15 mil órdenes de compra procesadas al año. Sesen escala internacionalmente sin construir infraestructura propia — la misma stack de T1 que les sirvió en sus primeros mil pedidos los acompaña hacia los mercados de LATAM. La inversión inicial en arquitectura tecnológica se difiere por completo, lo que libera capital para producto, marketing y formulación.",
        en: "Nearly one million annual website visits. Over 15,000 purchase orders processed per year. Sesen scales internationally without building its own infrastructure — the same T1 stack that served their first thousand orders now accompanies them into LATAM markets. The initial investment in technology architecture is fully deferred, freeing capital for product, marketing, and formulation.",
      },
    },
    readingTime: 4,
    publishedAt: "2026-04-21",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug || a.slugEn === slug);
}

export function getArticlesByFilter(filters: {
  size?: string;
  industry?: string;
  solution?: string;
  contentType?: string;
}): Article[] {
  return articles.filter((article) => {
    if (filters.size && article.size !== filters.size) return false;
    if (filters.industry && article.industrySlug !== filters.industry) return false;
    if (filters.solution && !article.solutions.includes(filters.solution)) return false;
    if (filters.contentType && article.contentType !== filters.contentType) return false;
    return true;
  });
}
