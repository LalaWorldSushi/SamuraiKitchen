const categories = [
  { id: "sushi-rolls", it: "Uramaki e Rolls", en: "Uramaki & Rolls", pages: [22,23,24,25,28,30], cover: 24,
    descIt: "Roll classici, speciali, futomaki e maki mix.", descEn: "Classic rolls, specialty rolls, futomaki and maki mixes." },
  { id: "nigiri", it: "Nigiri e Gunkan", en: "Nigiri & Gunkan", pages: [38,39,40], cover: 40,
    descIt: "Nigiri, gunkan e proposte vegetali.", descEn: "Nigiri, gunkan and vegetable selections." },
  { id: "sashimi", it: "Sashimi e Crudi", en: "Sashimi & Raw", pages: [33,34,37], cover: 34,
    descIt: "Sashimi, carpacci e kobachi.", descEn: "Sashimi, carpaccio and kobachi." },
  { id: "sushi-sets", it: "Sushi Set e Barche", en: "Sushi Sets & Boats", pages: [35,43], cover: 35,
    descIt: "Combinazioni da condividere e barche per gruppi.", descEn: "Sharing combinations and sushi boats for groups." },
  { id: "temaki", it: "Hosomaki e Temaki", en: "Hosomaki & Temaki", pages: [31,32], cover: 31,
    descIt: "Piccoli roll e coni d’alga farciti.", descEn: "Small rolls and filled seaweed cones." },
  { id: "rice", it: "Riso e Poke", en: "Rice & Poke", pages: [11,15,18,26,29], cover: 15,
    descIt: "Riso saltato, poke bowl, chirashi e onigiri.", descEn: "Fried rice, poke bowls, chirashi and onigiri." },
  { id: "noodles", it: "Noodles e Zuppe", en: "Noodles & Soups", pages: [6,9,10,19,20,21], cover: 21,
    descIt: "Udon, ramen, soba, spaghetti di riso e zuppe.", descEn: "Udon, ramen, soba, rice noodles and soups." },
  { id: "kitchen", it: "Dalla Cucina", en: "From the Kitchen", pages: [13,14,16,17,36,41,42], cover: 16,
    descIt: "Tempura, carne, pesce, antipasti, insalate e gyoza.", descEn: "Tempura, meat, fish, appetizers, salads and gyoza." },
  { id: "chinese", it: "Cucina Cinese", en: "Chinese Kitchen", pages: [2,3,4,7,8,12,45], cover: 3,
    descIt: "Piatti saltati, curry, agrodolce, tofu, teppan e antipasti.", descEn: "Stir-fries, curry, sweet and sour, tofu, teppan and appetizers." },
  { id: "kids", it: "Menu Bambini", en: "Children’s Menu", pages: [1], cover: 1,
    descIt: "Piatti semplici pensati per i più piccoli.", descEn: "Simple dishes for younger guests." },
  { id: "black-special", it: "Black Sushi Special", en: "Black Sushi Special", pages: [27], cover: 27,
    descIt: "Le specialità di sushi nero.", descEn: "Our black sushi specialties." },
  { id: "ayce", it: "All You Can Eat", en: "All You Can Eat", pages: [44], cover: 44,
    descIt: "Prezzi, condizioni e simboli del menu.", descEn: "Prices, conditions and menu symbols." }
];

const state = { lang: localStorage.getItem("samurai-language") || "it", current: null };
const $ = (selector) => document.querySelector(selector);
const grid = $("#categoryGrid");
const browser = $("#menuBrowser");
const pages = $("#menuPages");
const lightbox = $("#lightbox");

function pagePath(number) {
  return `assets/menu/page-${String(number).padStart(2, "0")}.webp`;
}

function translatePage() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-it][data-en]").forEach((node) => {
    node.textContent = node.dataset[state.lang];
  });
  $("#languageLabel").textContent = state.lang === "it" ? "EN" : "IT";
  renderCategories();
  if (state.current) openCategory(state.current, false);
}

function renderCategories() {
  grid.innerHTML = categories.map((category) => `
    <button class="category-card" type="button" data-category="${category.id}"
      style="--image:url('${pagePath(category.cover)}')">
      <small>${state.lang === "it" ? "Esplora" : "Explore"}</small>
      <strong>${category[state.lang]}</strong>
    </button>
  `).join("");
  grid.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => openCategory(button.dataset.category));
  });
}

function openCategory(id, shouldScroll = true) {
  const category = categories.find((item) => item.id === id);
  if (!category) return;
  state.current = id;
  $("#categoryTitle").textContent = category[state.lang];
  $("#categoryDescription").textContent = state.lang === "it" ? category.descIt : category.descEn;
  pages.innerHTML = category.pages.map((number, index) => `
    <button class="menu-page" type="button" data-src="${pagePath(number)}"
      aria-label="${state.lang === "it" ? "Ingrandisci pagina" : "Enlarge page"} ${index + 1}">
      <img src="${pagePath(number)}" alt="${category[state.lang]} - ${state.lang === "it" ? "pagina" : "page"} ${index + 1}"
        ${index > 1 ? 'loading="lazy"' : ""}>
    </button>
  `).join("");
  grid.hidden = true;
  browser.hidden = false;
  pages.querySelectorAll(".menu-page").forEach((button) => {
    button.addEventListener("click", () => showLightbox(button.dataset.src, button.querySelector("img").alt));
  });
  if (shouldScroll) browser.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeCategory() {
  state.current = null;
  browser.hidden = true;
  grid.hidden = false;
  $("#menu").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showLightbox(src, alt) {
  $("#lightboxImage").src = src;
  $("#lightboxImage").alt = alt;
  lightbox.showModal();
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.close();
  document.body.classList.remove("no-scroll");
}

$("#languageButton").addEventListener("click", () => {
  state.lang = state.lang === "it" ? "en" : "it";
  localStorage.setItem("samurai-language", state.lang);
  translatePage();
});
$("#closeCategory").addEventListener("click", closeCategory);
$("#backToCategories").addEventListener("click", closeCategory);
$("#closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.open) closeLightbox();
});

translatePage();
