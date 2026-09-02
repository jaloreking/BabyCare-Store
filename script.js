let cart = JSON.parse(localStorage.getItem("littleGentCart") || "[]");

const productsEl = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const bag = document.getElementById("bag");
const overlay = document.getElementById("overlay");
const bagItems = document.getElementById("bagItems");
const subtotalEl = document.getElementById("subtotal");

function money(n){ return "₹" + n.toLocaleString("en-IN"); }

function renderProducts(filter="all", query=""){
  let list = PRODUCTS.filter(p => filter === "all" || p.category === filter);
  if(query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.includes(query.toLowerCase()));
  productsEl.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-media">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <button class="quick-add" onclick="addToCart(${p.id})">Add to bag</button>
      </div>
      <div class="product-info">
        <div><h3>${p.name}</h3><p>${p.category.toUpperCase()}</p></div>
        <div class="price">${money(p.price)} <del>${money(p.oldPrice)}</del></div>
      </div>
      <div class="size-row">${p.sizes.map(s=>`<span>${s}</span>`).join("")}</div>
    </article>
  `).join("");
}

function addToCart(id){
  const product = PRODUCTS.find(p=>p.id===id);
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  saveCart();
  openBag();
}

function saveCart(){
  localStorage.setItem("littleGentCart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const count = cart.reduce((a,i)=>a+i.qty,0);
  cartCount.textContent = count;
  if(!cart.length){
    bagItems.innerHTML = '<p class="empty">Your bag is empty.</p>';
    subtotalEl.textContent = money(0);
    return;
  }
  let subtotal = 0;
  bagItems.innerHTML = cart.map(item=>{
    const p = PRODUCTS.find(x=>x.id===item.id);
    subtotal += p.price * item.qty;
    return `<div class="bag-item">
      <img src="${p.image}" alt="">
      <div><strong>${p.name}</strong><span>${money(p.price)} × ${item.qty}</span>
      <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div>
    </div>`;
  }).join("");
  subtotalEl.textContent = money(subtotal);
}

function changeQty(id,delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i=>i.id!==id);
  saveCart();
}

function openBag(){ bag.classList.add("open"); overlay.classList.add("show"); bag.setAttribute("aria-hidden","false"); }
function closeBag(){ bag.classList.remove("open"); overlay.classList.remove("show"); bag.setAttribute("aria-hidden","true"); }

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

document.getElementById("cartBtn").onclick=openBag;
document.getElementById("closeBag").onclick=closeBag;
overlay.onclick=closeBag;

document.getElementById("menuBtn").onclick=()=>{
  document.getElementById("nav").classList.toggle("open");
};

document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
document.getElementById("searchBtn").onclick=()=>{
  searchPanel.classList.add("show"); searchPanel.setAttribute("aria-hidden","false"); searchInput.focus();
};
document.getElementById("closeSearch").onclick=()=>{searchPanel.classList.remove("show"); searchInput.value="";};

searchInput.addEventListener("input",()=>{
  const q=searchInput.value.trim();
  document.getElementById("searchResults").textContent = q ? `${PRODUCTS.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())).length} styles found` : "";
  renderProducts("all",q);
});

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length) return alert("Your bag is empty.");
  const lines = cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id); return `${p.name} x ${i.qty} — ${money(p.price*i.qty)}`;});
  const total = cart.reduce((s,i)=>s+PRODUCTS.find(x=>x.id===i.id).price*i.qty,0);
  const message = encodeURIComponent(`Hello LITTLE GENT,%0A%0AI want to order:%0A${lines.join("%0A")}%0A%0ATotal: ${money(total)}%0A%0APlease share availability and payment details.`);
  window.open(`https://wa.me/919999999999?text=${message}`,"_blank");
};

document.getElementById("newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();
  document.getElementById("formNote").textContent="Thanks — you're on the list.";
  e.target.reset();
});

renderProducts();
renderCart();
