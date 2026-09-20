import "./styles.css";

/** Login and selection are independent documents with no learner-content imports. */
const libraryRoute = /\/(fr|es)\/library\/?$/.test(location.pathname);
if (libraryRoute) {
  void import("./main.js").catch(() => {
    const app = document.querySelector("#app");
    if (app) app.innerHTML = '<main class="page" role="alert"><h1>This page could not finish loading.</h1><p>Your saved progress has not been changed.</p><button class="primary" id="retry-app">Retry</button></main>';
    document.querySelector("#retry-app")?.addEventListener("click", () => location.reload());
  });
} else if (import.meta.env.DEV && /\/languages\/?$/.test(location.pathname)) {
  // Vite's development fallback serves index.html; production has a generated
  // selection document and never needs this development-only renderer.
  const app = document.querySelector("#app");
  const logo = new URL("../assets/polylit-logo-display.png", import.meta.url).href;
  if (app) app.innerHTML = `<nav class="topbar" aria-label="Account navigation"><a class="brand" href="../"><img class="brand-logo" src="${logo}" alt="Polylit"></a><a class="text-button" href="../" data-action="sign-out">Sign out</a></nav><main class="language-choice"><header><p class="eyebrow">Learner account</p><h1>What would you like to study?</h1><p class="lede">Choose a language to open its reading library.</p></header><div class="language-options">${(["fr", "es"] as const).map(language => `<a class="language-card" href="/${language}/library/" target="_self" data-action="choose-language" data-language="${language}"><span class="language-flag" aria-hidden="true">${language === "fr" ? "🇫🇷" : "🇪🇸"}</span><span><strong>${language === "fr" ? "French" : "Spanish"}</strong><small>Open the ${language === "fr" ? "French" : "Spanish"} library</small></span><span class="language-arrow" aria-hidden="true">→</span></a>`).join("")}</div></main>`;
}
