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
});