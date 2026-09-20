/** Also supports a repository subpath on GitHub Pages. */
export const siteBase = import.meta.env.DEV ? "/" : new URL("../", import.meta.url).pathname;
export const sitePath = (path = "") => `${siteBase}${path.replace(/^\/+/, "")}`;
