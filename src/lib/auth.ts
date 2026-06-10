// Sesión del panel: cookie firmada (HMAC) con expiración a 8h.
// No se puede falsificar sin el secreto del servidor (ADMIN_PASSWORD).
import { createHmac, timingSafeEqual } from "node:crypto";
import type { AstroCookies } from "astro";

const SECRET = import.meta.env.ADMIN_PASSWORD || "dev-secret";
const COOKIE = "sesion";
const MAX_AGE = 8 * 60 * 60; // 8h en segundos

const firmar = (exp: string) => createHmac("sha256", SECRET).update(exp).digest("hex");

export function passwordCorrecta(pass: string): boolean {
  const a = Buffer.from(String(pass));
  const b = Buffer.from(SECRET);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function crearSesion(cookies: AstroCookies, prod: boolean) {
  const exp = String(Date.now() + MAX_AGE * 1000);
  cookies.set(COOKIE, `${exp}.${firmar(exp)}`, {
    httpOnly: true,
    secure: prod,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function cerrarSesion(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: "/" });
}

export function haySesion(cookies: AstroCookies): boolean {
  const raw = cookies.get(COOKIE)?.value;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  const esperado = firmar(exp);
  return sig.length === esperado.length && timingSafeEqual(Buffer.from(sig), Buffer.from(esperado));
}
