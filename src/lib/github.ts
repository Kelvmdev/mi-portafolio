// GitHub API: leer y guardar el contenido del portafolio.
// El panel LEE de GitHub (fuente de verdad; el disco de Vercel es read-only y se desfasa).
// "Guardar todo" = UN commit atómico de los 6 JSON, vía Git Data API (trees/commits/refs).

const OWNER = import.meta.env.GITHUB_OWNER;
const REPO = import.meta.env.GITHUB_REPO;
const BRANCH = import.meta.env.GITHUB_BRANCH || "main";
const TOKEN = import.meta.env.GITHUB_TOKEN;

const API = "https://api.github.com";

// Archivos de contenido editables desde el panel.
export const ARCHIVOS = [
  "site",
  "secciones",
  "proyectos",
  "stack",
  "proceso",
  "faq",
  "testimonios",
] as const;
export type Clave = (typeof ARCHIVOS)[number];
export type Contenido = Record<Clave, any>;

const headers = () => ({
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

const ruta = (clave: string) => `src/content/${clave}.json`;

/** Lee los 6 JSON desde GitHub (sin caché). */
export async function leerContenido(): Promise<Contenido> {
  const entradas = await Promise.all(
    ARCHIVOS.map(async (clave) => {
      const res = await fetch(
        `${API}/repos/${OWNER}/${REPO}/contents/${ruta(clave)}?ref=${BRANCH}`,
        { headers: { ...headers(), Accept: "application/vnd.github.raw+json" }, cache: "no-store" }
      );
      if (!res.ok) throw new Error(`GitHub GET ${clave}: ${res.status} ${await res.text()}`);
      return [clave, JSON.parse(await res.text())] as const;
    })
  );
  return Object.fromEntries(entradas) as Contenido;
}

/** Guarda todos los JSON en UN solo commit. */
export async function guardarContenido(data: Contenido, mensaje = "CMS: actualizar contenido") {
  // 1) sha del último commit + su árbol
  const refRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!refRes.ok) throw new Error(`GitHub ref: ${refRes.status} ${await refRes.text()}`);
  const parentSha = (await refRes.json()).object.sha;

  const commitRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/commits/${parentSha}`, {
    headers: headers(),
  });
  const baseTree = (await commitRes.json()).tree.sha;

  // 2) árbol nuevo con los 6 archivos (UTF-8, así no se rompen acentos)
  const tree = ARCHIVOS.filter((c) => data[c] !== undefined).map((clave) => ({
    path: ruta(clave),
    mode: "100644" as const,
    type: "blob" as const,
    content: JSON.stringify(data[clave], null, 2) + "\n",
  }));
  const treeRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ base_tree: baseTree, tree }),
  });
  if (!treeRes.ok) throw new Error(`GitHub tree: ${treeRes.status} ${await treeRes.text()}`);
  const newTree = (await treeRes.json()).sha;

  // 3) commit nuevo
  const newCommitRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ message: mensaje, tree: newTree, parents: [parentSha] }),
  });
  if (!newCommitRes.ok) throw new Error(`GitHub commit: ${newCommitRes.status} ${await newCommitRes.text()}`);
  const newCommitSha = (await newCommitRes.json()).sha;

  // 4) mover la rama al commit nuevo
  const patchRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ sha: newCommitSha }),
  });
  if (!patchRes.ok) throw new Error(`GitHub ref patch: ${patchRes.status} ${await patchRes.text()}`);
  return newCommitSha;
}
