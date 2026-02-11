// ========================================
// FILE: assets/js/app.js
// COMPLETE E-COMMERCE FUNCTIONALITY
// CART, WISHLIST, FILTERS, RENDERING
// BABYCARE STORE
// ========================================

// ---------- CART (localStorage) ----------
let cart = JSON.parse(localStorage.getItem('babycare_cart')) || [];

function saveCart() {
    localStorage.setItem('babycare_cart', JSON.stringify(cart));
    cartCountSync();
}

function addToCart(productId, quantity = 1) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    saveCart();
    showNotification('🛒 उत्पाद कार्ट में जोड़ा | Product added to cart');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) item.quantity = newQuantity;
        saveCart();
    }
}

function incrementQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) updateQuantity(productId, item.quantity + 1);
}

function decrementQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) updateQuantity(productId, item.quantity - 1);
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function clearCart() {
    cart = [];
    saveCart();
}

function cartCountSync() {
    const badges = document.querySelectorAll('#cartCount');
    const count = getCartCount();
    badges.forEach(el => {
        if (el) el.textContent = count;
    });
}

// ---------- WISHLIST (localStorage) ----------
let wishlist = JSON.parse(localStorage.getItem('babycare_wishlist')) || [];

function saveWishlist() {
    localStorage.setItem('babycare_wishlist', JSON.stringify(wishlist));
    wishlistCountSync();
}

function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlist();
        showNotification('❤️ पसंदीदा में जोड़ा | Added to wishlist');
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist();
}

function toggleWishlist(productId) {
    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
    } else {
        addToWishlist(productId);
    }
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function getWishlistCount() {
    return wishlist.length;
}

function wishlistCountSync() {
    const badges = document.querySelectorAll('#wishlistCount');
    badges.forEach(el => {
        if (el) el.textContent = getWishlistCount();
    });
}

