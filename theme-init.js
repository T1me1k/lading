// theme-init.js (optional, include in <head> before CSS)
(() => {
  try {
    const key = "pwye_theme";
    const saved = localStorage.getItem(key);
    const theme = saved === "dark" || saved === "light" ? saved : "light";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.add("theme-no-anim");
  } catch (_) {}
})();
