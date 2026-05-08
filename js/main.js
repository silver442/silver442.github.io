document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById('container-certificate');
    const btnNext = document.querySelector('.next-btn');
    const btnPrev = document.querySelector('.prev-btn');
    const wrapper = document.querySelector('.carousel-wrapper');
    
    let isMoving = false; 

    function getCertWidth() {
        const cert = document.querySelector('.certificado');
        const style = window.getComputedStyle(cert);
        return cert.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    function init() {
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

    btnNext.addEventListener('click', moveNext);
    btnPrev.addEventListener('click', movePrev);

    let autoPlay = setInterval(moveNext, 3500);

    wrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
    wrapper.addEventListener('mouseleave', () => autoPlay = setInterval(moveNext, 3500));

    init();

    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
            });
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

        const cvLink = document.getElementById('cv-download');
        if (cvLink) {
            cvLink.href = lang === 'es'
                ? 'docs/CV_DesarrolladorSoftware.pdf'
                : 'docs/CV_SoftwareEngineer.pdf';
        }

        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
    }

    function applyLanguage(lang, animate = true) {
        const elements = document.querySelectorAll('[data-i18n]');

        if (animate) {
            elements.forEach(el => el.style.opacity = '0');
            setTimeout(() => {
                applyTexts(lang);
                elements.forEach(el => el.style.opacity = '1');
            }, 180);
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
    let currentLang = localStorage.getItem('lang') || 'es';
    applyLanguage(currentLang, false);
    updateSwitch(currentLang);

    if (langToggle) {
        langToggle.addEventListener('change', () => {
            currentLang = langToggle.checked ? 'en' : 'es';
            applyLanguage(currentLang);
            updateSwitch(currentLang);
        });
    }

    // Typewriter
    function startTypewriter() {
        const el = document.getElementById('typewriter-text');
        if (!el) return;

        const phrase = '“Si el código no me enseña algo nuevo, algo está mal.”';
        let i = 0;

        const cursor = document.createElement('span');
        cursor.classList.add('typewriter-cursor');
        cursor.textContent = '|';
        el.appendChild(cursor);

        setTimeout(() => {
            const interval = setInterval(() => {
                if (i < phrase.length) {
                    cursor.insertAdjacentText('beforebegin', phrase[i]);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 45);
        }, 600);
    }

    startTypewriter();
});