import { mkdir, readFile, writeFile } from "node:fs/promises";
import { libraryMarkup } from "../dist/presentation/library.js";

const requestedDirectory = process.argv.includes("--directory") ? process.argv[process.argv.indexOf("--directory") + 1] : "build";
if (!["build", "review-build"].includes(requestedDirectory)) throw new Error("Unsupported route output directory");
const outputRoot = new URL(`../${requestedDirectory}/`, import.meta.url);
const source = await readFile(new URL("index.html", outputRoot), "utf8");
const logoMatch = source.match(/src="(\.\/assets\/polylit-logo[^\"]+)"/);
if (!logoMatch) throw new Error("The built Polylit logo URL was not found.");

function withPrefix(html, prefix) {
  return html
    .replaceAll('src="./assets/', `src="${prefix}assets/`)
    .replaceAll('href="./assets/', `href="${prefix}assets/`)
    .replace(/src="\.\/landing-bootstrap\.js/g, `src="${prefix}landing-bootstrap.js`);
}

function replaceApp(html, markup) {
  const start = html.indexOf('    <div id="app">');
  const end = html.indexOf('    <script src=', start);
  if (start < 0 || end < 0) throw new Error("The application shell could not be located.");
  return `${html.slice(0, start)}    <div id="app">\n${markup}\n    </div>\n${html.slice(end)}`;
}

async function writeRoute(path, prefix, markup, data = "") {
  const directory = new URL(`${path}/`, outputRoot);
  await mkdir(directory, { recursive: true });
  const page = replaceApp(withPrefix(source, prefix), markup).replace("</body>", `${data}\n  </body>`);
  await writeFile(new URL("index.html", directory), page);
}

const logoFile = logoMatch[1].slice("./assets/".length);
const languageLogo = `../assets/${logoFile}`;
const libraryLogo = `../../assets/${logoFile}`;

await writeRoute("languages", "../", `      <nav class="topbar" aria-label="Account navigation"><a class="brand" href="../"><img class="brand-logo" src="${languageLogo}" alt="Polylit"></a><a class="text-button" href="../" data-action="sign-out">Sign out</a></nav>
      <main class="language-choice"><header><p class="eyebrow">Learner account</p><h1>What would you like to study?</h1><p class="lede">Choose a language to open its reading library.</p></header>
        <div class="language-options">
          <a class="language-card" href="../fr/library/" target="_self" data-action="choose-language" data-language="fr"><span class="language-flag" aria-hidden="true">🇫🇷</span><span><strong>French</strong><small>Open the French library</small></span><span class="language-arrow" aria-hidden="true">→</span></a>
          <a class="language-card" href="../es/library/" target="_self" data-action="choose-language" data-language="es"><span class="language-flag" aria-hidden="true">🇪🇸</span><span><strong>Spanish</strong><small>Open the Spanish library</small></span><span class="language-arrow" aria-hidden="true">→</span></a>
        </div>
      </main>`);

for (const language of ["fr", "es"]) {
  const embeddedLibrary = (await readFile(new URL(`content/library/${language}.json`, outputRoot), "utf8"))
    .trim()
    .replaceAll("<", "\\u003c");
  const index = JSON.parse(embeddedLibrary);
  const navigation = `<nav class="topbar" aria-label="Main navigation"><a class="brand" href="./"><img class="brand-logo" src="${libraryLogo}" alt="Polylit"></a><div class="topbar-actions"><a class="language-switch" href="../../languages/" target="_self">Choose language</a><a class="text-button" href="../../" data-action="sign-out">Sign out</a></div></nav>`;
  const markup = libraryMarkup(index, {}, new Map(), new Map(), navigation);
  await writeRoute(`${language}/library`, "../../", markup,
    `<script id="polylit-library-data" type="application/json" data-language="${language}">${embeddedLibrary}</script>`);
}
