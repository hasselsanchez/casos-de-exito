export const SITE_NAME = "T1";
export const SITE_URL = "https://t1.com";
export const SIGNUP_URL = "https://app.t1pagos.com/signup";
export const WHATSAPP_URL = "https://wa.me/5215512345678";

export const NAV_LINKS = {
  es: [
    { label: "Industrias", href: "#explorar" },
    { label: "Por solución", href: "#por-solucion" },
    { label: "Ecosistema", href: "https://t1.com/mx" },
  ],
  en: [
    { label: "Industries", href: "#explorar" },
    { label: "By solution", href: "#por-solucion" },
    { label: "Ecosystem", href: "https://t1.com/en" },
  ],
};

export const CTA_PRIMARY = {
  es: "Empieza con T1",
  en: "Get started with T1",
};

export const CTA_LOGIN = {
  es: "Iniciar sesión",
  en: "Log in",
};

export const HERO = {
  title: {
    es: "Historias de éxito",
    en: "Success stories",
  },
  titleAccent: {
    es: "que inspiran",
    en: "that inspire",
  },
  subtitle: {
    es: "Descubre cómo empresas de todos los tamaños transforman sus operaciones de comercio con T1.",
    en: "Discover how businesses of all sizes transform their commerce operations with T1.",
  },
};

/** Index of the article in articles[] to feature in the hero */
export const HERO_FEATURED_INDEX = 0; // Círculo de Crédito

export const GLOBAL_METRICS = [
  {
    value: "+25 mil",
    label: { es: "negocios confían en T1", en: "businesses trust T1" },
  },
  {
    value: "+$13B",
    label: { es: "procesados en pagos", en: "processed in payments" },
  },
  {
    value: "+40M",
    label: { es: "de envíos gestionados", en: "shipments managed" },
  },
  {
    value: "+10",
    label: { es: "integraciones disponibles", en: "integrations available" },
  },
];

export const SIZE_TABS = [
  { key: "all", label: { es: "Todos", en: "All" } },
  { key: "startup", label: { es: "Startup", en: "Startup" } },
  { key: "growth", label: { es: "Growth", en: "Growth" } },
  { key: "enterprise", label: { es: "Enterprise", en: "Enterprise" } },
];

export const SOLUTION_TABS = [
  { key: "all", label: { es: "Todos", en: "All" } },
  { key: "T1 Envíos", label: "T1 Envíos" },
  { key: "T1 Pagos", label: "T1 Pagos" },
  { key: "T1 Tienda", label: "T1 Tienda" },
  { key: "T1Score", label: "T1Score" },
];

export const INDUSTRIES = [
  { slug: "retail-y-moda", label: { es: "Retail y Moda", en: "Retail & Fashion" } },
  { slug: "alimentos-y-bebidas", label: { es: "Alimentos y Bebidas", en: "Food & Beverage" } },
  { slug: "salud-y-belleza", label: { es: "Salud y Belleza", en: "Health & Beauty" } },
  { slug: "tecnologia", label: { es: "Tecnología", en: "Technology" } },
  { slug: "servicios-financieros", label: { es: "Servicios Financieros", en: "Financial Services" } },
  { slug: "logistica", label: { es: "Logística", en: "Logistics" } },
  { slug: "hogar-y-decoracion", label: { es: "Hogar y Decoración", en: "Home & Decor" } },
  { slug: "deportes", label: { es: "Deportes", en: "Sports" } },
];

export const SOLUTIONS = [
  { key: "T1 Tienda", label: "T1 Tienda" },
  { key: "T1 Envíos", label: "T1 Envíos" },
  { key: "T1 Pagos", label: "T1 Pagos" },
  { key: "T1Score", label: "T1Score" },
];

/** Public URLs and logo paths for each T1 solution chip in article hero */
export const SOLUTION_META: Record<
  string,
  { logoSrc: string; url: string }
> = {
  "T1 Tienda": { logoSrc: "/logos/t1tienda.svg", url: "https://www.t1.com/mx" },
  "T1 Envíos": { logoSrc: "/logos/t1envios.svg", url: "https://www.t1.com/mx/envios" },
  "T1 Pagos": { logoSrc: "/logos/t1pagos.svg", url: "https://t1.com/mx/pagos/" },
  "T1Score": { logoSrc: "/logos/t1score.svg", url: "https://t1.com/mx/score/" },
};

export const T1_HOME_URL = "https://www.t1.com/mx";

export const EDITORIAL_SECTION = {
  title: {
    es: "Empresas de todos los tamaños eligen",
    en: "Businesses of all sizes choose",
  },
  titleAccent: {
    es: "T1",
    en: "T1",
  },
  subtitle: {
    es: "Desde startups hasta enterprise, empresas de distintas industrias confían en T1 para transformar sus operaciones de comercio.",
    en: "From startups to enterprise, companies across industries trust T1 to transform their commerce operations.",
  },
};

export const FOOTER_LINKS = {
  solutions: {
    title: { es: "Soluciones", en: "Solutions" },
    links: [
      { label: "T1 Tienda", href: "https://t1.com/mx/tienda" },
      { label: "T1 Pagos", href: "https://t1.com/mx/pagos" },
      { label: "T1 Envíos", href: "https://t1.com/mx/envios" },
      { label: "T1Score", href: "https://t1.com/mx/score" },
    ],
  },
  company: {
    title: { es: "T1", en: "T1" },
    links: [
      { label: { es: "¿Qué es T1?", en: "What is T1?" }, href: "https://t1.com/mx/que-es-t1" },
      { label: { es: "Únete a T1", en: "Join T1" }, href: "https://t1.com/mx/partners" },
      { label: { es: "Historias de éxito", en: "Success stories" }, href: "/" },
      { label: { es: "Contacto", en: "Contact" }, href: "https://t1.com/mx/contacto" },
    ],
  },
};

export const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "https://linkedin.com/company/t1pagos", icon: "linkedin" },
  { name: "Instagram", href: "https://instagram.com/t1pagos", icon: "instagram" },
  { name: "X", href: "https://x.com/t1pagos", icon: "x" },
  { name: "Facebook", href: "https://facebook.com/t1pagos", icon: "facebook" },
  { name: "TikTok", href: "https://tiktok.com/@t1pagos", icon: "tiktok" },
];

export const ARTICLE_CTA = {
  title: {
    es: "Encuentra tu solución",
    en: "Find your solution",
  },
  subtitle: {
    es: "Descubre cómo T1 puede transformar las operaciones de tu negocio.",
    en: "Discover how T1 can transform your business operations.",
  },
};
