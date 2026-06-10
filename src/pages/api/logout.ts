export const prerender = false;
import type { APIRoute } from "astro";
import { cerrarSesion } from "../../lib/auth";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cerrarSesion(cookies);
  return redirect("/admin", 303);
};
