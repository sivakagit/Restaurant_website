// ─── FIREBASE CONFIG ──────────────────────────────────────────────────────────
// STEP: Replace the values below with your own Firebase project config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyBbwkNbrwERMFrvznjbnVwKikC6N-b72Lg",
  authDomain: "shawok.firebaseapp.com",
  databaseURL: "https://shawok-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shawok",
  storageBucket: "shawok.firebasestorage.app",
  messagingSenderId: "407264108895",
  appId: "1:407264108895:web:f51e3dca6836917386d6ea"
}

const app = initializeApp(firebaseConfig)
const db  = getDatabase(app)

// ─── DEFAULT MENU ─────────────────────────────────────────────────────────────
const defaultItems = [
  { id:"item1", img:"images/shawaya1.png",    title:"Classic Shawaya",  price:160, cat:"shawaya", emoji:"🍛", rating:5, popular:true,  soldOut:false },
  { id:"item2", img:"images/shawaya2.png",    title:"Masala Shawaya",   price:170, cat:"shawaya", emoji:"🍛", rating:5, popular:false, soldOut:false },
  { id:"item3", img:"images/wrap.png",        title:"Zinger Wrap",      price:110, cat:"wrap",    emoji:"🌯", rating:4, popular:true,  soldOut:false },
  { id:"item4", img:"images/wrapcombo.png",   title:"Wrap Combo",       price:130, cat:"wrap",    emoji:"🌯", rating:4, popular:false, soldOut:false },
  { id:"item5", img:"images/loadedfries.png", title:"Loaded Fries",     price:170, cat:"fries",   emoji:"🍟", rating:4, popular:false, soldOut:false },
  { id:"item6", img:"images/tenders1.png",    title:"Chicken Tenders",  price:170, cat:"tenders", emoji:"🍗", rating:5, popular:true,  soldOut:false },
  { id:"item7", img:"images/bbq_tenders.png", title:"BBQ Tenders",      price:200, cat:"tenders", emoji:"🍗", rating:5, popular:false, soldOut:false }
]

let items = [...defaultItems]
let cart  = []
let sliderIndex = 0
let sliderTimer = null

// ─── LOAD MENU FROM FIREBASE ─────────────────────────────────────────────────
// Show default items immediately so food grid is never empty
items = [...defaultItems]
renderItems(items)
restartSlider()

// Then listen for Firebase updates (price changes, sold out toggles)
onValue(ref(db, 'menu'), snapshot => {
  const data = snapshot.val()
  if (data) {
    // Always use local img/emoji/title — only override price, soldOut, popular from Firebase
    items = defaultItems.map(def => ({
      ...def,
      price:   data[def.id]?.price   ?? def.price,
      soldOut: data[def.id]?.soldOut ?? def.soldOut,
      popular: data[def.id]?.popular ?? def.popular
    }))
  } else {
    // First time: seed Firebase with all fields
    const seed = {}
    defaultItems.forEach(i => {
      seed[i.id] = { title: i.title, emoji: i.emoji, cat: i.cat, img: i.img, rating: i.rating, price: i.price, soldOut: i.soldOut, popular: i.popular }
    })
    set(ref(db, 'menu'), seed)
  }
  renderItems(items)
  restartSlider()
})

// ─── SLIDER ───────────────────────────────────────────────────────────────────
function restartSlider() {
  if (sliderTimer) clearInterval(sliderTimer)
  sliderIndex = 0
  updateSlider()
  sliderTimer = setInterval(updateSlider, 3000)
}

function updateSlider() {
  // Skip sold-out items in slider
  const available = items.filter(i => !i.soldOut)
  if (!available.length) return
  if (sliderIndex >= available.length) sliderIndex = 0
  const item = available[sliderIndex]
  const img  = document.getElementById('sliderImage')
  img.style.opacity = '0'
  setTimeout(() => { img.src = item.img; img.style.opacity = '1' }, 250)
  document.getElementById('sliderTitle').innerText = item.title
  document.getElementById('sliderPrice').innerText = '₹' + item.price
  sliderIndex = (sliderIndex + 1) % available.length
}

