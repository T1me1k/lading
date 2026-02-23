// script.js (final)
// Theme + mobile menu + reveal + dialogs tabs + year
(() => {
  "use strict";

  const THEME_KEY = "pwye_theme";
  const htmlEl = document.documentElement;
  const themeBtn = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const initial = saved === "dark" || saved === "light" ? saved : "light";
    applyTheme(initial);
  }

  // Remove no-anim after first paint (set in <head>)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => htmlEl.classList.remove("theme-no-anim"));
  });

  initTheme();

  themeBtn?.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Mobile menu
  const burger = document.querySelector(".burger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu__link");

  function setMobileOpen(isOpen) {
    if (!burger || !mobileMenu) return;
    burger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.hidden = !isOpen;
  }

  burger?.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    setMobileOpen(!isOpen);
  });

  mobileLinks.forEach((a) => a.addEventListener("click", () => setMobileOpen(false)));

  document.addEventListener("click", (e) => {
    const isOpen = burger?.getAttribute("aria-expanded") === "true";
    if (!isOpen || !mobileMenu || !burger) return;

    const target = e.target;
    if (!(target instanceof Node)) return;

    if (!burger.contains(target) && !mobileMenu.contains(target)) {
      setMobileOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    const isOpen = burger?.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;
    if (e.key === "Escape") setMobileOpen(false);
  });

  // Reveal
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // Dialog tabs (Диалог 1 / 2)
  const dialogBtns = Array.from(document.querySelectorAll("[data-dialog]"));
  const panes = Array.from(document.querySelectorAll("[data-dialog-pane]"));

  function setDialog(id) {
    dialogBtns.forEach((b) => {
      const active = b.getAttribute("data-dialog") === id;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    panes.forEach((p) => {
      const active = p.getAttribute("data-dialog-pane") === id;
      p.classList.toggle("is-active", active);
    });
  }

  dialogBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-dialog");
      if (id) setDialog(id);
    });
  });

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();