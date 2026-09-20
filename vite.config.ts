import { defineConfig } from "vite";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const bootstrapVersion = createHash("sha256").update(readFileSync(new URL("./public/landing-bootstrap.js", import.meta.url))).digest("hex").slice(0, 10);
export default defineConfig({
  base: "./",
  plugins: [{
    name: "polylit-static-pages",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace('src="./landing-bootstrap.js"', `src="./landing-bootstrap.js?v=${bootstrapVersion}"`);
    },
  }],
  build: {
    outDir: "build",
    emptyOutDir: true,
    manifest: true,
    // Each route loads only its own code; CSS is an ordinary stylesheet and
    // remains available even when a content request or script fails.
    rollupOptions: { output: { entryFileNames: "assets/polylit-entry-[hash].js", chunkFileNames: "assets/[name]-[hash].js" } },
  },
});
