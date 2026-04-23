/**
 * Warenkorb-System mit localStorage
 * Verwaltet lokale Warenkorb-Daten und leitet zu Stripe Payment Link weiter
 */

// ============================================
// CONFIGURATION
// ============================================
// Trage hier deine Stripe Payment Link ein:
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/YOUR_PAYMENT_LINK_HERE';

// ============================================
// CART MANAGEMENT
// ============================================

class Cart {
  constructor() {
    this.storageKey = 'lumeraCart';
    this.load();
  }

  load() {
    const data = localStorage.getItem(this.storageKey);
    this.items = data ? JSON.parse(data) : [];
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.updateCounter();
  }

  add(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: 1
      });
    }
    
    this.save();
    this.showNotification(`${product.name} wurde zum Warenkorb hinzugefügt`);
  }

  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
    }
  }

  clear() {
    this.items = [];
    this.save();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateCounter() {
    const counters = document.querySelectorAll('.cart-items-count');
    const count = this.getCount();
    counters.forEach(counter => {
      counter.textContent = count > 0 ? count : '0';
    });
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--accent);
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-size: 14px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  }
}

// Globale Cart-Instanz
const cart = new Cart();

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Add-to-Cart Buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const product = {
        id: this.dataset.productId,
        name: this.dataset.productName,
        price: this.dataset.productPrice,
        image: this.dataset.productImage
      };
      cart.add(product);
    });
  });

  // Cart Button - öffne Warenkorb-Modal
  document.querySelectorAll('#cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      showCartModal();
    });
  });

  // Initial Counter Update
  cart.updateCounter();
});

// ============================================
// CART MODAL
// ============================================

function showCartModal() {
  const modal = document.createElement('div');
  modal.className = 'cart-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9000;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  `;

  if (cart.items.length === 0) {
    content.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <p style="font-size: 18px; color: var(--text-muted); margin-bottom: 1rem;">
          Dein Warenkorb ist leer
        </p>
        <button onclick="this.closest('.cart-modal').remove()" 
                style="padding: 8px 16px; background: var(--mid); color: white; border: none; border-radius: 4px; cursor: pointer;">
          Schliessen
        </button>
      </div>
    `;
  } else {
    let itemsHTML = cart.items.map(item => `
      <div style="
        padding: 1rem;
        border-bottom: 1px solid var(--warm);
        display: flex;
        gap: 12px;
      ">
        <img src="${item.image}" alt="${item.name}" style="
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        ">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px;">${item.name}</h4>
          <p style="margin: 0; font-size: 13px; color: var(--text-muted);">CHF ${(item.price).toFixed(2)}</p>
          <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1}); showCartModal()" 
                    style="width: 24px; height: 24px; padding: 0; border: 1px solid var(--warm); background: white; cursor: pointer; border-radius: 2px;">
              −
            </button>
            <span style="width: 30px; text-align: center; font-size: 14px;">${item.quantity}</span>
            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1}); showCartModal()" 
                    style="width: 24px; height: 24px; padding: 0; border: 1px solid var(--warm); background: white; cursor: pointer; border-radius: 2px;">
              +
            </button>
            <button onclick="cart.remove('${item.id}'); showCartModal()" 
                    style="margin-left: auto; padding: 4px 8px; border: none; background: #f0f0f0; color: var(--text-muted); cursor: pointer; border-radius: 2px; font-size: 12px;">
              Entfernen
            </button>
          </div>
        </div>
      </div>
    `).join('');

    const total = cart.getTotal();
    content.innerHTML = `
      <div style="padding: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 20px;">Warenkorb</h3>
      </div>
      ${itemsHTML}
      <div style="
        padding: 1.5rem;
        background: var(--warm);
        border-top: 1px solid #e0e0e0;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 16px;
          font-weight: 500;
        ">
          <span>Total:</span>
          <span>CHF ${total.toFixed(2)}</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="this.closest('.cart-modal').remove()" 
                  style="flex: 1; padding: 10px; border: 1px solid var(--mid); background: white; color: var(--mid); cursor: pointer; border-radius: 4px;">
            Zurück
          </button>
          <button onclick="proceedToCheckout()" 
                  style="flex: 1; padding: 10px; background: var(--accent); color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: 500;">
            Zur Kasse
          </button>
        </div>
      </div>
    `;
  }

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 28px;
    color: var(--mid);
    cursor: pointer;
    z-index: 9001;
  `;
  closeBtn.onclick = () => modal.remove();

  content.appendChild(closeBtn);
  modal.appendChild(content);
  document.body.appendChild(modal);

  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.remove();
  });
}

// ============================================
// CHECKOUT
// ============================================

function proceedToCheckout() {
  if (cart.items.length === 0) {
    cart.showNotification('Warenkorb ist leer');
    return;
  }

  // Schließe Modal
  document.querySelector('.cart-modal')?.remove();

  // TODO: Hier könnten wir die Cart-Items zu Stripe übergeben
  // Für jetzt: Redirect zu Stripe Payment Link
  // In Zukunft: Mit Stripe API arbeiten, um dynamische Checkout zu erstellen

  if (STRIPE_PAYMENT_LINK === 'https://buy.stripe.com/YOUR_PAYMENT_LINK_HERE') {
    alert('⚠️ Stripe Payment Link nicht konfiguriert!\n\nBitte in warenkorb.js die STRIPE_PAYMENT_LINK Variable mit deiner echten Stripe Payment Link aktualisieren.');
    return;
  }

  // Redirect zu Stripe
  window.location.href = STRIPE_PAYMENT_LINK;
}

// ============================================
// CSS ANIMATIONS
// ============================================

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(20px);
    }
  }

  .cart-modal {
    animation: slideIn 0.3s ease-out;
  }

  .cart-modal > div {
    animation: slideIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);
