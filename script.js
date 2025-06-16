document.addEventListener('DOMContentLoaded', () => {
    // 1. Navegación Responsiva (Menú hamburguesa)
    const navbarToggle = document.querySelector('.fa-bars');
    const navbarMenu = document.querySelector('.navbar .menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            // Cierra el menú si se hace clic fuera cuando está abierto
            if (navbarMenu.classList.contains('active')) {
                document.addEventListener('click', closeMenuOutside);
            } else {
                document.removeEventListener('click', closeMenuOutside);
            }
        });

        // Cierra el menú al hacer clic en un enlace (si es un enlace de ancla)
        navbarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { // Solo en pantallas pequeñas
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

    // 2. Funcionalidad de Búsqueda
    const searchIcon = document.querySelector('.btn-search');
    const searchInput = document.querySelector('.search-form input[type="search"]');

    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                showCustomAlert(`Buscando: "${searchTerm}"...`);
                // Aquí podrías redirigir a una página de resultados de búsqueda,
                // filtrar productos en la misma página (ver punto 3 avanzado)
                // o enviar una petición AJAX.
                searchInput.value = '';
            } else {
                showCustomAlert('Por favor, ingresa algo para buscar.', 'warning');
            }
        });
    }

    // 3. Sistema de "Añadir al Carrito" (Mejorado)
    const addToCartButtons = document.querySelectorAll('.add-cart');
    const shoppingCartNumber = document.querySelector('.content-shopping-cart .number');
    let cartItemCount = 0; // Inicializar en 0

    // Cargar el conteo del carrito si está guardado en localStorage
    if (localStorage.getItem('cartCount')) {
        cartItemCount = parseInt(localStorage.getItem('cartCount'));
        shoppingCartNumber.textContent = `(${cartItemCount})`;
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Evita cualquier acción predeterminada del enlace/botón
            cartItemCount++;
            shoppingCartNumber.textContent = `(${cartItemCount})`;
            localStorage.setItem('cartCount', cartItemCount); // Guardar en localStorage
            showCustomAlert('Producto añadido al carrito!', 'success');
        });
    });

    // 4. Cambiar entre opciones de productos (Filtro Dinámico)
    const productOptions = document.querySelectorAll('.container-options span');
    const productContainer = document.querySelector('.container-products');
    const allProducts = Array.from(productContainer.children); // Guarda todos los productos inicialmente

    productOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remover la clase 'active' de todas las opciones
            productOptions.forEach(opt => opt.classList.remove('active'));
            // Añadir la clase 'active' a la opción clicada
            option.classList.add('active');

            const selectedFilter = option.dataset.filter; // Usar data-filter en HTML
            filterProducts(selectedFilter);
        });
    });

    function filterProducts(filter) {
        allProducts.forEach(product => {
            // Asume que cada .card-product tiene un atributo data-category="destacado", "reciente", "vendido"
            const category = product.dataset.category;

            if (filter === 'all' || category === filter) {
                product.style.display = 'block'; // O el display original
            } else {
                product.style.display = 'none';
            }
        });
        showCustomAlert(`Mostrando productos: ${filter === 'all' ? 'todos' : filter}`, 'info');
    }

    // Inicializar el filtro al cargar la página (muestra destacados por defecto)
    // Se asume que el primer span en .container-options es 'Destacados' y tiene data-filter="featured"
    const defaultFilterOption = document.querySelector('.container-options span.active');
    if (defaultFilterOption) {
        filterProducts(defaultFilterOption.dataset.filter);
    }


    // 5. Interacción con el Boletín informativo (Newsletter)
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

    // --- NUEVAS FUNCIONALIDADES ---

    // 6. Desplazamiento Suave (Smooth Scrolling)
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

    // 7. Carrusel/Slider Básico (Para el Banner, si lo deseas hacer dinámico)
    // Necesitarás añadir un HTML específico para el carrusel con imágenes y botones de navegación
    // Ejemplo de estructura HTML:
    /*
    <div class="carousel-container">
        <div class="carousel-slides">
            <img src="img/banner.jpg" class="active">
            <img src="img/banner2.jpg">
            <img src="img/banner3.jpg">
        </div>
        <button class="carousel-prev">❮</button>
        <button class="carousel-next">❯</button>
        <div class="carousel-dots"></div>
    </div>
    */
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slides img');
        const prevBtn = carouselContainer.querySelector('.carousel-prev');
        const nextBtn = carouselContainer.querySelector('.carousel-next');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        let currentSlide = 0;
        let slideInterval;

        // Crear puntos de navegación
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

        // Auto-play
        function startSlider() {
            slideInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
        }

        function stopSlider() {
            clearInterval(slideInterval);
        }

        carouselContainer.addEventListener('mouseenter', stopSlider);
        carouselContainer.addEventListener('mouseleave', startSlider);

        showSlide(currentSlide);
        startSlider();
    }


    // 8. Sistema de Puntuación con Estrellas (Rating Stars)
    // Asume que tienes un contenedor para las estrellas con la clase 'stars-rating' y dentro de ellas, íconos de estrellas
    document.querySelectorAll('.stars-rating').forEach(ratingContainer => {
        const stars = ratingContainer.querySelectorAll('i');

        stars.forEach((star, index) => {
            star.dataset.value = index + 1; // Asignar un valor a cada estrella

            star.addEventListener('mouseover', () => {
                highlightStars(stars, index + 1);
            });

            star.addEventListener('mouseout', () => {
                // Volver al estado guardado o inicial si no hay clic previo
                const currentValue = ratingContainer.dataset.rating || 0;
                highlightStars(stars, currentValue);
            });

            star.addEventListener('click', () => {
                const value = index + 1;
                ratingContainer.dataset.rating = value; // Guardar la puntuación seleccionada
                highlightStars(stars, value);
                showCustomAlert(`Has puntuado con ${value} estrellas.`, 'success');
                // Aquí podrías enviar la puntuación a un servidor
            });
        });

        // Función para resaltar estrellas
        function highlightStars(starElements, count) {
            starElements.forEach((s, i) => {
                if (i < count) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid'); // Estrella rellena
                } else {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular'); // Estrella vacía
                }
                // Asegúrate de que el color sea el de tus estrellas principales (primary-color)
                s.style.color = (i < count) ? 'var(--primary-color)' : ''; // o tu color por defecto
            });
        }

        // Inicializar estrellas si hay un rating predefinido
        const initialRating = ratingContainer.dataset.rating || 0;
        highlightStars(stars, initialRating);
    });

    // 9. Contador de Tiempo para Ofertas (Countdown Timer)
    // Necesitas un elemento HTML con la clase 'countdown-timer' y un data-target-date="YYYY-MM-DDTHH:MM:SS"
    // Ejemplo: <div class="countdown-timer" data-target-date="2025-12-31T23:59:59"></div>
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
        updateCountdown(); // Llamada inicial para mostrar el contador inmediatamente
    });


    // 10. Alertas Personalizadas (Función de Utilidad)
    // En lugar del feo alert() del navegador
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
                pointerEvents: 'none' // Para que no bloquee clics
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
            pointerEvents: 'auto' // Habilitar clics en la alerta misma
        });

        // Estilos por tipo
        if (type === 'success') alertBox.style.backgroundColor = '#4CAF50';
        else if (type === 'warning') alertBox.style.backgroundColor = '#ff9800';
        else if (type === 'error') alertBox.style.backgroundColor = '#f44336';
        else alertBox.style.backgroundColor = '#2196F3'; // 'info'

        alertContainer.appendChild(alertBox);

        // Animación de entrada
        setTimeout(() => {
            alertBox.style.opacity = '1';
            alertBox.style.transform = 'translateX(0)';
        }, 50);

        // Animación de salida y remoción
        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.style.transform = 'translateX(100%)';
            alertBox.addEventListener('transitionend', () => alertBox.remove());
        }, duration);
    }

    // 11. Animación al Scroll (Ej. Fade-in de elementos)
    const fadeInElements = document.querySelectorAll('.fade-in-on-scroll'); // Añade esta clase a los elementos que quieres animar

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% del elemento visible para activar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Añade una clase para activar la animación CSS
                observer.unobserve(entry.target); // Deja de observar una vez animado
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // Añade el CSS para .fade-in-on-scroll y .fade-in-on-scroll.visible
    // .fade-in-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
    // .fade-in-on-scroll.visible { opacity: 1; transform: translateY(0); }


});