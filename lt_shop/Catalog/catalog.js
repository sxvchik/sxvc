document.addEventListener('DOMContentLoaded', function() {
    const filterToggle = document.querySelector('.filter-toggle');
    const catalogFilters = document.querySelector('.catalog-filters');
    const filterOverlay = document.querySelector('.filter-overlay');
    
    if (filterToggle && catalogFilters) {
        filterToggle.addEventListener('click', function() {
            catalogFilters.classList.toggle('active');
            filterOverlay.classList.toggle('active');
            document.body.style.overflow = catalogFilters.classList.contains('active') ? 'hidden' : '';
        });

        filterOverlay.addEventListener('click', function() {
            catalogFilters.classList.remove('active');
            filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && catalogFilters.classList.contains('active')) {
                catalogFilters.classList.remove('active');
                filterOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    
    if (priceRange && priceDisplay) {
        const formatPrice = (price) => {
            return new Intl.NumberFormat('ru-RU').format(price);
        };
        
        const updatePrice = () => {
            const value = parseInt(priceRange.value);
            priceDisplay.textContent = `0 - ${formatPrice(value)} руб.`;
        };
        
        priceRange.addEventListener('input', updatePrice);
        priceRange.addEventListener('change', updatePrice);
        updatePrice(); 
    }
    
    document.querySelectorAll('.filter-list input').forEach(input => {
        input.addEventListener('change', function() {
            console.log('Фильтр изменен:', this.value);
        });
    });
    
    const resetFilters = document.querySelector('.reset-filters');
    const filterCheckboxes = document.querySelectorAll('.filter-list input[type="checkbox"]');
    
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            if (priceRange) {
                priceRange.value = 25000;
                if (priceDisplay) priceDisplay.textContent = '0 - 25 000 руб.';
            }
        });
    }
});
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, name, price, image) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
}

function updateCartCounter() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems ? 'inline-flex' : 'none';
  });
}

function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = button.closest('.product-card');
      if (!productCard) return;
      const title = productCard.querySelector('.product-title')?.textContent?.trim() || '';
      const brand = productCard.querySelector('.product-brand')?.textContent?.trim() || '';
      const priceText = productCard.querySelector('.product-price')?.textContent || '';
      const image = productCard.querySelector('.product-image')?.getAttribute('src') || '';
      // Use title+brand as a unique id (or use data attributes if available)
      const productId = (title + brand).replace(/\s+/g, '-').toLowerCase();
      // Extract price as number
      const priceMatch = priceText.replace(/[^\d]/g, '');
      const price = parseInt(priceMatch, 10) || 0;
      addToCart(productId, title, price, image);
    });
  });
}

// Initialize cart counter and buttons on page load
updateCartCounter();
setupAddToCartButtons();