export const prerender = false;
import type { APIRoute } from "astro";
import { passwordCorrecta, crearSesion } from "../../lib/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const pass = String(form.get("password") ?? "");
  if (!passwordCorrecta(pass)) return redirect("/admin?error=1", 303);
  crearSesion(cookies, import.meta.env.PROD);
  return redirect("/admin", 303);
};
