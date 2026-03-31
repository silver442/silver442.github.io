document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById('container-certificate');
    const btnNext = document.querySelector('.next-btn');
    const btnPrev = document.querySelector('.prev-btn');
    const wrapper = document.querySelector('.carousel-wrapper');
    
    // Evita que el usuario rompa la animación haciendo spam de clics
    let isMoving = false; 

    // Calcula dinámicamente el ancho de un certificado más sus márgenes
    function getCertWidth() {
        const cert = document.querySelector('.certificado');
        const style = window.getComputedStyle(cert);
        return cert.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    // Inicializa el carrusel iluminando el elemento central (el índice 1)
    function init() {
        const currentCerts = track.querySelectorAll('.certificado');
        currentCerts.forEach(c => c.classList.remove('activo'));
        currentCerts[1].classList.add('activo');
    }

    // Función para avanzar a la DERECHA
    function moveNext() {
        if (isMoving) return;
        isMoving = true;

        const distance = getCertWidth();
        const currentCerts = track.querySelectorAll('.certificado');

        // Preparamos las clases: el elemento central pasa a ser el lateral izquierdo, y el derecho pasa al centro
        currentCerts[1].classList.remove('activo');
        currentCerts[2].classList.add('activo');

        // Animamos el deslizamiento
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${distance}px)`;

        // Esperamos a que acabe la animación (500ms) para hacer el truco infinito
        setTimeout(() => {
            track.style.transition = 'none'; // Quitamos transición para que sea invisible
            track.appendChild(track.firstElementChild); // Movemos el primero al final
            track.style.transform = 'translateX(0)'; // Reseteamos la posición
            isMoving = false;
        }, 500);
    }

    // Función para retroceder a la IZQUIERDA
    function movePrev() {
        if (isMoving) return;
        isMoving = true;

        const distance = getCertWidth();

        // Truco inverso: Movemos el último elemento al principio ANTES de animar
        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = `translateX(-${distance}px)`; // Lo escondemos rápido a la izquierda

        // Forzamos al navegador a registrar el cambio (Reflow)
        track.offsetHeight; 

        // Ahora sí animamos hacia el centro (0)
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = 'translateX(0)';

        // Actualiza las clases: el elemento que acabamos de meter es el índice 0, el que era activo (2) pasa al centro (1)
        const currentCerts = track.querySelectorAll('.certificado');
        currentCerts[2].classList.remove('activo'); 
        currentCerts[1].classList.add('activo');    

        setTimeout(() => {
            isMoving = false;
        }, 500);
    }

    // Listeners de los botones
    btnNext.addEventListener('click', moveNext);
    btnPrev.addEventListener('click', movePrev);

    // Reproducción automática cada 3.5 segundos
    let autoPlay = setInterval(moveNext, 3500);

    // Pausar si el mouse está encima del carrusel para que puedan ver/leer el certificado
    wrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
    wrapper.addEventListener('mouseleave', () => autoPlay = setInterval(moveNext, 3500));

    // Arrancamos el estado inicial
    init();
});