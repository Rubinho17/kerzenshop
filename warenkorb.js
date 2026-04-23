/**
 * Statisches Warenkorb-System mit Stripe Produktlinks.
 * Speichert den Warenkorb in localStorage und zeigt ihn in einem Drawer an.
 */

document.addEventListener('DOMContentLoaded', function () {
  const STORAGE_KEY = 'lumeraCart';
  const cartToggle = document.getElementById('cart-toggle');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartBackdrop = document.querySelector('.cart-backdrop');
  const cartClose = document.querySelector('.cart-close');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');
  const cartCheckoutButton = document.getElementById('cart-checkout');
  const cartNote = document.querySelector('.cart-note');

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function formatCurrency(value) {
    return 'CHF ' + Number(value).toFixed(2);
  }

  function getCartQuantity(cart) {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getCartItem(cart, id) {
    return cart.find(item => item.id === id);
  }

  function buildCartItemHtml(item) {
    return `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-image" src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-meta">${formatCurrency(item.price)} × ${item.quantity}</p>
        </div>
        <div class="cart-item-actions">
          <button class="cart-item-remove btn-secondary" type="button">Entfernen</button>
          <a class="cart-item-checkout btn-primary" href="${item.paymentLink || '#'}" ${item.paymentLink ? '' : 'aria-disabled="true" tabindex="-1"'} target="_blank" rel="noreferrer noopener">
            Jetzt bezahlen
          </a>
        </div>
      </div>
    `;
  }

  function renderCart() {
    const cart = loadCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty">Ihr Warenkorb ist noch leer.</p>';
      cartCheckoutButton.disabled = true;
      cartNote.textContent = 'Fügen Sie ein Produkt hinzu, um zur Kasse zu gehen.';
    } else {
      cart.forEach(item => cartItemsContainer.insertAdjacentHTML('beforeend', buildCartItemHtml(item)));

      if (cart.length === 1) {
        cartCheckoutButton.disabled = !cart[0].paymentLink;
        cartCheckoutButton.dataset.paymentLink = cart[0].paymentLink || '';
        cartNote.textContent = cart[0].paymentLink
          ? 'Einzelne Stripe-Zahlungslinks können aktuell pro Produkt verwendet werden.'
          : 'Dieser Artikel hat keinen Stripe-Link.';
      } else {
        cartCheckoutButton.disabled = true;
        cartCheckoutButton.dataset.paymentLink = '';
        cartNote.textContent = 'Bei mehreren Artikeln wählen Sie bitte in jedem Artikel die Schaltfläche „Jetzt bezahlen“.';
      }
    }

    cartTotalEl.textContent = formatCurrency(getCartTotal(cart));
    const quantity = getCartQuantity(cart);
    cartCountEl.textContent = quantity > 0 ? quantity : '';
  }

  function saveAndRender(cart) {
    saveCart(cart);
    renderCart();
  }

  function addToCart(product) {
    const cart = loadCart();
    const existing = getCartItem(cart, product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveAndRender(cart);
  }

  function removeFromCart(productId) {
    const cart = loadCart().filter(item => item.id !== productId);
    saveAndRender(cart);
  }

  function openCart() {
    cartDrawer.hidden = false;
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.hidden = true;
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function setupDrawerEvents() {
    if (!cartToggle || !cartDrawer) return;
    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartBackdrop.addEventListener('click', closeCart);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !cartDrawer.hidden) closeCart();
    });
  }

  function setupCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        const product = {
          id: button.dataset.productId || button.textContent.trim(),
          name: button.dataset.productName || button.textContent.trim(),
          price: parseFloat(button.dataset.productPrice) || 0,
          image: button.dataset.productImage || '',
          paymentLink: button.dataset.paymentLink || '',
        };

        addToCart(product);
        openCart();
      });
    });
  }

  function setupCartActions() {
    cartItemsContainer.addEventListener('click', function (event) {
      const removeButton = event.target.closest('.cart-item-remove');
      if (removeButton) {
        const cartItem = removeButton.closest('.cart-item');
        if (cartItem) {
          removeFromCart(cartItem.dataset.id);
        }
      }
    });

    cartCheckoutButton.addEventListener('click', function () {
      const link = cartCheckoutButton.dataset.paymentLink;
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    });
  }

  function setupVariantSelection() {
    const duftSelect = document.getElementById('duft-select-blumenstrauss');
    const buyButton = document.querySelector('#produkte .produkt-card:first-child .add-to-cart-btn');

    if (!duftSelect || !buyButton) return;

    const syncButton = () => {
      const selectedOption = duftSelect.options[duftSelect.selectedIndex];
      const selectedValue = selectedOption.value;
      const selectedName = selectedOption.dataset.name || selectedValue;
      const selectedLink = selectedOption.dataset.paymentLink || '';

      buyButton.dataset.productId = 'blumenstrauss-' + selectedValue.toLowerCase();
      buyButton.dataset.productName = 'Blumenstrauss – ' + selectedName;
      buyButton.dataset.paymentLink = selectedLink;
    };

    syncButton();
    duftSelect.addEventListener('change', syncButton);
  }

  renderCart();
  setupDrawerEvents();
  setupCartButtons();
  setupCartActions();
  setupVariantSelection();
});
