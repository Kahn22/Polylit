export type AppRoute =
  | { name: "home" }
  | { name: "languages" }
  | { name: "library" }
  | { name: "read"; workId: string }
  | { name: "book"; workId: string };

const safeId = /^[a-z0-9][a-z0-9_-]*$/;

export function parseRoute(hash: string): AppRoute {
  const path = hash.replace(/^#\/?/, "").replace(/\/$/, "");
  if (path === "languages") return { name: "languages" };
  if (path === "library") return { name: "library" };
  const read = /^read\/([^/]+)$/.exec(path);
  if (read?.[1] && safeId.test(read[1])) return { name: "read", workId: read[1] };
  const book = /^book\/([^/]+)$/.exec(path);
  if (book?.[1] && safeId.test(book[1])) return { name: "book", workId: book[1] };
  return { name: "home" };
}

export function routeHash(route: AppRoute): string {
  if (route.name === "languages") return "#/languages";
  if (route.name === "library") return "#/library";
  if (route.name === "read") return `#/read/${route.workId}`;
  if (route.name === "book") return `#/book/${route.workId}`;
  return "#/";
}