// ---------- NOTIFICATION ----------
function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// ---------- RENDERING PRODUCT CARDS ----------
function renderProductGrid(containerId, productsArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!productsArray || productsArray.length === 0) {
        container.innerHTML = '<p style="text-align:center;">कोई उत्पाद नहीं | No products</p>';
        return;
    }
    let html = '';
    productsArray.forEach(p => {
        const inWishlist = isInWishlist(p.id) ? 'wishlist-active' : '';
        const badgeHtml = p.badge ? `<span class="product-badge">${p.badge}</span>` : '';
        const stockHtml = p.stock ? '<span class="in-stock">स्टॉक में | In Stock</span>' : '<span class="out-stock">स्टॉक खत्म | Out of Stock</span>';
        const ratingStar = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
        html += `
            <div class="product-card" data-id="${p.id}">
                <div class="product-image">
                    <a href="product.html?id=${p.id}">
                        <img src="${p.image}" alt="${p.nameHi} | ${p.name}" loading="lazy">
                    </a>
                    ${badgeHtml}
                    <button class="wishlist-btn ${inWishlist}" onclick="event.stopPropagation(); toggleWishlist(${p.id}); renderAll();" aria-label="Wishlist">❤️</button>
                </div>
                <div class="product-info">
                    <a href="product.html?id=${p.id}">
                        <h3 class="product-title">${p.nameHi} | ${p.name}</h3>
                    </a>
                    <div class="product-rating">
                        <span class="stars">${ratingStar}</span> <span>(${p.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">₹${p.price}</span>
                        ${p.originalPrice > p.price ? `<span class="original-price">₹${p.originalPrice}</span>` : ''}
                    </div>
                    ${stockHtml}
                    <button class="btn btn-small btn-add-to-cart" onclick="addToCart(${p.id}, 1)" ${!p.stock ? 'disabled' : ''}>
                        कार्ट में जोड़ें | Add to Cart
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Helper to refresh all counts and UI
function renderAll() {
    cartCountSync();
    wishlistCountSync();
}

// ---------- SHOP FILTERS ----------
let currentFilteredProducts = [];

function filterProducts(category, priceRange, searchTerm) {
    let filtered = [...products];
    
    if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (priceRange && priceRange !== 'all') {
        if (priceRange === '0-500') filtered = filtered.filter(p => p.price <= 500);
        else if (priceRange === '501-2000') filtered = filtered.filter(p => p.price >= 501 && p.price <= 2000);
        else if (priceRange === '2000+') filtered = filtered.filter(p => p.price > 2000);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.nameHi.includes(searchTerm) || 
            p.description.toLowerCase().includes(term)
        );
    }
    
    return filtered;
}

function sortProducts(productsArray, sortBy) {
    const sorted = [...productsArray];
    if (sortBy === 'price-asc') sorted.sort((a,b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a,b) => b.price - a.price);
    else if (sortBy === 'rating') sorted.sort((a,b) => b.rating - a.rating);
    return sorted;
}

function renderShopProducts(productsToRender) {
    currentFilteredProducts = productsToRender;
    renderProductGrid('shopProductsGrid', productsToRender);
    const noMsg = document.getElementById('noProductsMessage');
    if (noMsg) noMsg.style.display = productsToRender.length ? 'none' : 'block';
}

function updateProductCount(count) {
    const el = document.getElementById('productCount');
    if (el) el.textContent = count;
}

function setupShopFilters() {
    const categoryEl = document.getElementById('categoryFilter');
    const priceEl = document.getElementById('priceFilter');
    const sortEl = document.getElementById('sortFilter');
    const searchEl = document.getElementById('searchFilterInput');
    const searchBtn = document.getElementById('searchFilterBtn');
    const clearBtn = document.getElementById('clearFiltersBtn');
    
    function applyFilters() {
        let filtered = filterProducts(
            categoryEl ? categoryEl.value : 'all',
            priceEl ? priceEl.value : 'all',
            searchEl ? searchEl.value : ''
        );
        if (sortEl && sortEl.value !== 'default') {
            filtered = sortProducts(filtered, sortEl.value);
        }
        renderShopProducts(filtered);
        updateProductCount(filtered.length);
    }
    
    if (categoryEl) categoryEl.addEventListener('change', applyFilters);
    if (priceEl) priceEl.addEventListener('change', applyFilters);
    if (sortEl) sortEl.addEventListener('change', applyFilters);
    if (searchBtn) searchBtn.addEventListener('click', applyFilters);
    if (searchEl) searchEl.addEventListener('keyup', debounce(applyFilters, 500));
    if (clearBtn) clearBtn.addEventListener('click', function() {
        if (categoryEl) categoryEl.value = 'all';
        if (priceEl) priceEl.value = 'all';
        if (sortEl) sortEl.value = 'default';
        if (searchEl) searchEl.value = '';
        applyFilters();
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ---------- CART PAGE RENDERING ----------
function renderCartPage() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    const cartItems = getCartItemsDetailed();
    
    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <p>आपकी कार्ट खाली है | Your cart is empty.</p>
                <a href="shop.html" class="btn btn-primary">दुकान देखें | Shop Now</a>
            </div>
        `;
        return;
    }
    
    let itemsHtml = '';
    let subtotal = 0;
    cartItems.forEach(item => {
        const p = item.product;
        const total = p.price * item.quantity;
        subtotal += total;
        itemsHtml += `
            <tr>
                <td><img src="${p.image}" width="60" height="60" alt="${p.name}"></td>
                <td>${p.nameHi} | ${p.name}</td>
                <td>₹${p.price}</td>
                <td>
                    <button onclick="decrementQuantity(${p.id}); renderCartPage();">-</button>
                    ${item.quantity}
                    <button onclick="incrementQuantity(${p.id}); renderCartPage();">+</button>
                </td>
                <td>₹${total}</td>
                <td><button onclick="removeFromCart(${p.id}); renderCartPage();">हटाएँ | Remove</button></td>
            </tr>
        `;
    });
    
    const tax = subtotal * 0.05; // 5% GST
    const total = subtotal + tax;
    
    container.innerHTML = `
        <div class="cart-layout">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>छवि | Image</th>
                        <th>उत्पाद | Product</th>
                        <th>कीमत | Price</th>
                        <th>मात्रा | Qty</th>
                        <th>उप-योग | Subtotal</th>
                        <th>हटाएँ | Remove</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            <div class="cart-summary">
                <h3>सारांश | Summary</h3>
                <p>उप-योग | Subtotal: ₹${subtotal}</p>
                <p>शिपिंग | Shipping: निःशुल्क | Free</p>
                <p>कर (GST 5%) | Tax: ₹${tax.toFixed(2)}</p>
                <h4>कुल | Total: ₹${total.toFixed(2)}</h4>
                <a href="checkout.html" class="btn btn-primary btn-block">चेकआउट | Checkout</a>
            </div>
        </div>
    `;
}

