// ─── Navigation ───────────────────────────────────────────────────────────────

function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

export { initNav };