// Construye un enlace wa.me a partir del número (solo dígitos) + mensaje opcional.
export const waLink = (numero: string, mensaje = "Hola Kervin, vi tu portafolio y quiero una página."): string =>
  `https://wa.me/${(numero || "").replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
