// Fuente de verdad del contenido público: los JSON del repo.
// El CMS los edita vía GitHub API → commit → Vercel rebuildea → estas páginas se actualizan.
import siteData from "../content/site.json";
import proyectosData from "../content/proyectos.json";
import stackData from "../content/stack.json";
import procesoData from "../content/proceso.json";
import faqData from "../content/faq.json";
import testimoniosData from "../content/testimonios.json";

// --- Modelos (tipar evita que un array vacío se infiera como never[]) ---
export interface Proyecto {
  titulo: string;
  marca?: string;
  descripcion: string;
  metrica?: string;
  tags?: string[];
  imagen?: string;
  badge?: string;
  urlVivo?: string;
  urlRepo?: string;
}
export interface GrupoStack {
  titulo: string;
  items: string[];
}
export interface Stack {
  grupos: GrupoStack[];
  nota: string;
}
export interface Paso {
  n: string;
  titulo: string;
  texto: string;
  sello?: boolean;
}
export interface Pregunta {
  pregunta: string;
  respuesta: string;
}
export interface Testimonio {
  texto: string;
  autor: string;
  rol: string;
}

export const site = siteData;
export const proyectos = proyectosData as Proyecto[];
export const stack = stackData as Stack;
export const proceso = procesoData as Paso[];
export const faq = faqData as Pregunta[];
export const testimonios = testimoniosData as Testimonio[];
