// ── Card Dialog, Karussell & Video ──────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    const overlay        = document.getElementById('cardOverlay');
    const closeBtn       = document.getElementById('cardClose');
    const cdImg          = document.getElementById('cdImg');
    const cdDate         = document.getElementById('cdDate');
    const cdTitle        = document.getElementById('cdTitle');
    const cdText         = document.getElementById('cdText');
    const cdExtra        = document.getElementById('cdExtra');
    const cdTags         = document.getElementById('cdTags');
    const cdAudio        = document.getElementById('cdAudio');
    const cdAudioSrc     = document.getElementById('cdAudioSrc');
    const cdCarouselWrap = document.getElementById('cdCarouselWrap');
    const cdTrack        = document.getElementById('cdTrack');
    const cdPrev         = document.getElementById('cdPrev');
    const cdNext         = document.getElementById('cdNext');
    const cdCounter      = document.getElementById('cdCounter');
    const cdDots         = document.getElementById('cdDots');
    const cdVideoWrap    = document.getElementById('cdVideoWrap');
    const cdVideoLabel   = document.getElementById('cdVideoLabel');
    const cdVideoPlayer  = document.getElementById('cdVideoPlayer');

    // ── Karussell ────────────────────────────────────────────────
    let carouselIdx = 0;
    let carouselPhotos = [];

    function buildCarousel(photos) {
        carouselPhotos = photos;
        carouselIdx = 0;
        cdTrack.innerHTML = photos.map(src =>
            `<img class="carousel__slide" src="${src}" alt="" loading="lazy">`
        ).join('');
        cdDots.innerHTML = photos.map((_, i) =>
            `<div class="carousel__dot${i===0?' active':''}" data-i="${i}"></div>`
        ).join('');
        cdDots.querySelectorAll('.carousel__dot').forEach(dot => {
            dot.addEventListener('click', () => goTo(+dot.dataset.i));
        });
        updateCarousel();
        cdCarouselWrap.style.display = '';
    }

    function goTo(i) {
        carouselIdx = (i + carouselPhotos.length) % carouselPhotos.length;
        updateCarousel();
    }

    function updateCarousel() {
        cdTrack.style.transform = `translateX(-${carouselIdx * 100}%)`;
        cdCounter.textContent = `${carouselIdx + 1} / ${carouselPhotos.length}`;
        cdDots.querySelectorAll('.carousel__dot').forEach((d, i) =>
            d.classList.toggle('active', i === carouselIdx)
        );
    }

    cdPrev.addEventListener('click', e => { e.stopPropagation(); goTo(carouselIdx - 1); });
    cdNext.addEventListener('click', e => { e.stopPropagation(); goTo(carouselIdx + 1); });

    // Swipe
    let touchStartX = 0;
    cdTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
    cdTrack.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) goTo(carouselIdx + (dx < 0 ? 1 : -1));
    });

    // ── Video ────────────────────────────────────────────────────
    function buildVideo(videoData) {
        cdVideoLabel.textContent = `🎬 ${videoData.caption || 'Video'}`;
        if (videoData.type === 'youtube') {
            cdVideoPlayer.innerHTML =
                `<iframe src="https://www.youtube-nocookie.com/embed/${videoData.id}?rel=0&modestbranding=1"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowfullscreen loading="lazy"></iframe>`;
        } else if (videoData.type === 'file') {
            cdVideoPlayer.innerHTML =
                `<video controls preload="metadata" src="${videoData.src}">
                     Dein Browser unterstützt kein HTML5 Video.
                 </video>`;
        }
        cdVideoWrap.style.display = '';
    }

    // ── Dialog öffnen ────────────────────────────────────────────
    document.querySelectorAll('.tl-card').forEach(card => {
        card.addEventListener('click', () => {
            const img   = card.dataset.img   || '';
            const date  = card.dataset.date  || '';
            const title = card.dataset.title || '';
            const text  = card.dataset.text  || '';
            const extra = card.dataset.extra || '';
            const audio = card.dataset.audio || '';
            let tags   = [];
            let photos = [];
            let video  = null;
            try { tags   = JSON.parse(card.dataset.tags   || '[]'); } catch(e) {}
            try { photos = JSON.parse(card.dataset.photos || '[]'); } catch(e) {}
            try { video  = card.dataset.video ? JSON.parse(card.dataset.video) : null; } catch(e) {}

            if (img && !photos.length) {
                cdImg.src = img;
                cdImg.classList.remove('hidden');
            } else {
                cdImg.classList.add('hidden');
            }

            cdDate.textContent  = date;
            cdTitle.textContent = title;
            cdText.textContent  = text;
            cdExtra.textContent = extra;
            cdTags.innerHTML = tags.map(t =>
                `<span class="tl-tag ${t.cls}">${t.label}</span>`
            ).join('');

            if (audio) {
                cdAudioSrc.src = audio;
                cdAudio.load();
                cdAudio.style.display = '';
            } else {
                cdAudio.style.display = 'none';
            }

            const hasFotoTag = tags.some(t => t.cls === 'tl-tag--foto');
            if (photos.length && hasFotoTag) {
                buildCarousel(photos);
            } else {
                cdCarouselWrap.style.display = 'none';
                cdTrack.innerHTML = '';
            }

            if (video) {
                buildVideo(video);
            } else {
                cdVideoWrap.style.display = 'none';
                cdVideoPlayer.innerHTML = '';
            }

            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // ── Dialog schließen ─────────────────────────────────────────
    function closeCard() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        cdAudio.pause();
        cdVideoPlayer.innerHTML = '';
        cdVideoWrap.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeCard);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeCard(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCard();
        if (e.key === 'ArrowLeft')  goTo(carouselIdx - 1);
        if (e.key === 'ArrowRight') goTo(carouselIdx + 1);
    });
});