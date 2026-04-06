document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.querySelector('.background-wrap');
    const bgImage = document.querySelector('.bg-image');
    const fogOverlay = document.querySelector('.fog-overlay');
    const container = document.querySelector('.container');

    // Parallax & Heartbeat Effect on Mouse Move
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 20; // Increased sensitivity
        const yAxis = (window.innerHeight / 2 - e.pageY) / 20;

        // Subtle movement for the background layers with a "3D breathing" shift
        bgImage.style.transform = `scale(1.15) translate(${xAxis * 0.7}px, ${yAxis * 0.7}px)`;
        fogOverlay.style.transform = `translate(${xAxis * 1.5}px, ${yAxis * 1.5}px) rotate(${xAxis * 0.05}deg)`;
        
        // Even subtler movement for the content container for 3D depth
        container.style.transform = `translate(${xAxis * -0.3}px, ${yAxis * -0.3}px) rotateY(${xAxis * 0.1}deg)`;
    });

    // Particle Generation (Embers)
    const embersContainer = document.querySelector('.embers');
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 20;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.3;

        embersContainer.appendChild(particle);

        // Reset particle position after animation to keep it looping
        particle.addEventListener('animationiteration', () => {
            particle.style.left = `${Math.random() * 100}%`;
        });
    }
});
