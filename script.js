// Мелкие интерактивы: мобильное меню, плавное появление секций, переключение скриншотов, форма (демо)

const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu__link");

function setMobileOpen(isOpen) {
  burger.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.hidden = !isOpen;
}

burger?.addEventListener("click", () => {
  const isOpen = burger.getAttribute("aria-expanded") === "true";
  setMobileOpen(!isOpen);
});

mobileLinks.forEach((a) => {
  a.addEventListener("click", () => setMobileOpen(false));
});

// Reveal on scroll (очень лёгкий)
const revealEls = Array.from(document.querySelectorAll(".reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => io.observe(el));

// Переключение "скриншотов"
const tgShot = document.getElementById("tgShot");
const shotBtns = document.querySelectorAll(".shot-thumb");

shotBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    shotBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const id = btn.getAttribute("data-shot");
    if (id === "1") tgShot.src = "./assets/tg-1.svg";
    if (id === "2") tgShot.src = "./assets/tg-2.svg";
  });
});

// Форма: демо-отправка (без бэкенда)
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
  const payload = {
    name: data.get("name")?.toString().trim(),
    role: data.get("role")?.toString().trim(),
    contact: data.get("contact")?.toString().trim(),
  };

  // Простая проверка
  if (!payload.name || !payload.contact) {
    result.textContent = "Заполните имя и контакт.";
    return;
  }

  // Здесь можно подключить реальную отправку (например, webhook)
  // fetch("YOUR_ENDPOINT", { method:"POST", body: JSON.stringify(payload) ... })

  result.innerHTML =
    "Спасибо! Мы получили запрос от <b>" +
    escapeHtml(payload.name) +
    "</b>" +
    (payload.role ? " (" + escapeHtml(payload.role) + ")" : "") +
    ". Контакт: <b>" +
    escapeHtml(payload.contact) +
    "</b>.";

  form.reset();
});

// Год в футере
document.getElementById("year").textContent = String(new Date().getFullYear());
