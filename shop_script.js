/* -------------------------------------------------
   shop_script.js
------------------------------------------------- */

const TOTAL_SLOTS = 7;
const SITE_OPEN = localStorage.getItem('siteOpen') !== 'false';
const FILLED_SLOTS = parseInt(localStorage.getItem('filledSlots')) || 0;
const DISABLED_PRODUCTS = JSON.parse(localStorage.getItem('disabledProducts')) || [];
let basePrice = 0;

/* ---------- 1. SHOP CLOSED OVERLAY ---------- */
const overlay = document.getElementById('closedOverlay');
if (!SITE_OPEN && overlay) {
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/* ---------- 2. SEASONAL FALLING EMOJIS ---------- */
function applySeasonalTheme() {
  const container = document.getElementById('seasonalContainer');
  if (!container) return;

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  let emoji = '🍓';

  if (month === 10) emoji = '🎃';
  else if (month === 12 && day <= 25) emoji = '❄️';
  else if (month === 2 && day <= 14) emoji = '❤️';
  else if (month >= 3 && month <= 5) emoji = '🌸';
  else if (month >= 6 && month <= 8) emoji = '☀️';

  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'seasonal-item';
    el.textContent = emoji;
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (Math.random() * 3 + 5) + 's';
    el.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(el);
  }
}

/* ---------- 3. SLOTS TRACKER ---------- */
function initSlots() {
  const filledSlots = parseInt(localStorage.getItem('filledSlots')) || 0;
  const openCount = TOTAL_SLOTS - filledSlots;
  const countEl = document.getElementById('openSlotsCount');
  const display = document.getElementById('slotsDisplay');

  if (countEl) countEl.textContent = openCount;
  if (!display) return;

  display.innerHTML = '';
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot ' + (i < openCount ? 'open' : 'filled');
    slot.textContent = i < openCount ? 'ִֶָ🐇་' : '✔️';
    display.appendChild(slot);
  }

  updateOutOfStockStatus();
}

/* ---------- 4. OUT-OF-STOCK STATUS ---------- */
function updateOutOfStockStatus() {
  const filledSlots = parseInt(localStorage.getItem('filledSlots')) || 0;
  const openCount = TOTAL_SLOTS - filledSlots;
  const isGlobalSoldOut = openCount === 0;
  const disabledProducts = JSON.parse(localStorage.getItem('disabledProducts')) || [];
  const cards = document.querySelectorAll('.product-card');
  if (!cards) return;

  cards.forEach(card => {
    const productId = card.dataset.id;
    const isDisabled = disabledProducts.includes(productId) || isGlobalSoldOut;
    card.classList.toggle('out-of-stock', isDisabled);
    const btn = card.querySelector('.buy-button');
    if (btn) {
      btn.disabled = isDisabled;
      btn.textContent = isDisabled ? 'Out Of Stock' : 'Order Now';
    }
  });
}


/* ---------- 6. ANIMATION ---------- */
function updateAnimationPrice(sel) {
  if (!sel) return;
  const price = sel.value;
  const priceEl = document.getElementById('animationPrice');
  const btn = document.getElementById('animationBtn');
  const card = sel.closest('.product-card');
  if (!priceEl || !btn || !card) return;

  priceEl.textContent = price ? `$${price}` : '—';
  btn.disabled = !price;
  card.dataset.price = price || '0';
}

function openAnimationModal() {
  const sel = document.getElementById('animationStyle');
  if (!sel) return;
  const price = sel.value;
  const style = sel.options[sel.selectedIndex]?.text.split(' – ')[0] || '';
  const modal = document.getElementById('orderModal');
  if (!modal) return;

  basePrice = parseInt(price);
  modal.classList.add('active');
  document.getElementById('modalTitle').textContent = `Order: Simple Looped Animation (${style})`;
  document.getElementById('productName').value = `Simple Looped Animation (${style})`;
  document.getElementById('productPrice').value = `$${price}`;
}

/* ---------- 7. STANDARD MODAL ---------- */
function openModal(name, price) {
  const modal = document.getElementById('orderModal');
  if (!modal) return;
  basePrice = price;
  modal.classList.add('active');
  document.getElementById('modalTitle').textContent = `Order: ${name}`;
  document.getElementById('productName').value = name;
  document.getElementById('productPrice').value = `$${price}`;
}

function closeModal() {
  const modal = document.getElementById('orderModal');
  if (!modal) return;
  modal.classList.remove('active');
}

/* ---------- 8. MODAL OUTSIDE-CLICK ---------- */
const orderModal = document.getElementById('orderModal');
if (orderModal) {
  orderModal.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
}

/* ---------- 9. CONFETTI ---------- */
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', () => {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#f58cae', '#ff99c8', '#a8417a'] });
    }
    setTimeout(() => {
      closeModal();
      alert("Thank you! Your order request has been sent. I'll get back to you soon with payment details! 💞");
    }, 500);
  });
}


const images = {
    'chibi': ['images/chibi-1.png', 'images/chibi-2.png'],
    'animation': ['images/anim-1.gif', 'images/anim-2.gif'],
    'trio': ['images/trio-1.png', 'images/trio-2.png'],
    'mlp': ['images/mlp-1.png', 'images/mlp-2.png'],
    'plushie': ['images/plush-1.png', 'images/plush-2.png']
  };

function changeSlide(button, direction) {
  const card = button.closest('.product-card');
  const id = card.dataset.id;
  if (!id || !images[id]) return;

  const img = card.querySelector('.slider-image');
  if (!img) return;

  if (!img.dataset.index) img.dataset.index = 0;

  let index = parseInt(img.dataset.index) + direction;
  if (index < 0) index = images[id].length - 1;
  if (index >= images[id].length) index = 0;

  img.src = images[id][index];
  img.dataset.index = index;
}



window.addEventListener('DOMContentLoaded', () => {
  const animSel = document.getElementById('animationStyle');
  if (animSel) { animSel.selectedIndex = 0; updateAnimationPrice(animSel); }

  applySeasonalTheme();
  initSlots();
  initFloatingButtons();
  updateAllCounts();
});

window.addEventListener('storage', e => {
  if (e.key === 'filledSlots') initSlots();
  if (e.key === 'disabledProducts') updateOutOfStockStatus();
  if (e.key === 'siteOpen') {
    const siteOpen = localStorage.getItem('siteOpen') !== 'false';
    const overlay = document.getElementById('closedOverlay');
    if (!siteOpen) {
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
});


      const bgMusic = document.getElementById('bgMusic');
      let playing = false;
      document.getElementById('musicToggle').addEventListener('click', () => {
        if (playing) {
          bgMusic.pause();
          document.getElementById('musicToggle').textContent = 'Play Music';
        } else {
          bgMusic.play();
          document.getElementById('musicToggle').textContent = 'Pause Music';
        }
        playing = !playing;
      });

      const clickSound = document.getElementById('btnSound');
      document.querySelectorAll('button, input[type="submit"]').forEach(btn => {
        btn.addEventListener('click', () => {
          clickSound.currentTime = 0;
          clickSound.play().catch(() => {});
        });
      });
