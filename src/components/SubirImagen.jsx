import { useState } from "react";

// Sube una imagen a Cloudinary (unsigned) y devuelve la URL vía onChange.
// El cloud name y el preset son públicos (no son secretos).
const CLOUD = "dw26ujhoo";
const PRESET = "portafolio_unsigned";

export default function SubirImagen({ value, onChange, label = "Imagen" }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function subir(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json.secure_url) throw new Error(json.error?.message || "Falló la subida");
      onChange(json.secure_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-14 w-14 rounded-md border border-line object-cover" />
        ) : (
          <div className="grid h-14 w-14 place-items-center rounded-md border border-dashed border-line text-[10px] text-muted-2">
            sin foto
          </div>
        )}
        <label className="cursor-pointer rounded-lg border border-line bg-ink px-3 py-2 text-xs text-bone transition hover:border-muted-2 active:scale-95">
          {subiendo ? "Subiendo…" : "Subir imagen"}
          <input type="file" accept="image/*" className="hidden" onChange={subir} disabled={subiendo} />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted-2 underline transition hover:text-rosa"
          >
            quitar
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rosa">{error}</p>}
    </div>
  );
}
