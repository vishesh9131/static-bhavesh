document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close the mobile menu when a link is clicked
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Hero slider functionality
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;

    function showSlide(n) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

    // Auto-advance slides every 5 seconds
    setInterval(() => showSlide(currentSlide + 1), 5000);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Handle newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        // Here you would typically send the email to your server
        alert(`Thank you for subscribing with email: ${email}`);
        this.reset();
    });

    // Product sorting functionality
    const sortSelect = document.getElementById('sort-select');
    const productGrid = document.querySelector('.product-grid');

    sortSelect.addEventListener('change', function() {
        const products = Array.from(productGrid.children);
        const sortValue = this.value;

        products.sort((a, b) => {
            const aPrice = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
            const bPrice = parseFloat(b.querySelector('.price').textContent.replace('$', ''));

            if (sortValue === 'price-low-high') {
                return aPrice - bPrice;
            } else if (sortValue === 'price-high-low') {
                return bPrice - aPrice;
            }
            // Add more sorting options as needed
        });

        productGrid.innerHTML = '';
        products.forEach(product => productGrid.appendChild(product));
    });

    // Lazy loading images
    const images = document.querySelectorAll('img[data-src]');
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    let observer = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                preloadImage(entry.target);
                self.unobserve(entry.target);
            }
        });
    }, config);

    images.forEach(image => {
        observer.observe(image);
    });

    function preloadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) { return; }
        img.src = src;
    }

    // Scroll progress bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollable) * 100;
        progressBar.style.width = `${progress}%`;
    });

    // Quick view functionality
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('quick-view-modal');
    const modalContent = document.getElementById('quick-view-content');
    const closeBtn = document.querySelector('.close');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productInfo = btn.closest('.product-item').innerHTML;
            modalContent.innerHTML = productInfo;
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        once: true,
    });

    // Keyboard navigation for dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const content = dropdown.querySelector('.dropdown-content');
        const items = content.querySelectorAll('a');

        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            }
        });

        items.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    items[index + 1]?.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    index === 0 ? link.focus() : items[index - 1].focus();
                } else if (e.key === 'Escape') {
                    content.style.display = 'none';
                    link.focus();
                }
            });
        });
    });

    if (!window.productGrid) {
        window.productGrid = document.querySelector('.product-grid');
    }

    let page = 1;
    const loadMoreProducts = () => {
        // Simulating API call to load more products
        setTimeout(() => {
            for (let i = 0; i < 4; i++) {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <img src="product${Math.floor(Math.random() * 5) + 1}.jpg" alt="Product">
                    <h3>New Product</h3>
                    <p class="price">$${(Math.random() * 1000).toFixed(2)}</p>
                    <a href="#" class="add-to-cart">Add to Cart</a>
                    <a href="#" class="quick-view-btn">Quick View</a>
                `;
                productGrid.appendChild(productItem);
            }
            page++;
        }, 1000);
    };

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            loadMoreProducts();
        }
    });
});