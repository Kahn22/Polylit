(function () {
  var languageKey = "polylit:active-language:v1";
  var sessionKey = "french-reading-studio:demo-session:v1";
  var script = document.currentScript;
  var base = script ? new URL("./", script.src) : new URL("./", location.href);
  var preview = new URLSearchParams(location.search).get("preview") === "1";
  try {
    if (preview) sessionStorage.setItem(sessionKey, "active");
    var eyebrow = document.querySelector(".home-intro .eyebrow");
    if (eyebrow) eyebrow.textContent = localStorage.getItem(languageKey) === "es" ? "Spanish library" : "French library";
  } catch (_error) { /* Browser-local preview preferences are optional. */ }
  var relativePath = location.pathname.slice(base.pathname.length).replace(/index\.html$/, "");
  if (preview && relativePath === "") location.replace(new URL("languages/", base).href);
  // Old bookmarks used hash routes at the homepage. Transfer them to the
  // independent document, preserving the work route and repository prefix.
  if (relativePath === "" && /^#\/(?:languages|library|read\/|book\/)/.test(location.hash)) {
    var language = "fr";
    try { if (localStorage.getItem(languageKey) === "es") language = "es"; } catch (_error) {}
    var destination = location.hash === "#/languages" ? "languages/" : language + "/library/";
    var hash = /^#\/(read|book)\//.test(location.hash) ? location.hash : "";
    location.replace(new URL(destination + hash, base).href);
  }
  function checkSession() {
    if (!/^(?:languages|(?:fr|es)\/library)\/?$/.test(relativePath)) return;
    try {
      if (sessionStorage.getItem(sessionKey) !== "active") location.replace(base.href);
    } catch (_error) { /* Main application also checks its preview session. */ }
  }
  checkSession();
  window.addEventListener("pageshow", checkSession);
  document.addEventListener("click", function (event) {
    var target = event.target.closest && event.target.closest("[data-action]");
    if (!target) return;
    try {
      if (target.dataset.action === "start-demo") sessionStorage.setItem(sessionKey, "active");
      if (target.dataset.action === "sign-out") sessionStorage.removeItem(sessionKey);
      if (target.dataset.action === "choose-language" && /^(fr|es)$/.test(target.dataset.language)) localStorage.setItem(languageKey, target.dataset.language);
    } catch (_error) { /* Native links remain functional. */ }
    // Never prevent navigation or prefetch library data here. The destination
    // document owns its catalog, language, and learner state.
  });
})();
