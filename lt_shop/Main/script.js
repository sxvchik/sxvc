document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    const closeButton = document.createElement('div');
      
    closeButton.className = 'close-button';
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 24px;
        color: white;
        cursor: pointer;
        z-index: 1002;
    `;
    mobileMenu.appendChild(closeButton);

    if (!burgerMenu || !mobileMenu) {
        console.error('Burger menu elements not found');
        return;
    }

    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    burgerMenu.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    closeButton.addEventListener('click', function() {
        toggleMenu();
    });

    document.addEventListener('click', function(event) {
        if (mobileMenu.classList.contains('active')) {
            const isClickInside = mobileMenu.contains(event.target) || burgerMenu.contains(event.target);
            if (!isClickInside) {
                toggleMenu();
            }
        }
    });

    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMenu();
        });
    });

    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-button.prev');
    const nextButton = document.querySelector('.slider-button.next');

    if (!slider || slides.length === 0) return;

    const originalSlides = Array.from(slides);
    originalSlides.forEach(slide => {
        const cloneStart = slide.cloneNode(true);
        const cloneEnd = slide.cloneNode(true);
        slider.insertBefore(cloneStart, slider.firstChild);
        slider.appendChild(cloneEnd);
    });

    const slideWidth = slides[0].offsetWidth + 30;
    let currentIndex = slides.length;
    let isTransitioning = false;

    function updateSliderPosition(animate = true) {
        const translateX = -currentIndex * slideWidth;
        slider.style.transition = animate ? 'transform 0.6s ease' : 'none';
        slider.style.transform = `translateX(${translateX}px)`;
    }

    function moveToSlide(direction) {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex += direction;
        updateSliderPosition(true);

        setTimeout(() => {
            if (currentIndex <= 0) {
                currentIndex = slides.length;
                updateSliderPosition(false);
            } else if (currentIndex >= slides.length * 2) {
                currentIndex = slides.length;
                updateSliderPosition(false);
            }
            isTransitioning = false;
        }, 600);
    }

    updateSliderPosition(false);

    nextButton.addEventListener('click', () => moveToSlide(1));
    prevButton.addEventListener('click', () => moveToSlide(-1));

    slider.addEventListener('transitionend', () => {
        isTransitioning = false;
    });

    let autoScrollInterval;
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => moveToSlide(1), 3000);
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
    };

    startAutoScroll();
    
    slider.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('mouseleave', startAutoScroll);
    
    prevButton.addEventListener('mouseenter', stopAutoScroll);
    nextButton.addEventListener('mouseenter', stopAutoScroll);
    prevButton.addEventListener('mouseleave', startAutoScroll);
    nextButton.addEventListener('mouseleave', startAutoScroll);

    // --- Add-to-cart logic start ---
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
                const title = productCard.querySelector('h3')?.textContent?.trim() || '';
                // No brand on main page, so use empty string
                const brand = '';
                // Try to get price from .current-price or .price-block
                let priceText = productCard.querySelector('.current-price')?.textContent || '';
                if (!priceText) {
                    priceText = productCard.querySelector('.price-block')?.textContent || '';
                }
                const image = productCard.querySelector('img')?.getAttribute('src') || '';
                // Use title as a unique id (or title+brand)
                const productId = (title + brand).replace(/\s+/g, '-').toLowerCase();
                // Extract price as number
                const priceMatch = priceText.replace(/[^\d]/g, '');
                const price = parseInt(priceMatch, 10) || 0;
                addToCart(productId, title, price, image);
            });
        });
    }

    updateCartCounter();
    setupAddToCartButtons();
    // --- Add-to-cart logic end ---
});

