document.addEventListener('DOMContentLoaded', () => {

    const navbarToggle = document.querySelector('.fa-bars');
    const navbarMenu = document.querySelector('.navbar .menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        
            if (navbarMenu.classList.contains('active')) {
                document.addEventListener('click', closeMenuOutside);
            } else {
                document.removeEventListener('click', closeMenuOutside);
            }
        });

        navbarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { 
                    navbarMenu.classList.remove('active');
                }
            });
        });

        function closeMenuOutside(event) {
            if (!navbarMenu.contains(event.target) && !navbarToggle.contains(event.target)) {
                navbarMenu.classList.remove('active');
                document.removeEventListener('click', closeMenuOutside);
            }
        }
    }

    const searchIcon = document.querySelector('.btn-search');
    const searchInput = document.querySelector('.search-form input[type="search"]');

    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                showCustomAlert(`Buscando: "${searchTerm}"...`);
             
                searchInput.value = '';
            } else {
                showCustomAlert('Por favor, ingresa algo para buscar.', 'warning');
            }
        });
    }

    const addToCartButtons = document.querySelectorAll('.add-cart');
    const shoppingCartNumber = document.querySelector('.content-shopping-cart .number');
    let cartItemCount = 0; 

   
    if (localStorage.getItem('cartCount')) {
        cartItemCount = parseInt(localStorage.getItem('cartCount'));
        shoppingCartNumber.textContent = `(${cartItemCount})`;
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            cartItemCount++;
            shoppingCartNumber.textContent = `(${cartItemCount})`;
            localStorage.setItem('cartCount', cartItemCount); 
            showCustomAlert('Producto añadido al carrito!', 'success');
        });
    });

  
    const productOptions = document.querySelectorAll('.container-options span');
    const productContainer = document.querySelector('.container-products');
    const allProducts = Array.from(productContainer.children); 
    productOptions.forEach(option => {
        option.addEventListener('click', () => {
            
            productOptions.forEach(opt => opt.classList.remove('active'));
           
            option.classList.add('active');

            const selectedFilter = option.dataset.filter; 
            filterProducts(selectedFilter);
        });
    });

    function filterProducts(filter) {
        allProducts.forEach(product => {
           
            const category = product.dataset.category;

            if (filter === 'all' || category === filter) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        showCustomAlert(`Mostrando productos: ${filter === 'all' ? 'todos' : filter}`, 'info');
    }

    const defaultFilterOption = document.querySelector('.container-options span.active');
    if (defaultFilterOption) {
        filterProducts(defaultFilterOption.dataset.filter);
    }


    const newsletterInput = document.querySelector('.newsletter input[type="email"]');
    const newsletterButton = document.querySelector('.newsletter button');

    if (newsletterInput && newsletterButton) {
        newsletterButton.addEventListener('click', () => {
            const email = newsletterInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (email === '') {
                showCustomAlert('Por favor, ingresa tu correo electrónico para suscribirte.', 'warning');
            } else if (!emailRegex.test(email)) {
                showCustomAlert('Por favor, ingresa un correo electrónico válido.', 'error');
            } else {
                showCustomAlert(`¡Gracias por suscribirte con: ${email}!`, 'success');
                newsletterInput.value = '';
            }
        });
    }

    document.querySelectorAll('.navbar .menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

   
    
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slides img');
        const prevBtn = carouselContainer.querySelector('.carousel-prev');
        const nextBtn = carouselContainer.querySelector('.carousel-next');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        let currentSlide = 0;
        let slideInterval;

    
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showSlide(index));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) slide.classList.add('active');
            });
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) dot.classList.add('active');
            });
            currentSlide = index;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        
        function startSlider() {
            slideInterval = setInterval(nextSlide, 5000); 
        }

        function stopSlider() {
            clearInterval(slideInterval);
        }

        carouselContainer.addEventListener('mouseenter', stopSlider);
        carouselContainer.addEventListener('mouseleave', startSlider);

        showSlide(currentSlide);
        startSlider();
    }

    document.querySelectorAll('.stars-rating').forEach(ratingContainer => {
        const stars = ratingContainer.querySelectorAll('i');

        stars.forEach((star, index) => {
            star.dataset.value = index + 1; 

            star.addEventListener('mouseover', () => {
                highlightStars(stars, index + 1);
            });

            star.addEventListener('mouseout', () => {
                
                const currentValue = ratingContainer.dataset.rating || 0;
                highlightStars(stars, currentValue);
            });

            star.addEventListener('click', () => {
                const value = index + 1;
                ratingContainer.dataset.rating = value; 
                highlightStars(stars, value);
                showCustomAlert(`Has puntuado con ${value} estrellas.`, 'success');
             
            });
        });

        
        function highlightStars(starElements, count) {
            starElements.forEach((s, i) => {
                if (i < count) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid'); 
                } else {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular'); 
                }
      
                s.style.color = (i < count) ? 'var(--primary-color)' : ''; 
            });
        }

        const initialRating = ratingContainer.dataset.rating || 0;
        highlightStars(stars, initialRating);
    });

    const countdownTimers = document.querySelectorAll('.countdown-timer');

    countdownTimers.forEach(timer => {
        const targetDateStr = timer.dataset.targetDate;
        const targetDate = new Date(targetDateStr).getTime();

        if (isNaN(targetDate)) {
            console.error('Fecha objetivo del contador inválida:', targetDateStr);
            timer.textContent = 'Fecha inválida';
            return;
        }

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                timer.innerHTML = '¡Oferta Terminada!';
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timer.innerHTML = `
                <span class="countdown-value">${days}</span>D
                <span class="countdown-value">${hours}</span>H
                <span class="countdown-value">${minutes}</span>M
                <span class="countdown-value">${seconds}</span>S
            `;
        };

        const interval = setInterval(updateCountdown, 1000);
        updateCountdown();
    });

    function showCustomAlert(message, type = 'info', duration = 3000) {
        const alertContainer = document.getElementById('custom-alert-container') || (() => {
            const div = document.createElement('div');
            div.id = 'custom-alert-container';
            Object.assign(div.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none'
            });
            document.body.appendChild(div);
            return div;
        })();

        const alertBox = document.createElement('div');
        alertBox.classList.add('custom-alert', type);
        alertBox.textContent = message;
        Object.assign(alertBox.style, {
            padding: '10px 20px',
            borderRadius: '5px',
            color: '#fff',
            fontWeight: 'bold',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
            transform: 'translateX(100%)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            pointerEvents: 'auto' 
        });

        
        if (type === 'success') alertBox.style.backgroundColor = '#4CAF50';
        else if (type === 'warning') alertBox.style.backgroundColor = '#ff9800';
        else if (type === 'error') alertBox.style.backgroundColor = '#f44336';
        else alertBox.style.backgroundColor = '#2196F3'; 

        alertContainer.appendChild(alertBox);

        
        setTimeout(() => {
            alertBox.style.opacity = '1';
            alertBox.style.transform = 'translateX(0)';
        }, 50);

    
        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.style.transform = 'translateX(100%)';
            alertBox.addEventListener('transitionend', () => alertBox.remove());
        }, duration);
    }

    const fadeInElements = document.querySelectorAll('.fade-in-on-scroll'); 
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

});
