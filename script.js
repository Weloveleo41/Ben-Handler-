/**
 * Info Ventures
 * Clean, modern interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initAnimatedCounters();
    initScrollAnimations();
    initContactForm();
});

/**
 * Mobile Navigation
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Nav shadow on scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.style.borderBottomColor = 'rgba(255,255,255,0.08)';
        } else {
            nav.style.borderBottomColor = 'var(--color-border)';
        }
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.nav').offsetHeight;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Animated Counters
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animate = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/**
 * Scroll Reveal Animations
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.section-header, .opp-card, .step, .venture-card, .about-quote-card, .about-highlight, .cta-card'
    );

    if (!elements.length) return;

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

/**
 * Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        const data = Object.fromEntries(new FormData(form));

        if (!data.name || !data.email || !data.interest) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification('Thanks! We\'ll be in touch soon.', 'success');
            form.reset();
        } catch {
            showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}

/**
 * Notification
 */
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `<span>${message}</span><button class="notification-close">&times;</button>`;

    Object.assign(el.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        background: type === 'success' ? '#0d9373' : '#ef4444',
        color: '#fff',
        borderRadius: '12px',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontSize: '14px'
    });

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(el);

    const close = el.querySelector('.notification-close');
    close.style.cssText = 'background:none;border:none;color:inherit;font-size:20px;cursor:pointer;padding:0;line-height:1;';
    close.addEventListener('click', () => removeNotification(el));

    setTimeout(() => removeNotification(el), 5000);
}

function removeNotification(el) {
    if (!el) return;
    el.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
}

/**
 * Hero Parallax
 */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const scrolled = window.pageYOffset;
    if (scrolled < hero.offsetHeight) {
        const content = hero.querySelector('.hero-content');
        if (content) {
            content.style.transform = `translateY(${scrolled * 0.12}px)`;
            content.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.4;
        }
    }
});

/**
 * Active Nav Highlighting
 */
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    window.addEventListener('scroll', () => {
        const pos = window.pageYOffset + 100;
        sections.forEach(section => {
            if (pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.style.color = 'var(--color-white)';
                    }
                });
            }
        });
    });
})();
