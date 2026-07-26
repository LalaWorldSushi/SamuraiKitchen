const categories = [
  { id: "starters", it: "Entratine e Insalate", en: "Starters & Salads", pages: [6,7,8,9], cover: 6,
    descIt: "Kobachi, gyoza, piccoli fritti e insalate.", descEn: "Kobachi, gyoza, small fried dishes and salads." },
  { id: "nigiri", it: "Nigiri e Gunkan", en: "Nigiri & Gunkan", pages: [10,11,12], cover: 10,
    descIt: "Nigiri e gunkan, inclusi i gusti vegetali e piccanti.", descEn: "Nigiri and gunkan, including vegetable and spicy choices." },
  { id: "sushi-sets", it: "Sushi Set e Barche", en: "Sushi Sets & Boats", pages: [5,13], cover: 13,
    descIt: "Combinazioni di sushi e barche da condividere.", descEn: "Sushi combinations and sharing boats." },
  { id: "sashimi", it: "Sashimi e Carpacci", en: "Sashimi & Carpaccio", pages: [14,15], cover: 14,
    descIt: "Sashimi, pesce crudo misto e carpacci al ponzu.", descEn: "Sashimi, mixed raw fish and ponzu carpaccio." },
  { id: "small-rolls", it: "Hosomaki e Temaki", en: "Hosomaki & Temaki", pages: [16,17,18], cover: 16,
    descIt: "Piccoli roll e coni d’alga farciti.", descEn: "Small rolls and filled seaweed cones." },
  { id: "uramaki", it: "Uramaki e Rolls", en: "Uramaki & Rolls", pages: [19,20,21,22,23], cover: 19,
    descIt: "Roll classici, specialità e futomaki.", descEn: "Classic rolls, specialties and futomaki." },
  { id: "special-sushi", it: "Specialità Sushi", en: "Sushi Specialties", pages: [24,25,26], cover: 25,
    descIt: "Onigiri, Black Sushi Special e chirashi.", descEn: "Onigiri, Black Sushi Special and chirashi." },
  { id: "noodles", it: "Zuppe e Noodles", en: "Soups & Noodles", pages: [27,28,29], cover: 27,
    descIt: "Zuppe, udon, ramen, soba e noodles saltati.", descEn: "Soups, udon, ramen, soba and stir-fried noodles." },
  { id: "rice", it: "Riso e Poke", en: "Rice & Poke", pages: [30,31], cover: 31,
    descIt: "Riso saltato, poke bowl, gyudon e toridon.", descEn: "Fried rice, poke bowls, gyudon and toridon." },
  { id: "japanese-kitchen", it: "Cucina Giapponese", en: "Japanese Kitchen", pages: [32,33,34,35], cover: 32,
    descIt: "Tempura, carne, pesce, yakitori e piatti fritti.", descEn: "Tempura, meat, fish, yakitori and fried dishes." },
  { id: "chinese", it: "Cucina Cinese", en: "Chinese Kitchen", pages: [37,38,39,40,41,42,43,44,45,46,47], cover: 37,
    descIt: "Antipasti, zuppe, riso, noodles, curry, tofu, teppan e wok.", descEn: "Appetizers, soups, rice, noodles, curry, tofu, teppan and wok dishes." },
  { id: "kids", it: "Menu Bambini", en: "Children’s Menu", pages: [48], cover: 48,
    descIt: "Piatti semplici pensati per i più piccoli.", descEn: "Simple dishes for younger guests." },
  { id: "drinks", it: "Bevande e Vini", en: "Drinks & Wine", pages: [49,50,51], cover: 49,
    descIt: "Acqua, bibite, birra, vino, sake, caffè e aperitivi.", descEn: "Water, soft drinks, beer, wine, sake, coffee and aperitifs." },
  { id: "ayce", it: "All You Can Eat", en: "All You Can Eat", pages: [2,3], cover: 2,
    descIt: "Formula, prezzi e condizioni per pranzo e cena.", descEn: "Lunch and dinner format, pricing and conditions." },
  { id: "allergens", it: "Allergeni", en: "Allergens", pages: [52], cover: 52,
    descIt: "Legenda completa degli allergeni alimentari.", descEn: "Complete food allergen reference." }
];

const state = { lang: localStorage.getItem("samurai-language") || "it", current: null };
const $ = (selector) => document.querySelector(selector);
const grid = $("#categoryGrid");
const browser = $("#menuBrowser");
const pages = $("#menuPages");
const lightbox = $("#lightbox");

function pagePath(number) {
  return `page-${String(number).padStart(2, "0")}.webp`;
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
