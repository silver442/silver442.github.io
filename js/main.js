document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentLang = localStorage.getItem('lang') || 'es';

    // Certificates carousel
    const track = document.getElementById('container-certificate');
    const btnNext = document.querySelector('.next-btn');
    const btnPrev = document.querySelector('.prev-btn');
    const wrapper = document.querySelector('.carousel-wrapper');

    let isMoving = false;
    let autoPlay = null;

    function getCertWidth() {
        const cert = document.querySelector('.certificado');
        const style = window.getComputedStyle(cert);
        return cert.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    function initCarousel() {
        const currentCerts = track.querySelectorAll('.certificado');
        currentCerts.forEach(c => c.classList.remove('activo'));
        currentCerts[1].classList.add('activo');
    }

    function moveNext() {
        if (isMoving) return;
        isMoving = true;

        const distance = getCertWidth();
        const currentCerts = track.querySelectorAll('.certificado');

        currentCerts[1].classList.remove('activo');
        currentCerts[2].classList.add('activo');

        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${distance}px)`;

        setTimeout(() => {
            track.style.transition = 'none';
            track.appendChild(track.firstElementChild);
            track.style.transform = 'translateX(0)';
            isMoving = false;
        }, 500);
    }

    function movePrev() {
        if (isMoving) return;
        isMoving = true;

        const distance = getCertWidth();

        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = `translateX(-${distance}px)`;

        track.offsetHeight;

        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = 'translateX(0)';

        const currentCerts = track.querySelectorAll('.certificado');
        currentCerts[2].classList.remove('activo');
        currentCerts[1].classList.add('activo');

        setTimeout(() => {
            isMoving = false;
        }, 500);
    }

    function startAutoPlay() {
        if (prefersReducedMotion || autoPlay) return;
        autoPlay = setInterval(moveNext, 3500);
    }

    function stopAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = null;
    }

    if (track && wrapper) {
        btnNext.addEventListener('click', moveNext);
        btnPrev.addEventListener('click', movePrev);

        wrapper.addEventListener('mouseenter', stopAutoPlay);
        wrapper.addEventListener('mouseleave', startAutoPlay);
        wrapper.addEventListener('focusin', stopAutoPlay);
        wrapper.addEventListener('focusout', startAutoPlay);

        initCarousel();
        startAutoPlay();
    }

    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');

    function setMenu(open) {
        hamburger.classList.toggle('active', open);
        mainNav.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    }

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            setMenu(!mainNav.classList.contains('active'));
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                setMenu(false);
                hamburger.focus();
            }
        });
    }

    // Language toggle
    function applyTexts(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang][key] !== undefined) {
                el.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (translations[lang][key] !== undefined) {
                el.placeholder = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.dataset.i18nAria;
            if (translations[lang][key] !== undefined) {
                el.setAttribute('aria-label', translations[lang][key]);
            }
        });

        const cvLink = document.getElementById('cv-download');
        if (cvLink) {
            cvLink.href = lang === 'es'
                ? 'docs/CV_Silvestre_DesarrolladorSoftware.pdf'
                : 'docs/CV_Silvestre_SoftwareEngineer.pdf';
        }

        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
    }

    // Cross-fade of the whole page with the View Transitions API; instant swap where unsupported
    function applyLanguage(lang, animate = true) {
        if (animate && document.startViewTransition && !prefersReducedMotion) {
            document.startViewTransition(() => applyTexts(lang));
        } else {
            applyTexts(lang);
        }
    }

    function updateSwitch(lang) {
        const toggle = document.getElementById('lang-toggle');
        const labelEs = document.getElementById('label-es');
        const labelEn = document.getElementById('label-en');
        if (toggle) toggle.checked = lang === 'en';
        if (labelEs) labelEs.classList.toggle('active', lang === 'es');
        if (labelEn) labelEn.classList.toggle('active', lang === 'en');
    }

    const langToggle = document.getElementById('lang-toggle');
    applyLanguage(currentLang, false);
    updateSwitch(currentLang);

    if (langToggle) {
        langToggle.addEventListener('change', () => {
            currentLang = langToggle.checked ? 'en' : 'es';
            applyLanguage(currentLang);
            updateSwitch(currentLang);
            startTypewriter(currentLang);
        });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('form-submit');
        const statusEl = document.getElementById('form-status');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = translations[currentLang].form_sending;
            statusEl.textContent = '';
            statusEl.className = 'form-status';

            const data = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value,
                _gotcha: contactForm._gotcha.value,
            };

            try {
                const response = await fetch('https://formspree.io/f/xwvynajn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    statusEl.textContent = translations[currentLang].form_success;
                    statusEl.classList.add('success');
                    contactForm.reset();
                } else {
                    statusEl.textContent = translations[currentLang].form_error;
                    statusEl.classList.add('error');
                }
            } catch {
                statusEl.textContent = translations[currentLang].form_error;
                statusEl.classList.add('error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = translations[currentLang].form_submit;
            }
        });
    }

    // Mail links: the address is assembled here so it never appears in plain text in the HTML
    document.querySelectorAll('.js-mail').forEach(link => {
        link.href = `mailto:${link.dataset.user}@${link.dataset.domain}`;
    });

    // Typewriter
    let twTimeout = null;
    let twInterval = null;

    function startTypewriter(lang) {
        const el = document.getElementById('typewriter-text');
        if (!el) return;

        if (twTimeout) clearTimeout(twTimeout);
        if (twInterval) clearInterval(twInterval);
        el.textContent = '';

        const phrase = translations[lang].hero_quote;

        if (prefersReducedMotion) {
            el.textContent = phrase;
            return;
        }

        let i = 0;

        const cursor = document.createElement('span');
        cursor.classList.add('typewriter-cursor');
        cursor.setAttribute('aria-hidden', 'true');
        cursor.textContent = '|';
        el.appendChild(cursor);

        twTimeout = setTimeout(() => {
            twTimeout = null;
            twInterval = setInterval(() => {
                if (i < phrase.length) {
                    cursor.insertAdjacentText('beforebegin', phrase[i]);
                    i++;
                } else {
                    clearInterval(twInterval);
                    twInterval = null;
                }
            }, 45);
        }, 600);
    }

    startTypewriter(currentLang);

    // Scroll reveal (items in the same group appear one after another)
    const revealItems = document.querySelectorAll('.reveal');
    document.querySelectorAll('#container-projects, .timeline, .skills-category-container').forEach(group => {
        group.querySelectorAll(':scope > .reveal').forEach((item, i) => {
            item.style.setProperty('--reveal-delay', `${Math.min(i, 4) * 90}ms`);
        });
    });
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
    }

    // Active section in the navbar
    const navLinks = document.querySelectorAll('.main-nav__item a');
    const sections = [...navLinks]
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active', isActive);
                    if (isActive) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(section => spyObserver.observe(section));
    }

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Private repo modal
    const modal = document.getElementById('custom-modal');
    let lastFocused = null;

    function getModalFocusables() {
        return modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    }

    function openModal() {
        lastFocused = document.activeElement;
        modal.classList.add('active');
        const focusables = getModalFocusables();
        focusables[focusables.length - 1].focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        if (lastFocused) lastFocused.focus();
    }

    if (modal) {
        document.querySelectorAll('[data-modal-open]').forEach(btn => {
            btn.addEventListener('click', openModal);
        });
        modal.querySelectorAll('[data-modal-close]').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeModal();
                return;
            }

            if (e.key === 'Tab') {
                const focusables = getModalFocusables();
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }
});
