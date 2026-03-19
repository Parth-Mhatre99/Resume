/* ==========================================================
   PARTH MHATRE — Portfolio JavaScript
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ─── DOM References ──────────────────────────────────────
    const navbar      = document.getElementById('navbar');
    const navToggle   = document.getElementById('navToggle');
    const navLinks    = document.getElementById('navLinks');
    const scrollTopBtn= document.getElementById('scrollTopBtn');
    const contactForm = document.getElementById('contactForm');
    const allNavAnchors = document.querySelectorAll('.nav-links a');

    // ─── 1. Smooth scroll for anchor links ───────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu after click
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });
    });

    // ─── 2. Active nav link on scroll ────────────────────────
    const sections = document.querySelectorAll('section');

    function updateActiveNav() {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) current = sec.id;
        });
        allNavAnchors.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    // ─── 3. Navbar background on scroll ──────────────────────
    function handleScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        updateActiveNav();
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ─── 4. Mobile menu toggle ───────────────────────────────
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    // ─── 5. Scroll-to-top button ─────────────────────────────
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── 6. Scroll-reveal (Intersection Observer) ────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once revealed, stop observing
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Staggered reveal for child elements
    const childObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine stagger index among siblings
                const parent = entry.target.parentElement;
                const siblings = [...parent.querySelectorAll('.reveal-child')];
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 0.08}s`;
                entry.target.classList.add('visible');
                childObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-child').forEach(el => childObserver.observe(el));

    // ─── 7. Skill-bar fill animation ─────────────────────────
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.skill-bar-fill');
                if (fill) {
                    const width = fill.dataset.width;
                    fill.style.width = `${width}%`;
                }
                skillBarObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-bar-item').forEach(el => skillBarObserver.observe(el));

    // ─── 8. Hero counter animation ───────────────────────────
    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1500;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current;
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(c => animateCounter(c));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    // ─── 9. Contact form handler ─────────────────────────────
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            const name    = document.getElementById('formName').value.trim();
            const email   = document.getElementById('formEmail').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !message) {
                showToast('Please fill in all fields.', 'warning');
                return;
            }

            // Basic email regex check
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Please enter a valid email address.', 'warning');
                return;
            }

            // For a static site, we can show a confirmation or mail-to
            showToast(`Thanks, ${name}! Your message has been received. 🎉`, 'success');
            contactForm.reset();
        });
    }

    // ─── 10. Toast notification helper ───────────────────────
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom:   '2rem',
            left:     '50%',
            transform:'translateX(-50%) translateY(20px)',
            padding:  '.85rem 1.8rem',
            borderRadius: '10px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: '500',
            fontSize:  '.92rem',
            color:     type === 'success' ? '#065f46' : '#78350f',
            background:type === 'success' ? '#d1fae5' : '#fef3c7',
            boxShadow: '0 10px 30px rgba(0,0,0,.3)',
            zIndex:    '9999',
            opacity:   '0',
            transition:'all .4s ease',
        });

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Remove after 3.5s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

});