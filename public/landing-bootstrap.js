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
  if (preview && location.pathname === base.pathname) location.replace(new URL("languages/", base).href);
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
