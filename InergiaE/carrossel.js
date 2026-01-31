 // Variáveis do carrossel
        let currentPosition = 0;
        const track = document.getElementById('carouselTrack');
        const cards = document.querySelectorAll('.product-card');
        const dotsContainer = document.getElementById('carouselDots');
        const cardWidth = 360; // Largura do card + espaço

        // Criar os pontos (dots) do carrossel
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.onclick = () => goToSlide(index);
            dotsContainer.appendChild(dot);
        });

        // Atualizar pontos ativos
        function updateDots() {
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPosition);
            });
        }

        // Mover carrossel (chamado pelos botões ‹ e ›)
        function moveCarousel(direction) {
            const maxPosition = cards.length - Math.floor(window.innerWidth / cardWidth);
            currentPosition += direction;
            
            if (currentPosition < 0) currentPosition = 0;
            if (currentPosition > maxPosition) currentPosition = maxPosition;
            
            track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
            updateDots();
        }

        // Ir para um slide específico (chamado pelos dots)
        function goToSlide(index) {
            currentPosition = index;
            track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
            updateDots();
        }

        // Auto-play: muda automaticamente a cada 5 segundos
        setInterval(() => {
            const maxPosition = cards.length - Math.floor(window.innerWidth / cardWidth);
            currentPosition++;
            if (currentPosition > maxPosition) currentPosition = 0;
            track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
            updateDots();
        }, 6000);