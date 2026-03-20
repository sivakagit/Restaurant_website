# 🍗 Shawok Restaurant

> A full-stack restaurant website with real-time menu management, WhatsApp ordering, and a live admin panel — built with zero monthly cost.

**🌐 Live Site:** [shawok.netlify.app](https://shawok.netlify.app) &nbsp;|&nbsp; **🔐 Admin Panel:** [shawok.netlify.app/admin.html](https://shawok.netlify.app/admin.html)

---

## 📖 About The Project

Shawok Restaurant is a production-ready food ordering website built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no monthly fees. Customers browse the menu, add items to a cart, fill in their delivery address, and place orders directly via WhatsApp. The restaurant owner manages everything live from a password-protected admin panel backed by **Firebase Realtime Database** — price changes and sold-out toggles reflect for all customers within one second.

The project was designed for small restaurants in India that want a professional online presence and a simple ordering system without the complexity or cost of a full e-commerce platform. The entire stack runs for free: Netlify hosts the site, Firebase handles the database, and WhatsApp handles order delivery.

### Key highlights:
- 🛒 **Cart system** with quantity controls and order summary
- 📦 **Address collection popup** before checkout — name, phone, area, full address
- 💬 **WhatsApp ordering** — pre-filled message with all items, total, and delivery details sent directly to the owner
- 🔴 **Live sold-out toggle** — owner marks items from the admin panel, customers see it instantly
- 💰 **Live price editing** — update any price from the admin panel without touching code
- 📱 **Fully mobile responsive** with sticky Order Now button
- 🔥 **Popular badges**, star ratings, category filters, animated food slider
- 🎨 **Floating food doodles** on hero, food section, and menu for a playful feel

---

## ✨ Features

<details>
<summary><strong>Customer Website</strong></summary>

- Hero section with auto-rotating food slider
- Stats strip — customer count, rating, delivery time
- Delivery area notice banner with all delivery zones
- Food grid with category filter (All / Shawaya / Wraps / Fries / Tenders)
- Food cards with star ratings, Popular badge, Sold Out overlay
- Sticky cart drawer with quantity controls and free delivery line
- Address collection modal before WhatsApp checkout
- Toast notifications on every add-to-cart
- Why Choose Us section, testimonials, full menu image
- Complete footer with contact, WhatsApp link, hours, socials
- Mobile responsive with sticky bottom Order Now button

</details>

<details>
<summary><strong>Admin Panel</strong></summary>

- Password-protected login (no account needed)
- Live stats: total items, available, sold out count
- Toggle Sold Out per item — updates customers in ~1 second
- Toggle Popular badge per item
- Edit prices live — saves instantly to Firebase
- Add new menu items with name, price, category, emoji, image
- Fix Menu Data button to repair any Firebase data issues

</details>

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 / CSS3 | Structure, styling, animations, responsive layout |
| JavaScript (ES Modules) | Cart, Firebase sync, address modal, ordering logic |
| Firebase Realtime Database | Live menu — prices, sold out status, popular flags |
| Netlify | Free static hosting, instant deploys |
| WhatsApp wa.me API | Click-to-chat ordering with pre-filled message |
| Google Fonts | Fredoka (headings) + Poppins (body text) |

---

## 📁 File Structure

```
shawok-restaurant/
├── index.html            # Customer-facing website
├── style.css             # All styles and animations
├── script.js             # Firebase, cart, ordering logic
├── admin.html            # Password-protected admin panel
└── images/
    ├── shawaya1.png
    ├── shawaya2.png
    ├── wrap.png
    ├── wrapcombo.png
    ├── loadedfries.png
    ├── tenders1.png
    ├── bbq_tenders.png
    ├── menu.jpg
    └── logo.png
```

---

## 🚀 Setup Guide

### 1. Firebase Setup
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → create a new project
2. **Build → Realtime Database → Create Database** → choose `asia-southeast1` → Start in test mode
3. **⚙️ Project Settings → Your apps → `</>` Web** → Register app → copy the `firebaseConfig`

### 2. Paste Config
Open **both** `script.js` and `admin.html`. Find the `firebaseConfig` block and replace all 7 placeholder values:

```js
const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  databaseURL:       "PASTE_YOUR_DATABASE_URL_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
}
```

> ⚠️ Do this in **both** `script.js` AND `admin.html`

### 3. Set Database Rules
In Firebase Console → Realtime Database → **Rules** tab:
```json
{ "rules": { ".read": true, ".write": true } }
```
Click **Publish**. After first load, change `.write` to `false` to secure your data.

### 4. Change Admin Password
In `admin.html`, find and change:
```js
const ADMIN_PASSWORD = "shawok2026"  // ← change this
```

### 5. Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site → Deploy manually**
2. Open your project folder → press `Ctrl+A` to select everything including `images/`
3. Drag all files onto the Netlify deploy box
4. Live in ~10 seconds ✅

### 6. Seed Menu Data (First Time Only)
1. Open `yoursite.netlify.app/admin.html` → log in
2. Scroll to bottom → click **🔧 Fix Menu Data**
3. All 7 items appear on the main site instantly

---

## 🍽️ Menu

| Item | Category | Price |
|---|---|---|
| Classic Shawaya | Shawaya | ₹160 |
| Masala Shawaya | Shawaya | ₹170 |
| Zinger Wrap | Wrap | ₹110 |
| Wrap Combo | Wrap | ₹130 |
| Loaded Fries | Fries | ₹170 |
| Chicken Tenders | Tenders | ₹170 |
| BBQ Tenders | Tenders | ₹200 |

---

## 🚚 Delivery Areas

Phagwara City • Model Town • Urban Estate • Bus Stand Area • Civil Lines • Nehru Nagar • Guru Nanak Nagar

---

## 💬 How Ordering Works

```
Customer adds items to cart
       ↓
Clicks "Order on WhatsApp"
       ↓
Fills name, phone, area, address
       ↓
WhatsApp opens with full order message
       ↓
Owner receives order on +91 9995679729
       ↓
Owner confirms and delivers
```

**Sample message received:**
```
Hi Shawok! 👋 New Order:

🛒 ORDER ITEMS:
• Classic Shawaya x1 — ₹160
• Loaded Fries x2 — ₹340

🧾 Total: ₹500

📦 DELIVERY DETAILS:
👤 Name: Rahul Sharma
📞 Phone: 98765 43210
📍 Area: Model Town
🏠 Address: House 42, Street 5, near water tank
```

---

## 🔧 Customization

| What | Where | How |
|---|---|---|
| Brand colour | `style.css` | Search & replace `#E10600` |
| WhatsApp number | `script.js` | Replace `919995679729` |
| Admin password | `admin.html` | Change `ADMIN_PASSWORD` value |
| Prices | Admin panel | Login → type price → Save |
| Sold out | Admin panel | Login → flip toggle |
| Add item | Admin panel | Login → Add New Item form |
| Delivery areas | `index.html` | Edit banner + address modal dropdown |
| Contact info | `index.html` | Edit footer section |

---

## ⚠️ Known Limitations

- Admin password is stored client-side — fine for small restaurant use
- Food images must be re-uploaded to Netlify manually when changed
- No order history — orders received only via WhatsApp
- Sold out must be toggled manually by the owner
- No built-in payment gateway — payments handled via UPI or cash

---

## 📞 Contact

**Shawok Restaurant**
📍 Main Market, Phagwara, Punjab, India
📞 +91 9995679729
⏰ Open daily: 11am – 11pm
💬 [WhatsApp Order](https://wa.me/919995679729)

---

*Built with ❤️ in Phagwara &nbsp;|&nbsp; © 2026 Shawok Restaurant*
