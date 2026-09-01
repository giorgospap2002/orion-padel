/* ═══════════════════════════════
   Orion Padel Club — Scripts
   ═══════════════════════════════ */

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.12 });

const isMobile = window.matchMedia('(max-width: 768px)').matches;
document.querySelectorAll('.reveal').forEach(el => {
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    // Σε κινητό η σκάλα καθυστέρησης έφτανε το ~1 δευτ. και φαινόταν σαν κόλλημα
    const step = isMobile ? 50 : 120;
    if (idx > 0) el.style.transitionDelay = `${Math.min(idx * step, 300)}ms`;
    revealObserver.observe(el);
});

// Δικλείδα: αν κάτι πάει στραβά με τον observer, εμφάνισε τα πάντα
// αντί να μείνει η σελίδα κενή.
setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.5) el.classList.add('visible');
    });
}, 1200);

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
    // Με ανοιχτό μενού το body είναι «καρφωμένο» και το scrollY μηδενίζεται —
    // χωρίς αυτόν τον έλεγχο η μπάρα άλλαζε χρώματα από μόνη της.
    if (document.body.classList.contains('menu-open')) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Κλείδωμα κύλισης (δουλεύει και σε iPhone) ──
// Το overflow:hidden στο body ΔΕΝ σταματάει την κύλιση στο iOS Safari.
// Ο μόνος αξιόπιστος τρόπος είναι να «καρφώσεις» το body και να θυμάσαι
// πού ήταν ο χρήστης.
let _lockedY = 0;
function lockScroll() {
    _lockedY = window.scrollY;
    document.body.classList.add('menu-open');
    document.body.style.position = 'fixed';
    document.body.style.top   = `-${_lockedY}px`;
    document.body.style.left   = '0';
    document.body.style.right  = '0';
}
function unlockScroll() {
    document.body.classList.remove('menu-open');
    document.body.style.position = '';
    document.body.style.top   = '';
    document.body.style.left  = '';
    document.body.style.right = '';
    window.scrollTo(0, _lockedY);
}

// ── Hamburger Menu ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    unlockScroll();
}

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    isOpen ? lockScroll() : unlockScroll();
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
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

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
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

// Το μενού κλείνει σε Escape και όταν γυρίσει η οθόνη — αλλιώς έμενε
// «κολλημένο» πάνω από τη σελίδα σε οριζόντια προβολή.
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
});
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('open')) closeMenu();
});
