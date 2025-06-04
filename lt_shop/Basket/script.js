document.addEventListener('DOMContentLoaded', function() {
  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
  function setCart(newCart) {
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  let cart = getCart();
  updateCartCounter();
  renderCartItems();

  function renderCartItems() {
      cart = getCart();
      const cartItemsContainer = document.querySelector('.cart-items');
      if (!cartItemsContainer) return;

      cartItemsContainer.innerHTML = '';
      let total = 0;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-basket-message">Ваша корзина пуста</div>';
      }

      cart.forEach(item => {
          total += item.price * item.quantity;

          const itemHTML = `
            <div class="basket-product" data-id="${escapeHtml(item.id)}">
              <div class="product-info">
                <div class="item-image">
                  <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
                </div>
                <div class="item-details">
                  <h3 class="item-name">${escapeHtml(item.name)}</h3>
                  <div class="item-price">${item.price.toLocaleString()} ₽</div>
                </div>
              </div>
              <div class="actions">
                <div class="quantity-control">
                  <button class="quantity-btn minus">−</button>
                  <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                  <button class="quantity-btn plus">+</button>
                </div>
                <button class="button delete remove-item">Удалить</button>
              </div>
            </div>
          `;
          cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
      });

      document.querySelector('.summary-row:nth-child(2) span:last-child').textContent =
          `${total.toLocaleString()} ₽`;
      document.querySelector('.summary-row.total span:last-child').textContent =
          `${total.toLocaleString()} ₽`;
  }

  document.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-item')) {
          const itemId = e.target.closest('.basket-product').dataset.id;
          cart = getCart();
          cart = cart.filter(item => item.id !== itemId);
          saveAndUpdate();
      }
      if (e.target.classList.contains('quantity-btn')) {
        const input = e.target.parentElement.querySelector('.quantity-input');
        const itemId = e.target.closest('.basket-product').dataset.id;
        cart = getCart();
        const item = cart.find(item => item.id === itemId);

        if (e.target.classList.contains('minus') && item.quantity > 1) {
            item.quantity--;
        } else if (e.target.classList.contains('plus')) {
            item.quantity++;
        }

        input.value = item.quantity;
        saveAndUpdate();
    }
});

document.addEventListener('input', function(e) {
    if (e.target.classList.contains('quantity-input')) {
        const input = e.target;
        const itemId = input.closest('.basket-product').dataset.id;
        cart = getCart();
        const item = cart.find(item => item.id === itemId);
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) val = 1;
        item.quantity = val;
        input.value = val;
        saveAndUpdate();
    }
});

function saveAndUpdate() {
    setCart(cart);
    cart = getCart();
    updateCartCounter();
    renderCartItems();
}

function updateCartCounter() {
    cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems ? 'inline-flex' : 'none';
    });
}

function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', async () => {
      cart = getCart();
      const response = await fetch('/api/checkout', {
          method: 'POST',
          body: JSON.stringify(cart),
          headers: {'Content-Type': 'application/json'}
      });
  });
}
});
