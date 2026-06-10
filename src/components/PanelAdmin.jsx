import { useState } from "react";
import SubirImagen from "./SubirImagen.jsx";

const TABS = ["Sitio", "Proyectos", "Stack", "Proceso", "FAQ", "Testimonios"];

/* ---------- Primitivas de formulario ---------- */
const baseInput =
  "w-full rounded-[10px] border border-line bg-ink px-3.5 py-2.5 text-sm text-bone outline-none focus:border-rosa";

function Campo({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{label}</span>
      {children}
    </label>
  );
}
function Texto({ label, value, onChange, type = "text" }) {
  return (
    <Campo label={label}>
      <input type={type} className={baseInput} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Campo>
  );
}
function Area({ label, value, onChange, rows = 3 }) {
  return (
    <Campo label={label}>
      <textarea rows={rows} className={`${baseInput} resize-y`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Campo>
  );
}
function Check({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2.5 text-sm">
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-rosa" />
      {label}
    </label>
  );
}
const btnSec =
  "rounded-lg border border-line bg-ink px-3 py-2 text-xs font-medium text-bone transition hover:border-muted-2 active:scale-95";
const card = "rounded-[14px] border border-line bg-ink-2 p-5";

/* Tarjeta de un item de un array, con borrar y mover */
function ItemArray({ titulo, onBorrar, onSubir, onBajar, children }) {
  return (
    <div className={card}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted-2">{titulo}</span>
        <div className="flex gap-1.5">
          <button type="button" className={btnSec} onClick={onSubir} title="Subir">↑</button>
          <button type="button" className={btnSec} onClick={onBajar} title="Bajar">↓</button>
          <button type="button" className="rounded-lg border border-rosa/40 px-3 py-2 text-xs text-rosa transition hover:bg-rosa/10 active:scale-95" onClick={onBorrar}>
            Borrar
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

/* Mueve un elemento dentro de un array */
const mover = (arr, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copia = [...arr];
  [copia[i], copia[j]] = [copia[j], copia[i]];
  return copia;
};

/* ---------- Panel ---------- */
export default function PanelAdmin({ inicial }) {
  const [data, setData] = useState(inicial);
  const [tab, setTab] = useState("Sitio");
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState(null);

  const setClave = (clave, valor) => setData((d) => ({ ...d, [clave]: valor }));
  const setSite = (k, v) => setClave("site", { ...data.site, [k]: v });
  const setArr = (clave, i, k, v) =>
    setClave(clave, data[clave].map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));

  async function guardarTodo() {
    setGuardando(true);
    setMsg(null);
    try {
      const res = await fetch("/api/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.status === 401) throw new Error("Sesión expirada. Vuelve a entrar.");
      if (!res.ok) throw new Error(json.detalle || json.error || "Error al guardar");
      setMsg({ ok: true, txt: "✅ Guardado. Vercel está reconstruyendo (~30s, luego Ctrl+Shift+R)." });
    } catch (e) {
      setMsg({ ok: false, txt: "❌ " + e.message });
    } finally {
      setGuardando(false);
    }
  }

  const s = data.site;

  return (
    <div className="mx-auto max-w-[920px] px-[clamp(16px,4vw,40px)] py-8">
      {/* Cabecera */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Panel de contenido</h1>
          <p className="text-sm text-muted">Edita todo, luego pulsa “Guardar todo” (un solo commit).</p>
        </div>
        <form method="POST" action="/api/logout">
          <button type="submit" className={btnSec}>Cerrar sesión</button>
        </form>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
              tab === t ? "bg-rosa-deep text-white" : "border border-line text-muted hover:text-bone"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* SITIO */}
      {tab === "Sitio" && (
        <div className="flex flex-col gap-4">
          <div className={card}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Texto label="Nombre" value={s.nombre} onChange={(v) => setSite("nombre", v)} />
              <Texto label="Rol" value={s.rol} onChange={(v) => setSite("rol", v)} />
            </div>
            <div className="mt-3"><Texto label="Eyebrow (encabezado del hero)" value={s.eyebrow} onChange={(v) => setSite("eyebrow", v)} /></div>
            <div className="mt-3"><Area label="Titular del hero" value={s.heroTitulo} onChange={(v) => setSite("heroTitulo", v)} rows={2} /></div>
            <div className="mt-3"><Area label="Tagline" value={s.tagline} onChange={(v) => setSite("tagline", v)} /></div>
          </div>

          <div className={card}>
            <Check label="Disponible para proyectos (muestra la píldora)" value={s.disponible} onChange={(v) => setSite("disponible", v)} />
            <div className="mt-3"><Texto label="Texto de disponibilidad" value={s.disponibleTexto} onChange={(v) => setSite("disponibleTexto", v)} /></div>
          </div>

          <div className={card}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Texto label="Correo" value={s.correo} onChange={(v) => setSite("correo", v)} />
              <Texto label="WhatsApp (solo dígitos, con país)" value={s.whatsapp} onChange={(v) => setSite("whatsapp", v)} />
              <Texto label="GitHub (URL)" value={s.github} onChange={(v) => setSite("github", v)} />
              <Texto label="X (URL, opcional)" value={s.x} onChange={(v) => setSite("x", v)} />
            </div>
            <div className="mt-3"><Texto label="Formspree URL" value={s.formspreeUrl} onChange={(v) => setSite("formspreeUrl", v)} /></div>
          </div>

          <div className={card}>
            <SubirImagen label="Foto (Sobre mí)" value={s.foto} onChange={(v) => setSite("foto", v)} />
            <div className="mt-3"><Texto label="Título de Sobre mí" value={s.sobreTitulo} onChange={(v) => setSite("sobreTitulo", v)} /></div>
            <div className="mt-3"><Area label="Sobre mí — párrafo 1" value={s.sobreTexto1} onChange={(v) => setSite("sobreTexto1", v)} /></div>
            <div className="mt-3"><Area label="Sobre mí — párrafo 2" value={s.sobreTexto2} onChange={(v) => setSite("sobreTexto2", v)} /></div>
          </div>

          <div className={card}>
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-rosa">Panel de specs (hero)</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Texto label="Proyecto" value={s.specProyecto} onChange={(v) => setSite("specProyecto", v)} />
              <Texto label="Score (número que cuenta)" type="number" value={s.specScore} onChange={(v) => setSite("specScore", Number(v))} />
              <Texto label="LCP" value={s.specLcp} onChange={(v) => setSite("specLcp", v)} />
              <Texto label="LCP antes (tachado)" value={s.specLcpAntes} onChange={(v) => setSite("specLcpAntes", v)} />
              <Texto label="Responsive" value={s.specResponsive} onChange={(v) => setSite("specResponsive", v)} />
              <Texto label="SEO" value={s.specSeo} onChange={(v) => setSite("specSeo", v)} />
              <Texto label="Stack" value={s.specStack} onChange={(v) => setSite("specStack", v)} />
            </div>
          </div>
        </div>
      )}

      {/* PROYECTOS */}
      {tab === "Proyectos" && (
        <div className="flex flex-col gap-4">
          {data.proyectos.map((p, i) => (
            <ItemArray
              key={i}
              titulo={`Proyecto ${i + 1}`}
              onBorrar={() => setClave("proyectos", data.proyectos.filter((_, idx) => idx !== i))}
              onSubir={() => setClave("proyectos", mover(data.proyectos, i, -1))}
              onBajar={() => setClave("proyectos", mover(data.proyectos, i, 1))}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Texto label="Título" value={p.titulo} onChange={(v) => setArr("proyectos", i, "titulo", v)} />
                <Texto label="Marca (placeholder visual)" value={p.marca} onChange={(v) => setArr("proyectos", i, "marca", v)} />
              </div>
              <Area label="Descripción" value={p.descripcion} onChange={(v) => setArr("proyectos", i, "descripcion", v)} rows={2} />
              <Texto label="Métrica" value={p.metrica} onChange={(v) => setArr("proyectos", i, "metrica", v)} />
              <Texto label="Tags (separados por coma)" value={(p.tags || []).join(", ")} onChange={(v) => setArr("proyectos", i, "tags", v.split(",").map((t) => t.trim()).filter(Boolean))} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Texto label="Badge" value={p.badge} onChange={(v) => setArr("proyectos", i, "badge", v)} />
                <div />
                <Texto label="URL en vivo" value={p.urlVivo} onChange={(v) => setArr("proyectos", i, "urlVivo", v)} />
                <Texto label="URL repo" value={p.urlRepo} onChange={(v) => setArr("proyectos", i, "urlRepo", v)} />
              </div>
              <SubirImagen label="Captura del proyecto" value={p.imagen} onChange={(v) => setArr("proyectos", i, "imagen", v)} />
            </ItemArray>
          ))}
          <button
            type="button"
            className={btnSec}
            onClick={() =>
              setClave("proyectos", [...data.proyectos, { titulo: "Nuevo proyecto", marca: "", descripcion: "", metrica: "", tags: [], imagen: "", badge: "", urlVivo: "", urlRepo: "" }])
            }
          >
            + Agregar proyecto
          </button>
        </div>
      )}

      {/* STACK */}
      {tab === "Stack" && (
        <div className="flex flex-col gap-4">
          {data.stack.grupos.map((g, i) => (
            <ItemArray
              key={i}
              titulo={`Grupo ${i + 1}`}
              onBorrar={() => setClave("stack", { ...data.stack, grupos: data.stack.grupos.filter((_, idx) => idx !== i) })}
              onSubir={() => setClave("stack", { ...data.stack, grupos: mover(data.stack.grupos, i, -1) })}
              onBajar={() => setClave("stack", { ...data.stack, grupos: mover(data.stack.grupos, i, 1) })}
            >
              <Texto label="Título del grupo" value={g.titulo} onChange={(v) => setClave("stack", { ...data.stack, grupos: data.stack.grupos.map((x, idx) => (idx === i ? { ...x, titulo: v } : x)) })} />
              <Area label="Items (uno por línea)" value={(g.items || []).join("\n")} onChange={(v) => setClave("stack", { ...data.stack, grupos: data.stack.grupos.map((x, idx) => (idx === i ? { ...x, items: v.split("\n").map((t) => t.trim()).filter(Boolean) } : x)) })} rows={4} />
            </ItemArray>
          ))}
          <button
            type="button"
            className={btnSec}
            onClick={() => setClave("stack", { ...data.stack, grupos: [...data.stack.grupos, { titulo: "Nuevo grupo", items: [] }] })}
          >
            + Agregar grupo
          </button>
          <div className={card}>
            <Area label="Nota del stack" value={data.stack.nota} onChange={(v) => setClave("stack", { ...data.stack, nota: v })} rows={2} />
          </div>
        </div>
      )}

      {/* PROCESO */}
      {tab === "Proceso" && (
        <div className="flex flex-col gap-4">
          {data.proceso.map((p, i) => (
            <ItemArray
              key={i}
              titulo={`Paso ${i + 1}`}
              onBorrar={() => setClave("proceso", data.proceso.filter((_, idx) => idx !== i))}
              onSubir={() => setClave("proceso", mover(data.proceso, i, -1))}
              onBajar={() => setClave("proceso", mover(data.proceso, i, 1))}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Texto label="Número (01, 02…)" value={p.n} onChange={(v) => setArr("proceso", i, "n", v)} />
                <Texto label="Título" value={p.titulo} onChange={(v) => setArr("proceso", i, "titulo", v)} />
              </div>
              <Area label="Texto" value={p.texto} onChange={(v) => setArr("proceso", i, "texto", v)} rows={2} />
              <Check label="Resaltar (sello ★)" value={p.sello} onChange={(v) => setArr("proceso", i, "sello", v)} />
            </ItemArray>
          ))}
          <button
            type="button"
            className={btnSec}
            onClick={() => setClave("proceso", [...data.proceso, { n: String(data.proceso.length + 1).padStart(2, "0"), titulo: "", texto: "", sello: false }])}
          >
            + Agregar paso
          </button>
        </div>
      )}

      {/* FAQ */}
      {tab === "FAQ" && (
        <div className="flex flex-col gap-4">
          {data.faq.map((q, i) => (
            <ItemArray
              key={i}
              titulo={`Pregunta ${i + 1}`}
              onBorrar={() => setClave("faq", data.faq.filter((_, idx) => idx !== i))}
              onSubir={() => setClave("faq", mover(data.faq, i, -1))}
              onBajar={() => setClave("faq", mover(data.faq, i, 1))}
            >
              <Texto label="Pregunta" value={q.pregunta} onChange={(v) => setArr("faq", i, "pregunta", v)} />
              <Area label="Respuesta" value={q.respuesta} onChange={(v) => setArr("faq", i, "respuesta", v)} rows={2} />
            </ItemArray>
          ))}
          <button
            type="button"
            className={btnSec}
            onClick={() => setClave("faq", [...data.faq, { pregunta: "", respuesta: "" }])}
          >
            + Agregar pregunta
          </button>
        </div>
      )}

      {/* TESTIMONIOS */}
      {tab === "Testimonios" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">Si está vacío, la sección no se muestra en el sitio.</p>
          {data.testimonios.map((t, i) => (
            <ItemArray
              key={i}
              titulo={`Testimonio ${i + 1}`}
              onBorrar={() => setClave("testimonios", data.testimonios.filter((_, idx) => idx !== i))}
              onSubir={() => setClave("testimonios", mover(data.testimonios, i, -1))}
              onBajar={() => setClave("testimonios", mover(data.testimonios, i, 1))}
            >
              <Area label="Texto" value={t.texto} onChange={(v) => setArr("testimonios", i, "texto", v)} rows={2} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Texto label="Autor" value={t.autor} onChange={(v) => setArr("testimonios", i, "autor", v)} />
                <Texto label="Rol" value={t.rol} onChange={(v) => setArr("testimonios", i, "rol", v)} />
              </div>
            </ItemArray>
          ))}
          <button
            type="button"
            className={btnSec}
            onClick={() => setClave("testimonios", [...data.testimonios, { texto: "", autor: "", rol: "" }])}
          >
            + Agregar testimonio
          </button>
        </div>
      )}

      {/* Barra de guardado (sticky) */}
      <div className="sticky bottom-4 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-line bg-ink-2/95 p-4 backdrop-blur">
        {msg ? (
          <span className={`text-sm ${msg.ok ? "text-[#9be59b]" : "text-rosa"}`}>{msg.txt}</span>
        ) : (
          <span className="text-sm text-muted">Los cambios no se publican hasta que guardes.</span>
        )}
        <button
          type="button"
          onClick={guardarTodo}
          disabled={guardando}
          className="rounded-[11px] bg-rosa-deep px-6 py-3 text-sm font-semibold text-white transition duration-150 hover:bg-[#ff5891] active:scale-95 disabled:opacity-60 disabled:active:scale-100"
        >
          {guardando ? "Guardando…" : "Guardar todo"}
        </button>
      </div>
    </div>
  );
}