function addCurrentItem() {
  const available = items.filter(i => !i.soldOut)
  if (!available.length) return
  const idx = (sliderIndex - 1 + available.length) % available.length
  addToCart(available[idx])
}

// ─── CART ─────────────────────────────────────────────────────────────────────
function addToCart(item) {
  if (item.soldOut) return
  const existing = cart.find(c => c.id === item.id)
  if (existing) existing.qty++
  else cart.push({ ...item, qty: 1 })
  updateCart()
  pulseCartIcon()
  showToast(item.title, item.emoji)
}

function changeQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id)
  if (idx === -1) return
  cart[idx].qty += delta
  if (cart[idx].qty <= 0) cart.splice(idx, 1)
  updateCart()
}

function pulseCartIcon() {
  const icon = document.querySelector('.cart-icon')
  icon.classList.remove('pulse')
  void icon.offsetWidth
  icon.classList.add('pulse')
}

let toastTimer = null
function showToast(title, emoji) {
  const toast = document.getElementById('toast')
  toast.innerHTML = `<span>${emoji}</span> <strong>${title}</strong> added to cart ✓`
  toast.classList.add('show')
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800)
}

function updateCart() {
  const totalItems = cart.reduce((s, c) => s + c.qty, 0)
  document.getElementById('cartCount').innerText = totalItems

  const cartItems = document.getElementById('cartItems')
  cartItems.innerHTML = ''

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>🛒</span>
        <p>Your cart is empty</p>
        <small>Add some delicious items!</small>
      </div>`
    document.getElementById('cartTotal').innerText = '0'
    document.getElementById('cartSummary').innerHTML = ''
    return
  }

  let total = 0
  cart.forEach(item => {
    total += item.price * item.qty
    cartItems.innerHTML += `
      <div class="cart-item">
        <span class="cart-item-emoji">${item.emoji || '🍽️'}</span>
        <span class="cart-item-name">${item.title}</span>
        <div class="qty-controls">
          <button onclick="changeQty('${item.id}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1)">+</button>
        </div>
        <span class="cart-item-price">₹${item.price * item.qty}</span>
      </div>`
  })

  document.getElementById('cartTotal').innerText = total
  document.getElementById('cartSummary').innerHTML = `
    <div class="summary-row"><span>Subtotal (${totalItems} item${totalItems > 1 ? 's' : ''})</span><span>₹${total}</span></div>
    <div class="summary-row delivery"><span>Delivery</span><span class="free-tag">Free 🚚</span></div>
    <div class="summary-divider"></div>
  `
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open')
  document.getElementById('overlay').classList.toggle('active')
}

// ─── WHATSAPP CHECKOUT ────────────────────────────────────────────────────────
function orderOnWhatsApp_old() {
  if (cart.length === 0) { showToast('Your cart is empty!', '🛒'); return }
  const total     = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const itemLines = cart.map(i => `• ${i.title} x${i.qty} — ₹${i.price * i.qty}`).join('\n')
  const message   =
    `Hi Shawok! 👋 I'd like to place an order:\n\n` +
    `${itemLines}\n\n` +
    `🧾 *Total: ₹${total}*\n\n` +
    `Please confirm my order and share delivery details. Thank you!`
  window.open(`https://wa.me/919995679729?text=${encodeURIComponent(message)}`, '_blank')
}


// ─── ADDRESS MODAL ────────────────────────────────────────────────────────────
function openAddressModal() {
  if (cart.length === 0) { showToast('Your cart is empty!', '🛒'); return }
  document.getElementById('addressOverlay').classList.add('open')
  document.getElementById('addressModal').classList.add('open')
}

function closeAddressModal() {
  document.getElementById('addressOverlay').classList.remove('open')
  document.getElementById('addressModal').classList.remove('open')
}

