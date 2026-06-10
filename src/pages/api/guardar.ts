export const prerender = false;
import type { APIRoute } from "astro";
import { haySesion } from "../../lib/auth";
import { guardarContenido, ARCHIVOS } from "../../lib/github";

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!haySesion(cookies)) {
    return new Response(JSON.stringify({ error: "no_autorizado" }), { status: 401 });
  }
  let data: any;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "json_invalido" }), { status: 400 });
  }
  // Solo aceptamos las claves conocidas (evita commitear basura)
  const limpio: any = {};
  for (const c of ARCHIVOS) if (data[c] !== undefined) limpio[c] = data[c];

  try {
    const sha = await guardarContenido(limpio);
    return new Response(JSON.stringify({ ok: true, sha }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "github", detalle: e?.message }), { status: 502 });
  }
};
