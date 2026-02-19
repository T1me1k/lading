// script.js (final)
// Theme + mobile menu + reveal + examples + year
(() => {
  "use strict";

  // ===============================
  // Theme toggle (default: LIGHT)
  // + saves to localStorage
  // + disables transitions on first paint (anti-flash)
  // ===============================
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

  // Remove no-anim after first paint (if it was set in <head> inline script)
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

  // ===============================
  // Mobile menu (burger)
  // + closes on outside click
  // + closes on Escape
  // + closes after link click
  // ===============================
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

    const clickedBurger = burger.contains(target);
    const clickedMenu = mobileMenu.contains(target);

    if (!clickedBurger && !clickedMenu) setMobileOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    const isOpen = burger?.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;
    if (e.key === "Escape") setMobileOpen(false);
  });

  // ===============================
  // Reveal on scroll (IntersectionObserver)
  // ===============================
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

  // ===============================
  // Screenshots switching (SVG)
  // - checks if file exists
  // - hides button 2 if missing
  // ===============================
  const tgShot = document.getElementById("tgShot");
  const shotBtns = Array.from(document.querySelectorAll(".shot-thumb"));

  const SHOTS = {
    "1": "./assets/tg-1.svg",
    "2": "./assets/tg-2.svg",
  };

  function checkImageExists(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  async function initShots() {
    if (!tgShot || shotBtns.length === 0) return;

    const [has1, has2] = await Promise.all([
      checkImageExists(SHOTS["1"]),
      checkImageExists(SHOTS["2"]),
    ]);

    if (has1) tgShot.src = SHOTS["1"];

    const btn2 = shotBtns.find((b) => b.getAttribute("data-shot") === "2");
    if (!has2 && btn2) btn2.style.display = "none";

    shotBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-shot");
        const src = id ? SHOTS[id] : null;
        if (!src || !tgShot) return;

        const ok = await checkImageExists(src);
        if (!ok) return;

        shotBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        tgShot.src = src;
      });
    });
  }
  initShots();

  // ===============================
  // Year
  // ===============================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
