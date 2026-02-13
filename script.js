// ===============================
// Theme toggle (default: LIGHT)
// ===============================
const THEME_KEY = "pwye_theme";
const htmlEl = document.documentElement;
const themeBtn = document.querySelector(".theme-toggle");

function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
}

function initTheme() {
  // default is light (as requested)
  const saved = localStorage.getItem(THEME_KEY);
  const initial = (saved === "light" || saved === "dark") ? saved : "light";
  applyTheme(initial);
}

// Disable transitions on first paint to avoid flash
htmlEl.classList.add("theme-no-anim");
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    htmlEl.classList.remove("theme-no-anim");
  });
});

initTheme();

themeBtn?.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});


// ===============================
// Mobile menu
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

mobileLinks.forEach((a) =>
  a.addEventListener("click", () => setMobileOpen(false))
);

document.addEventListener("click", (e) => {
  const isOpen = burger?.getAttribute("aria-expanded") === "true";
  if (!isOpen || !mobileMenu || !burger) return;

  const target = e.target;
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
// Reveal on scroll
// ===============================
const revealEls = Array.from(document.querySelectorAll(".reveal"));

if (revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => io.observe(el));
}


// ===============================
// Screenshots switching (SVG)
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

  const has1 = await checkImageExists(SHOTS["1"]);
  const has2 = await checkImageExists(SHOTS["2"]);

  // Default to 1 if exists
  if (has1) tgShot.src = SHOTS["1"];

  // Hide button 2 if no file
  const btn2 = shotBtns.find((b) => b.getAttribute("data-shot") === "2");
  if (!has2 && btn2) btn2.style.display = "none";

  shotBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-shot");
      const src = SHOTS[id];
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
// Form (demo)
// ===============================
const form = document.getElementById("leadForm");
const result = document.getElementById("formResult");

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const name = data.get("name")?.toString().trim();
  const contact = data.get("contact")?.toString().trim();

  if (!name || !contact) {
    if (result) result.textContent = "Заполните имя и контакт.";
    return;
  }

  if (result) {
    result.innerHTML =
      "Спасибо! Мы получили запрос от <b>" +
      escapeHtml(name) +
      "</b>. Контакт: <b>" +
      escapeHtml(contact) +
      "</b>.";
  }

  form.reset();
});


// ===============================
// Year
// ===============================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
