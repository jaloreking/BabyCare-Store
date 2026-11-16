// ================= CONFIG =================
const CONFIG = {
  brand: "Jay&Joy",
  parent: "Riddhi Siddhi Fashion",
  whatsapp: "919999999999", // ⚠️ APNA NUMBER YAHAN DAALEIN (country code ke saath, bina +)
  phone: "+91 99999 99999",
  email: "info@riddhisiddhifashion.com",
  address: "Jalore, Rajasthan, India"
};

// ================= PRODUCTS =================
// ⚠️ Apni real products aur photos yahan update karein
const PRODUCTS = [
  { id:1, name:"Cotton Casual Shirt",     price:499, img:"images/p1.jpg", tags:["popular","casual"] },
  { id:2, name:"Formal Check Shirt",      price:599, img:"images/p2.jpg", tags:["popular","formal"] },
  { id:3, name:"Party Wear Shirt",        price:649, img:"images/p3.jpg", tags:["new","party"] },
  { id:4, name:"Printed Kids Shirt",      price:449, img:"images/p4.jpg", tags:["new","casual"] },
  { id:5, name:"Denim Style Shirt",       price:699, img:"images/p5.jpg", tags:["popular","casual"] },
  { id:6, name:"Striped Cotton Shirt",    price:549, img:"images/p6.jpg", tags:["new","casual"] },
  { id:7, name:"Premium Formal Shirt",    price:749, img:"images/p7.jpg", tags:["formal","popular"] },
  { id:8, name:"Festive Party Shirt",     price:799, img:"images/p8.jpg", tags:["party","new"] },
];

// ================= HEADER =================
function renderHeader(){
  const el = document.getElementById("hdr");
  if(!el) return;
  const page = document.body.dataset.page || "";
  const isActive = p => page === p ? 'class="active"' : '';
  el.innerHTML = `
    <nav class="nav">
      <a href="index.html" class="logo">Jay<span>&</span>Joy</a>
      <div class="nav-links" id="navLinks">
        <a href="index.html" ${isActive("index")}>Home</a>
        <a href="products.html" ${isActive("products")}>Products</a>
        <a href="about.html" ${isActive("about")}>About</a>
        <a href="contact.html" ${isActive("contact")}>Contact</a>
        <a href="https://wa.me/${CONFIG.whatsapp}" class="nav-cta" target="_blank" rel="noopener">💬 WhatsApp</a>
      </div>
      <button class="menu-btn" id="menuBtn" aria-label="Toggle menu">☰</button>
    </nav>`;
  document.getElementById("menuBtn").addEventListener("click", ()=>{
    document.getElementById("navLinks").classList.toggle("open");
  });
}

// ================= FOOTER =================
function renderFooter(){
  const el = document.getElementById("ftr");
  if(!el) return;
  el.innerHTML = `
    <div class="footer-inner">
      <div>
        <h4>Jay&Joy by Riddhi Siddhi Fashion</h4>
        <p>Premium kids boys shirts — manufacturer &amp; wholesaler in India. Cash on Delivery available across India.</p>
        <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">💬 ${CONFIG.phone}</a>
        <a href="mailto:${CONFIG.email}">✉ ${CONFIG.email}</a>
      </div>
      <div>
        <h4>Shop</h4>
        <a href="products.html">All Shirts</a>
        <a href="products.html?filter=new">New Arrivals</a>
        <a href="products.html?filter=popular">Popular</a>
        <a href="products.html?filter=formal">Formal</a>
      </div>
      <div>
        <h4>Info</h4>
        <a href="about.html">About Us</a>
        <a href="contact.html">Contact</a>
        <a href="shipping.html">Shipping &amp; COD</a>
      </div>
    </div>
    <div class="footer-bottom">
      © ${new Date().getFullYear()} Riddhi Siddhi Fashion. All rights reserved.
    </div>`;
}

// ================= PRODUCT CARD =================
function productCard(p){
  const waLink = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
    `Hi, I want to order: ${p.name} (₹${p.price})`
  )}`;
  return `
    <article class="card">
      <div class="card-img"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='images/placeholder.svg'"></div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="price">₹${p.price}</div>
        <a class="btn wa" target="_blank" rel="noopener" href="${waLink}">Order on WhatsApp</a>
      </div>
    </article>`;
}

// ================= RENDER HOME PRODUCTS =================
function renderHomeProducts(){
  const pop = document.getElementById("pop");
  const nw  = document.getElementById("new");
  if(pop) pop.innerHTML = PRODUCTS.filter(p=>p.tags.includes("popular")).slice(0,4).map(productCard).join("");
  if(nw)  nw.innerHTML  = PRODUCTS.filter(p=>p.tags.includes("new")).slice(0,4).map(productCard).join("");
}

// ================= RENDER ALL PRODUCTS + FILTER =================
function renderAllProducts(){
  const grid = document.getElementById("allProducts");
  if(!grid) return;

  const urlFilter = new URLSearchParams(location.search).get("filter") || "all";
  let activeFilter = urlFilter;

  const draw = () => {
    const list = activeFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter(p => p.tags.includes(activeFilter));
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<p style="grid-column:1/-1;text-align:center;color:#64748b;padding:40px 0">No products in this category yet.</p>`;
    document.querySelectorAll(".chip").forEach(c=>{
      c.classList.toggle("active", c.dataset.filter === activeFilter);
    });
  };

  document.querySelectorAll(".chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      activeFilter = chip.dataset.filter;
      draw();
    });
  });

  draw();
}

// ================= WHATSAPP HERO BUTTON =================
function setupWhatsApp(){
  const el = document.getElementById("hwa");
  if(el) el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hi, I want to know more about Jay&Joy shirts')}`;
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", ()=>{
  renderHeader();
  renderFooter();
  renderHomeProducts();
  renderAllProducts();
  setupWhatsApp();
});