export type AppRoute =
  | { name: "home" }
  | { name: "languages" }
  | { name: "library" }
  | { name: "read"; workId: string; position?: number }
  | { name: "book"; workId: string; position?: number };

const safeId = /^[a-z0-9][a-z0-9_-]*$/;

export function parseRoute(hash: string): AppRoute {
  const [rawPath, query] = hash.split("?");
  const value = new URLSearchParams(query).get("position");
  const position = value && /^[0-9]+$/.test(value) ? Number(value) : undefined;
  const extra = position !== undefined && Number.isSafeInteger(position) ? { position } : {};
  const path = rawPath!.replace(/^#\/?/, "").replace(/\/$/, "");
  if (path === "languages") return { name: "languages" };
  if (path === "library") return { name: "library" };
  const read = /^read\/([^/]+)$/.exec(path);
  if (read?.[1] && safeId.test(read[1])) return { name: "read", workId: read[1], ...extra };
  const book = /^book\/([^/]+)$/.exec(path);
  if (book?.[1] && safeId.test(book[1])) return { name: "book", workId: book[1], ...extra };
  return { name: "home" };
}

export function routeHash(route: AppRoute): string {
  if (route.name === "languages") return "#/languages";
  if (route.name === "library") return "#/library";
  if (route.name === "read" || route.name === "book") return `#/${route.name}/${route.workId}${route.position === undefined ? "" : `?position=${route.position}`}`;
  return "#/";
}
