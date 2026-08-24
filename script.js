/* ═══════════════════════════════
   Orion Padel Club — Scripts
   ═══════════════════════════════ */

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => {
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 120}ms`;
    revealObserver.observe(el);
});

// ── Counter Animation ──
function animateCounter(el, target, duration = 1800) {
    let start = null;
    const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            if (!isNaN(target)) animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Navbar Scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hamburger Menu ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ── Booking Modal ──
const modal     = document.getElementById('bookingModal');
const modalClose = document.getElementById('modalClose');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.btn-book-app').forEach(el => {
    el.addEventListener('click', () => { window.open('https://admirable-rugelach-6a28b3.netlify.app/app.html?club=orion-padel', '_blank'); });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Hero Particles (orange, matching brand) ──
(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 1.5 + Math.random() * 2.5;
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            --dur: ${7 + Math.random() * 9}s;
            --del: ${-Math.random() * 14}s;
        `;
        container.appendChild(p);
    }
})();

// ── Marquee pause on hover ──
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
    marqueeTrack.parentElement.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.parentElement.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
    });
}

// ── Skill Animation: Service card subtle 3D tilt ──
document.querySelectorAll('.service-card, .review-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ── Skill Animation: Stats stagger entrance ──
const heroStats = document.querySelectorAll('.hero-stat');
heroStats.forEach((stat, i) => {
    stat.style.animationDelay = `${1 + i * 0.15}s`;
    stat.style.animation = `fade-up 0.6s ease both`;
    stat.style.animationDelay = `${1 + i * 0.15}s`;
});

// ── Skill Animation: Gallery hover ripple ──
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(43,127,212,0.4);
            width: 20px; height: 20px;
            left: ${e.offsetX - 10}px;
            top: ${e.offsetY - 10}px;
            animation: ripple-expand 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        this.style.position = 'relative';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ── Add ripple keyframe dynamically ──
(function addRippleStyle() {
    const s = document.createElement('style');
    s.textContent = `@keyframes ripple-expand {
        to { transform: scale(20); opacity: 0; }
    }`;
    document.head.appendChild(s);
})();
