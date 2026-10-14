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

export function languageFromPath(pathname = location.pathname): "fr" | "es" | undefined {
  const match = pathname.match(/\/(fr|es)\/library(?:\/index\.html|\/)?$/);
  return match?.[1] === "fr" || match?.[1] === "es" ? match[1] : undefined;
}

export function isLanguageChoicePath(pathname = location.pathname): boolean {
  return /\/languages(?:\/index\.html|\/)?$/.test(pathname);
}
