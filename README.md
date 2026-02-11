
## 🎨 Color Palette - Soft Baby Theme

| Color Name | Hex Code | Usage |
|-----------|---------|-------|
| Pastel Blue | `#E6F3FF` | Hero backgrounds, accents |
| Pastel Pink | `#FFE9F0` | Hero gradients, hover states |
| Cream | `#FFF9F0` | Category cards, filter bars |
| White | `#FFFFFF` | Product cards, backgrounds |
| Text Dark | `#2D3E50` | All body text, headings |
| Accent | `#FFB6C1` | Buttons, badges, active states |

## 🛍️ Product Categories (75+ Products)

| Category | Products Count | Key Items |
|----------|---------------|-----------|
| Feeding | 14 | Bottles, Breast Pumps, Bibs, Pacifiers |
| Clothing | 10 | Onesies, Jhabla, Sleepsuits, Swaddles |
| Diapering | 10 | Newborn Diapers, Cloth Diapers, Wipes |
| Bath & Hygiene | 12 | Soap, Shampoo, Towels, Nail Cutter |
| Sleeping | 8 | Cradle, Bassinet, Mattress, Mosquito Net |
| Travel & Safety | 6 | Stroller, Car Seat, Carrier, Rocker |
| Health & Care | 7 | Thermometer, Gripe Water, First Aid |
| Play & Comfort | 5 | Soft Toys, Rattle, Teether, Play Gym |
| Laundry & Cleaning | 3 | Baby Detergent, Laundry Bag, Sanitizer |

## ⚙️ Complete JavaScript Functionality

### 🛒 Cart System (localStorage)
- `addToCart()`, `removeFromCart()`, `updateQuantity()`
- `incrementQuantity()`, `decrementQuantity()`
- `getCartTotal()`, `getCartCount()`, `clearCart()`
- Real-time cart count badge sync across all pages

### ❤️ Wishlist System (localStorage)
- `addToWishlist()`, `removeFromWishlist()`, `toggleWishlist()`
- `isInWishlist()`, `getWishlistCount()`
- Persistent storage across sessions

### 🔍 Filter & Search System
- **Search** - Bilingual support (Hindi/English product names)
- **Category Filter** - All 9 categories
- **Price Filter** - ₹0-500, ₹501-2000, ₹2000+
- **Sort** - Price: Low to High, High to Low, Rating
- Debounced search input for performance

### 📱 Product Details
- Dynamic URL parameters (`product.html?id=1001`)
- Quantity selector with +/- buttons
- Stock availability indicator
- Related products by category

## 📊 SEO Implementation - Every Page Includes

✅ **Bilingual Title Tags** - `हिंदी | English - BabyCare Store`  
✅ **Meta Description** - Hindi + English descriptions  
✅ **Meta Keywords** - Targeted Indian baby product keywords  
✅ **Canonical URLs** - Prevent duplicate content  
✅ **Open Graph Tags** - Facebook, WhatsApp optimized  
✅ **Twitter Cards** - Twitter preview optimized  
✅ **Favicon** - 16x16, 32x32, Apple Touch Icon  
✅ **JSON-LD Structured Data**:
  - Homepage: Store schema
  - Product page: Product schema  
  - Shop page: ItemList schema
  - Category: CollectionPage schema
✅ **Single H1 per page** - Bilingual heading  
✅ **Image Alt Text** - Bilingual alt attributes  

## 📱 Responsive Breakpoints (Mobile First)

```css
/* Mobile: 320px-480px  - 2 columns */
/* Tablet: 481px-768px   - 3 columns */
/* Desktop: 769px-1024px - 4 columns */
/* Wide: 1025px+        - 4 columns */
