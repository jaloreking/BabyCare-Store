// ============================================================
// WhatsApp Number (country code 91 + number)
// ============================================================
const WHATSAPP = "919782736969";

// ============================================================
// AGE GROUPS
// ============================================================
const AGE_GROUPS = [
  { size:"0-1Y",   label:"0–1 Year",   emoji:"👶" },
  { size:"2-3Y",   label:"2–3 Years",  emoji:"🧒" },
  { size:"4-5Y",   label:"4–5 Years",  emoji:"🧒" },
  { size:"6-7Y",   label:"6–7 Years",  emoji:"🧑" },
  { size:"8-9Y",   label:"8–9 Years",  emoji:"🧑" },
  { size:"10-12Y", label:"10–12 Years",emoji:"👦" },
  { size:"13-14Y", label:"13–14 Years",emoji:"🧑" },
  { size:"15-16Y", label:"15–16 Years",emoji:"🧑" }
];

// ============================================================
// PRODUCTS (edit images, prices, sizes as needed)
// ============================================================
const PRODUCTS = [
  { name:"Cotton Casual Shirt", price:499, old:699,
    img:"https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&q=80",
    tag:"Bestseller", rating:4.8, reviews:124,
    sizes:["0-1Y","2-3Y","4-5Y","6-7Y","8-9Y","10-12Y"] },
  { name:"Formal Check Shirt", price:599, old:799,
    img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    tag:"Popular", rating:4.7, reviews:89,
    sizes:["0-1Y","2-3Y","4-5Y","6-7Y","8-9Y"] },
  { name:"Party Wear Shirt", price:649, old:899,
    img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    tag:"New", rating:4.9, reviews:56,
    sizes:["2-3Y","4-5Y","6-7Y","8-9Y","10-12Y","13-14Y","15-16Y"] },
  { name:"Printed Kids Shirt", price:449, old:599,
    img:"https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&q=80",
    tag:"New", rating:4.6, reviews:38,
    sizes:["0-1Y","2-3Y","4-5Y","6-7Y"] },
  { name:"Denim Style Shirt", price:699, old:999,
    img:"https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500&q=80",
    tag:"Popular", rating:4.8, reviews:71,
    sizes:["6-7Y","8-9Y","10-12Y","13-14Y","15-16Y"] },
  { name:"Striped Cotton Shirt", price:549, old:749,
    img:"https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500&q=80",
    tag:"New", rating:4.7, reviews:43,
    sizes:["0-1Y","2-3Y","4-5Y","6-7Y","8-9Y"] },
  { name:"Premium Formal Shirt", price:749, old:1099,
    img:"https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80",
    tag:"Bestseller", rating:4.9, reviews:112,
    sizes:["8-9Y","10-12Y","13-14Y","15-16Y"] },
  { name:"Festive Party Shirt", price:799, old:1199,
    img:"https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&q=80",
    tag:"New", rating:4.8, reviews:29,
    sizes:["2-3Y","4-5Y","6-7Y","8-9Y","10-12Y","13-14Y"] }
];

let selectedAge = null;

// ============================================================
// Helper: WhatsApp link
// ============================================================
function waUrl(msg){
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
}

// ============================================================
// Render age selector
// ============================================================
function renderAgeGrid(){
  const grid = document.getElementById("ageGrid");
  grid.innerHTML = AGE_GROUPS.map(a => {
    const count = PRODUCTS.filter(p => p.sizes.includes(a.size)).length;
    return `<button class="age-btn" data-size="${a.size}">
      <span class="age-emoji">${a.emoji}</span>
      <span class="age-label">${a.label}</span>
      <span class="age-count">${count} shirts</span>
    </button>`;
  }).join("");

  grid.querySelectorAll(".age-btn").forEach(btn => {
    btn.addEventListener("click", () => selectAge(btn.dataset.size));
  });
}