function getCartItemsDetailed() {
    return cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return { ...item, product };
    }).filter(item => item.product);
}

// ---------- WISHLIST PAGE RENDERING ----------
function renderWishlistPage() {
    const container = document.getElementById('wishlistContent');
    if (!container) return;
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    
    if (wishlistProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <p>पसंदीदा सूची खाली है | Your wishlist is empty.</p>
                <a href="shop.html" class="btn btn-primary">उत्पाद खोजें | Explore Products</a>
            </div>
        `;
        return;
    }
    
    let html = '<div class="product-grid">';
    wishlistProducts.forEach(p => {
        html += `
            <div class="product-card">
                <div class="product-image">
                    <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
                    <button class="wishlist-btn active" onclick="removeFromWishlist(${p.id}); renderWishlistPage(); renderAll();">❤️</button>
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>₹${p.price}</p>
                    <button class="btn btn-small" onclick="addToCart(${p.id}, 1);">कार्ट में जोड़ें | Add to Cart</button>
                    <button class="btn btn-small btn-outline" onclick="removeFromWishlist(${p.id}); renderWishlistPage(); renderAll();">हटाएँ | Remove</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ---------- PRODUCT DETAILS RENDERING ----------
function renderProductDetails(product) {
    const container = document.getElementById('productDetailsContainer');
    if (!container) return;
    
    const inWishlist = isInWishlist(product.id) ? 'active' : '';
    const stockHtml = product.stock 
        ? '<span class="in-stock">✅ स्टॉक में | In Stock</span>' 
        : '<span class="out-stock">❌ स्टॉक खत्म | Out of Stock</span>';
    
    let html = `
        <div class="product-details">
            <div class="product-details-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details-info">
                <h1>${product.nameHi} | ${product.name}</h1>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '½' : ''}</span>
                    (${product.reviews} समीक्षा | reviews)
                </div>
                <div class="pricing">
                    <span class="current-price">₹${product.price}</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">₹${product.originalPrice}</span> <span class="discount">${Math.round((1 - product.price/product.originalPrice)*100)}% छूट | off</span>` : ''}
                </div>
                ${stockHtml}
                <div class="description">
                    <p>${product.descriptionHi}</p>
                    <p>${product.description}</p>
                </div>
                <div class="quantity-selector">
                    <label>मात्रा | Quantity:</label>
                    <button id="decreaseQty">-</button>
                    <span id="qtyValue">1</span>
                    <button id="increaseQty">+</button>
                </div>
                <div class="action-buttons">
                    <button id="addToCartDetailBtn" class="btn btn-primary" ${!product.stock ? 'disabled' : ''}>
                        🛒 कार्ट में जोड़ें | Add to Cart
                    </button>
                    <button id="wishlistDetailBtn" class="btn btn-outline ${inWishlist}">
                        ❤️ पसंदीदा में जोड़ें | Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
    
    // Quantity selector logic
    let qty = 1;
    const qtySpan = document.getElementById('qtyValue');
    document.getElementById('decreaseQty').addEventListener('click', function() {
        if (qty > 1) qty--;
        qtySpan.textContent = qty;
    });
    document.getElementById('increaseQty').addEventListener('click', function() {
        qty++;
        qtySpan.textContent = qty;
    });
    
    document.getElementById('addToCartDetailBtn').addEventListener('click', function() {
        addToCart(product.id, qty);
    });
    
    document.getElementById('wishlistDetailBtn').addEventListener('click', function() {
        toggleWishlist(product.id);
        this.classList.toggle('active');
    });
}

// Initialize counts on page load
document.addEventListener('DOMContentLoaded', function() {
    cartCountSync();
    wishlistCountSync();
    
    // Global search handler (basic)
    const globalSearchInput = document.getElementById('globalSearchInput');
    const globalSearchBtn = document.getElementById('globalSearchBtn');
    if (globalSearchBtn && globalSearchInput) {
        globalSearchBtn.addEventListener('click', function() {
            const term = globalSearchInput.value;
            window.location.href = `shop.html?search=${encodeURIComponent(term)}`;
        });
        globalSearchInput.addEventListener('keyup', debounce(function(e) {
            if (e.key === 'Enter') {
                window.location.href = `shop.html?search=${encodeURIComponent(this.value)}`;
            }
        }, 500));
    }
    
    // Hamburger menu
    const hamburger = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mainNav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Search toggle
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function() {
            searchBar.classList.toggle('active');
        });
    }
});
