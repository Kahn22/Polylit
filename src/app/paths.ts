/** Resolve from document routes, not a module URL that Vite may inline as an asset. */
export function siteBaseFromPath(pathname: string): string {
  const base = pathname
    .replace(/\/(?:fr|es)\/library(?:\/index\.html|\/)?$/, "/")
    .replace(/\/languages(?:\/index\.html|\/)?$/, "/")
    .replace(/\/index\.html$/, "/");
  return base.endsWith("/") ? base : `${base}/`;
}

export const siteBase = siteBaseFromPath(location.pathname);
export const sitePath = (path = "") => `${siteBase}${path.replace(/^\/+/, "")}`;
