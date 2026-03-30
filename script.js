/* ===== NOVA Studio — Creative Agency JS ===== */
(function () {
    'use strict';

    // ===== Language =====
    let lang = localStorage.getItem('nova-lang') || 'en';
    function setLang(l) {
        lang = l;
        localStorage.setItem('nova-lang', l);
        document.documentElement.lang = l;
        document.getElementById('langBtn').textContent = l.toUpperCase();
        document.querySelectorAll('[data-lang-en]').forEach(el => {
            el.textContent = el.getAttribute('data-lang-' + l);
        });
    }
    document.getElementById('langBtn').addEventListener('click', () => setLang(lang === 'en' ? 'ru' : 'en'));

    // ===== Custom Cursor =====
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0, cx = 0, cy = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            cx += (mouseX - cx) * 0.12;
            cy += (mouseY - cy) * 0.12;
            follower.style.left = cx + 'px';
            follower.style.top = cy + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effects on interactive elements
        const interactives = document.querySelectorAll('a, button, .portfolio-card, .service-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
    }

    // ===== Hero Glow Follow Mouse =====
    const heroGlow = document.getElementById('heroGlow');
    const heroSection = document.getElementById('heroSection');
    if (heroGlow && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', e => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left - 300;
            const y = e.clientY - rect.top - 300;
            heroGlow.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // ===== Header Scroll =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    });

    // ===== Mobile Menu =====
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
        });
    });

    // ===== Scroll Animations =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.service-card, .portfolio-card, .reveal-text').forEach((el, i) => {
        el.style.transitionDelay = (i % 4) * 0.1 + 's';
        observer.observe(el);
    });

    // ===== Counter Animation =====
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();
                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

    // ===== Testimonials =====
    const testimonials = document.querySelectorAll('.testimonial');
    const tDots = document.querySelectorAll('.t-dot');
    let currentSlide = 0;
    let autoSlide;

    function goToSlide(idx) {
        testimonials.forEach(t => t.classList.remove('active'));
        tDots.forEach(d => d.classList.remove('active'));
        testimonials[idx].classList.add('active');
        tDots[idx].classList.add('active');
        currentSlide = idx;
    }

    tDots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
            clearInterval(autoSlide);
            autoSlide = setInterval(() => goToSlide((currentSlide + 1) % testimonials.length), 6000);
        });
    });

    autoSlide = setInterval(() => goToSlide((currentSlide + 1) % testimonials.length), 6000);

    // ===== Magnetic Buttons =====
    if (window.innerWidth > 768) {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ===== Contact Form =====
    document.getElementById('contactForm').addEventListener('submit', e => {
        e.preventDefault();
        const btn = e.target.querySelector('.submit-btn');
        const orig = btn.textContent;
        btn.textContent = lang === 'ru' ? 'Отправлено!' : 'Sent!';
        btn.style.background = '#22c55e';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.style.color = '';
            e.target.reset();
        }, 2000);
    });

    // ===== Back to Top =====
    document.querySelector('.back-to-top').addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Init =====
    setLang(lang);

})();
