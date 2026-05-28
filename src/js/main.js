import { initNav } from './nav.js';
import { initTimeline } from './timeline.js';
import { initQuiz } from './quiz.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTimeline();

});
// ── main.js – Initialisierung, Nachtmodus, Scroll & Resize ───────

// ── Nachtmodus ───────────────────────────────────────────────────
function toggleNight() {
    const body  = document.getElementById('body');
    const isNight = body.classList.toggle('night');
    const toast = document.getElementById('nightToast');
    toast.textContent = isNight ? '🌙 Nachtmodus aktiv' : '☀️ Tagmodus aktiv';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Nav-Scrolled-Klasse ──────────────────────────────────────────
window.addEventListener('scroll', () => {
    document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Scroll: Wanderer + Animationen ──────────────────────────────
window.addEventListener('scroll', () => {
    updateHiker();
    checkAnimationTriggers();
}, { passive: true });

// ── Resize: Trail neu zeichnen ───────────────────────────────────
window.addEventListener('resize', () => {
    // Reset path cache so hiker re-queries the new path
    window._pathEl  = null;
    window._pathLen = 0;
    setTimeout(() => { drawTrail(); updateHiker(); }, 80);
});

// ── Init ─────────────────────────────────────────────────────────
setTimeout(() => { drawTrail(); updateHiker(); }, 200);