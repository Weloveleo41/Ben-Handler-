/**
 * Info Ventures - Minimal interactions
 */

// Subtle mouse-follow glow effect
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.bg-glow');
    if (!glow) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    glow.style.left = `${30 + x * 40}%`;
    glow.style.top = `${30 + y * 40}%`;
});
