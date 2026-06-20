# mi-portafolio — Kervin Martínez, dev frontend

Portafolio y carta de presentación de **Kervin Martínez**, desarrollador frontend: **vitrina de proyectos** con métricas de PageSpeed, **CMS propio** (edita → commit en GitHub → rebuild en Vercel) y contacto directo por formulario y WhatsApp.

🔗 **En vivo:** https://mi-portafolio-eta-hazel.vercel.app

---

## Qué es

Sitio de una página que reúne quién soy, mi stack, mi proceso y, sobre todo, una **vitrina de proyectos en producción** (con capturas, badges de PageSpeed y links en vivo / repo). Todo el contenido es editable desde un **panel `/admin`** que escribe directo en GitHub, sin tocar código ni redeployar a mano.

## Características

- **Vitrina de proyectos** — tarjetas con imagen optimizada, badge PSI, métrica, tags y enlaces a "en vivo" y repositorio.
- **Hero con specs** del proyecto destacado y contador animado (respeta `prefers-reduced-motion`).
- **Secciones data-driven** — Sobre mí, Stack, Proceso, FAQ y Testimonios, cada una desde su propio JSON.
- **CMS propio** (`/admin`) — panel en React con pestañas para cada sección; edición inline de listas (agregar/mover/borrar) y **subida de imágenes a Cloudinary**.
- **Contacto** — formulario con **Formspree** + enlaces directos a WhatsApp y GitHub.
- **SEO técnico** — **JSON-LD `Person`** en la home, Open Graph (`og.png` 1200×630), canonical, `sitemap` (excluye `/admin` y `/gracias`) y `robots.txt` que bloquea `/admin`.
- **Accesible** — skip-link, foco visible, navbar con `aria-expanded`/`aria-controls`, `role="status"`/`aria-live` en el formulario, HTML semántico y `prefers-reduced-motion`.
- **Rendimiento** — **100/100/100/100** en PageSpeed; fuentes self-host, preload del display, imágenes lazy y cero CLS.

## Stack

- **Astro 6** (híbrido: público estático + `/admin` y APIs SSR con adapter de Vercel)
- **React 19** (solo en el panel admin) · **Tailwind CSS v4**
- **@fontsource** (Inter + Space Grotesk, self-host)
- **GitHub Contents API** como almacén de datos · **Cloudinary** para imágenes · **Formspree** para el formulario
- Deploy en **Vercel** · Node ≥ 22.12

## Decisiones técnicas

- **Contenido en 7 JSON** (`src/content/*.json`: site, secciones, proyectos, stack, proceso, faq, testimonios) — son la fuente de verdad y se editan desde el panel.
- **GitHub como backend (sin DB):** Vercel es de solo lectura, así que `/admin` lee siempre desde GitHub (`cache: "no-store"`) y guarda los cambios con la GitHub API en **un commit**; el push dispara el rebuild de Vercel (~30 s).
- **Auth sin librerías:** cookie firmada con **HMAC-SHA256** y expiración (8 h), `httpOnly` y `secure` en producción; imposible de falsificar sin `ADMIN_PASSWORD`.
- **Imágenes y fuentes:** Cloudinary con `f_auto, q_auto, w_*` y tipografías self-host (`@fontsource`) con preload del display → buen LCP sin render-blocking de Google Fonts.

## Correr en local

```bash
git clone https://github.com/Kelvmdev/mi-portafolio.git
cd mi-portafolio
npm install
npm run dev
```

Abre http://localhost:4321

> Nota: si editas contenido desde el panel en producción, haz `git pull --no-rebase --no-edit` antes de seguir tocando código local (el commit del CMS vive en el remoto).

### Variables de entorno

Crea un `.env.local` (no se versiona):

```
ADMIN_PASSWORD=<contraseña del panel /admin>
GITHUB_TOKEN=<PAT con scope public_repo>
GITHUB_OWNER=Kelvmdev
GITHUB_REPO=mi-portafolio
GITHUB_BRANCH=main
```

El `cloud name` y el `upload preset` de Cloudinary se usan en el panel para la subida sin firma.

## Scripts

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo (`localhost:4321`) |
| `npm run build` | Build de producción a `./dist/` |
| `npm run preview` | Previsualiza el build |

---

Hecho por **Kervin Martínez** · Asistido con Claude Code.