// ============================================================
// Age select → filter products
// ============================================================
function selectAge(size){
  selectedAge = size;
  document.querySelectorAll(".age-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.size === size));

  const ageLabel = AGE_GROUPS.find(a => a.size === size)?.label || size;
  document.getElementById("filterAge").textContent = ageLabel;
  document.getElementById("filterBar").classList.add("show");
  document.getElementById("products").classList.add("show");
  document.getElementById("productSub").textContent =
    `Showing ${PRODUCTS.filter(p => p.sizes.includes(size)).length} shirts available in ${ageLabel}.`;

  renderProducts();
  document.getElementById("products").scrollIntoView({ behavior:"smooth", block:"start" });
}

function clearFilter(){
  selectedAge = null;
  document.querySelectorAll(".age-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("filterBar").classList.remove("show");
  document.getElementById("products").classList.remove("show");
  document.getElementById("age-select").scrollIntoView({ behavior:"smooth", block:"start" });
}

// ============================================================
// Render filtered products
// ============================================================
function renderProducts(){
  const grid = document.getElementById("productGrid");
  const list = selectedAge
    ? PRODUCTS.filter(p => p.sizes.includes(selectedAge))
    : [];

  if (!list.length){
    grid.innerHTML = `<div class="empty-state">
      <span>👕</span>
      Is age group mein abhi koi shirt available nahi hai.<br>Doosri age select karein ya WhatsApp pe poochein.
    </div>`;
    return;
  }

  grid.innerHTML = list.map((p) => {
    const idx = PRODUCTS.indexOf(p);
    const discount = Math.round((1 - p.price / p.old) * 100);
    const stars = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));
    const tagClass = p.tag === "Bestseller" ? "tag bestseller" : "tag";

    const defaultSize = selectedAge && p.sizes.includes(selectedAge)
      ? selectedAge : p.sizes[0];
    const sizeOptions = p.sizes.map(s =>
      `<option value="${s}" ${s === defaultSize ? "selected" : ""}>${s}</option>`).join("");

    return `
      <article class="card">
        <div class="card-img">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <span class="${tagClass}">${p.tag}</span>
        </div>
        <div class="card-body">
          <div class="rating">
            <span class="stars">${stars}</span>
            <span class="count">${p.rating} (${p.reviews})</span>
          </div>
          <h3>${p.name}</h3>
          <div class="price-row">
            <span class="price">₹${p.price}</span>
            <span class="old-price">₹${p.old}</span>
            <span class="discount">${discount}% OFF</span>
          </div>
          <div class="prod-badges">
            <span>100% Cotton</span>
            <span>7-Day Exchange</span>
            <span>COD Available</span>
          </div>
          <div class="size-row">
            <label for="size-${idx}">Size</label>
            <select class="size-select" id="size-${idx}">${sizeOptions}</select>
          </div>
          <button class="btn wa buy-btn" data-idx="${idx}" style="margin-top:auto;width:100%">
            🛒 Buy Now — ₹${p.price}
          </button>
        </div>
      </article>`;
  }).join("");

  grid.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.idx;
      const p = PRODUCTS[idx];
      const size = document.getElementById("size-" + idx).value;
      const msg = `Hi, I want to buy:\n\n👕 ${p.name}\n📏 Size: ${size}\n💰 Price: ₹${p.price}\n\nPlease confirm availability and delivery.`;
      window.open(waUrl(msg), "_blank");
    });
  });
}

// ============================================================
// WhatsApp links auto-init
// ============================================================
function initWaLinks(){
  document.querySelectorAll(".wa-link").forEach(a => {
    a.href = waUrl(a.dataset.msg || "Hi");
  });
}

// ============================================================
// Mobile menu
// ============================================================
document.getElementById("menuBtn").addEventListener("click", () =>
  document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a =>
  a.addEventListener("click", () =>
    document.getElementById("navLinks").classList.remove("open")));

// ============================================================
// INIT
// ============================================================
document.getElementById("year").textContent = new Date().getFullYear();
initWaLinks();
renderAgeGrid();