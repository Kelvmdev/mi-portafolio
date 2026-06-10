// Optimización de imágenes remotas de Cloudinary "al vuelo" (manual §5.8):
// inserta f_auto (WebP/AVIF) + q_auto (compresión) + w_<ancho> (resize) tras /upload/.
// Reduce el peso ~10-20x. Si la URL no es de Cloudinary, la devuelve igual.
export const imagenOptimizada = (url: string, ancho: number): string =>
  url && url.includes("res.cloudinary.com/") && url.includes("/upload/")
    ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${ancho}/`)
    : url;
