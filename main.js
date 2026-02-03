(() => {
    const root = document.documentElement;
    root.classList.add('js-enabled');

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    // Mobile menu
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');

    const setMenuOpen = (open) => {
        if (!sidebar || !menuButton || !overlay) return;
        sidebar.classList.toggle('is-open', open);
        overlay.classList.toggle('is-visible', open);
        menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('menu-open', open);
    };

    if (sidebar && menuButton && overlay) {
        menuButton.addEventListener('click', () => {
            const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
            setMenuOpen(!isOpen);
        });

        overlay.addEventListener('click', () => setMenuOpen(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        });

        // Close the menu after clicking any in-page link.
        sidebar.addEventListener('click', (e) => {
            const link = e.target.closest?.('a[href^="#"]');
            if (!link) return;
            setMenuOpen(false);
        });

        // If the user resizes back to desktop, ensure the mobile menu state is reset.
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) setMenuOpen(false);
        });
    }

    // Scroll-reveal animations
    const animatedEls = Array.from(document.querySelectorAll('[data-animate]'));
    const showAll = () => animatedEls.forEach((el) => el.classList.add('is-visible'));

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.15 }
        );

        animatedEls.forEach((el) => observer.observe(el));
    } else {
        showAll();
    }

    // Active nav link
    const navLinks = Array.from(document.querySelectorAll('.sidebar__link[href^="#"]'));
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveLink(entry.target.id);
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    // Subtle hero tilt effect (desktop)
    const visual = document.querySelector('.hero__visual');
    const card = document.querySelector('.hero__image-wrapper');
    if (visual && card && !prefersReducedMotion) {
        const onMove = (e) => {
            const rect = visual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * 12;
            const rotateX = (0.5 - y) * 10;

            card.style.setProperty('--rotateX', `${rotateX.toFixed(2)}deg`);
            card.style.setProperty('--rotateY', `${rotateY.toFixed(2)}deg`);
            card.style.setProperty('--scale', '1.02');
        };

        const reset = () => {
            card.style.setProperty('--rotateX', '0deg');
            card.style.setProperty('--rotateY', '0deg');
            card.style.setProperty('--scale', '1');
        };

        visual.addEventListener('mousemove', onMove);
        visual.addEventListener('mouseleave', reset);
        visual.addEventListener('blur', reset, true);
    }
})();