function confirmOrder() {
  const name    = document.getElementById('customerName').value.trim()
  const phone   = document.getElementById('customerPhone').value.trim()
  const area    = document.getElementById('customerArea').value
  const address = document.getElementById('customerAddress').value.trim()
  const notes   = document.getElementById('customerNotes').value.trim()

  if (!name)    { highlight('customerName',    'Please enter your name');    return }
  if (!phone)   { highlight('customerPhone',   'Please enter your phone');   return }
  if (!area)    { highlight('customerArea',    'Please select your area');   return }
  if (!address) { highlight('customerAddress', 'Please enter your address'); return }

  const total     = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const itemLines = cart.map(i => `• ${i.title} x${i.qty} — ₹${i.price * i.qty}`).join('\n')

  const message =
    `Hi Shawok! 👋 New Order:\n\n` +
    `🛒 *ORDER ITEMS:*\n${itemLines}\n\n` +
    `🧾 *Total: ₹${total}*\n\n` +
    `📦 *DELIVERY DETAILS:*\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `📍 Area: ${area}\n` +
    `🏠 Address: ${address}\n` +
    (notes ? `📝 Notes: ${notes}\n` : '') +
    `\nPlease confirm my order. Thank you!`

  window.open(`https://wa.me/919995679729?text=${encodeURIComponent(message)}`, '_blank')
  closeAddressModal()

  // Clear cart after order
  cart = []
  updateCart()
  toggleCart()
  showToast('Order sent on WhatsApp!', '🎉')
}

function highlight(fieldId, msg) {
  const el = document.getElementById(fieldId)
  el.style.borderColor = '#E10600'
  el.style.boxShadow   = '0 0 0 3px rgba(225,6,0,0.15)'
  el.focus()
  el.placeholder = msg
  setTimeout(() => {
    el.style.borderColor = ''
    el.style.boxShadow   = ''
  }, 2000)
}

// ─── FOOD GRID ────────────────────────────────────────────────────────────────
function starsHTML(n) {
  return Array.from({length:5}, (_,i) =>
    `<span style="color:${i < n ? '#f59e0b' : '#ddd'}">★</span>`
  ).join('')
}

function renderItems(list) {
  const grid = document.getElementById('foodGrid')
  if (!grid) return
  grid.innerHTML = ''

  list.forEach(item => {
    const card = document.createElement('div')
    card.className = `food-card${item.soldOut ? ' sold-out-card' : ''}`
    card.innerHTML = `
        <div class="food-card-img-wrap">
          ${item.popular && !item.soldOut ? '<div class="popular-badge">🔥 Popular</div>' : ''}
          ${item.soldOut ? '<div class="soldout-badge">Sold Out</div>' : ''}
          <img src="${item.img}" loading="lazy" alt="${item.title}">
        </div>
        <div class="food-card-body">
          <div class="food-card-stars">${starsHTML(item.rating)}</div>
          <h3>${item.title}</h3>
          <div class="food-card-footer">
            <p>₹${item.price}</p>
            ${item.soldOut
              ? `<button class="add-round-btn sold-out-btn" disabled>✕</button>`
              : `<button class="add-round-btn" data-id="${item.id}">+</button>`
            }
          </div>
        </div>`

    // Attach click directly on the button element — no inline onclick, works with ES modules
    if (!item.soldOut) {
      card.querySelector('.add-round-btn').addEventListener('click', () => addToCart(item))
    }

    grid.appendChild(card)
  })
}

function filterItems(cat) {
  document.querySelectorAll('.category-bar button').forEach(btn => {
    const match = cat === 'all' ? btn.textContent === 'All' : btn.textContent.toLowerCase() === cat
    btn.classList.toggle('active', match)
  })
  renderItems(cat === 'all' ? items : items.filter(i => i.cat === cat))
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.category-bar button')?.classList.add('active')
})

// ─── EXPOSE TO WINDOW (required for ES module scope) ─────────────────────────
window.toggleCart        = toggleCart
window.addCurrentItem    = addCurrentItem
window.changeQty         = changeQty
window.filterItems       = filterItems
window.openAddressModal  = openAddressModal
window.closeAddressModal = closeAddressModal
window.confirmOrder      = confirmOrder