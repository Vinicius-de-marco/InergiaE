let index = 0; // Começa no primeiro slide (índice 0)

function mudarSlide(direcao) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    // Atualiza o índice
    index = index + direcao;

    // Lógica de loop (Carrossel infinito)
    if (index >= totalSlides) {
        index = 0; // Volta para o primeiro se passar do último
    } else if (index < 0) {
        index = totalSlides - 1; // Vai para o último se voltar do primeiro
    }

    // Move a "fita" de slides
    // Ex: Se index for 1, move -100%. Se for 2, move -200%.
    const offset = -index * 100; 
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

// Opcional: Auto-play (muda sozinho a cada 3 segundos)
setInterval(() => {
    mudarSlide(1);
}, 3000);