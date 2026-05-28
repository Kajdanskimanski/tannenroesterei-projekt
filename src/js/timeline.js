// ═══════════════════════════════════════════════════════════════
// Tannenkaffee – timeline.js
// ═══════════════════════════════════════════════════════════════

// ── Nachtmodus ───────────────────────────────────────────────────
function toggleNight() {
    const body  = document.getElementById('body');
    const isNight = body.classList.toggle('night');
    const toast = document.getElementById('nightToast');
    toast.textContent = isNight ? '🌙 Nachtmodus aktiv' : '☀️ Tagmodus aktiv';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Burger Menü ──────────────────────────────────────────────────
function toggleMenu() {
    const links = document.querySelector('.nav__links');
    const overlay = document.getElementById('navOverlay');
    const isOpen = links.classList.toggle('open');
    overlay?.classList.toggle('open', isOpen);
}

function closeMenu() {
    document.querySelector('.nav__links').classList.remove('open');
    document.getElementById('navOverlay')?.classList.remove('open');
}

// Menü schließen beim Klick auf einen Link
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav__links a').forEach(a => {
        a.addEventListener('click', () => closeMenu());
    });
    // Menü schließen beim Klick außerhalb
    document.addEventListener('click', e => {
        const links = document.querySelector('.nav__links');
        if (!e.target.closest('.nav') && links.classList.contains('open')) {
            closeMenu();
        }
    });
});

// ── Nav Scroll ───────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ═══════════════════════════════════════════════════════════════
// Card Dialog
// ═══════════════════════════════════════════════════════════════
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

    // ── Karussell ─────────────────────────────────────────────────
    let carouselIdx    = 0;
    let carouselPhotos = [];

    function buildCarousel(photos) {
        carouselPhotos = photos;
        carouselIdx    = 0;
        cdTrack.innerHTML = photos.map(src =>
            `<img class="carousel__slide" src="${src}" alt="" loading="lazy">`
        ).join('');
        cdDots.innerHTML = photos.map((_, i) =>
            `<div class="carousel__dot${i === 0 ? ' active' : ''}" data-i="${i}"></div>`
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
        cdCounter.textContent   = `${carouselIdx + 1} / ${carouselPhotos.length}`;
        cdDots.querySelectorAll('.carousel__dot').forEach((d, i) =>
            d.classList.toggle('active', i === carouselIdx)
        );
    }

    cdPrev.addEventListener('click', e => { e.stopPropagation(); goTo(carouselIdx - 1); });
    cdNext.addEventListener('click', e => { e.stopPropagation(); goTo(carouselIdx + 1); });

    // Swipe
    let touchStartX = 0;
    cdTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    cdTrack.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) goTo(carouselIdx + (dx < 0 ? 1 : -1));
    });

    // ── Video ──────────────────────────────────────────────────────
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

    // ── Dialog öffnen ──────────────────────────────────────────────
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
            cdTags.innerHTML    = tags.map(t =>
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
                cdVideoWrap.style.display  = 'none';
                cdVideoPlayer.innerHTML    = '';
            }

            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // ── Dialog schließen ───────────────────────────────────────────
    function closeCard() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        cdAudio.pause();
        cdVideoPlayer.innerHTML   = '';
        cdVideoWrap.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeCard);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeCard(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape')     closeCard();
        if (e.key === 'ArrowLeft')  goTo(carouselIdx - 1);
        if (e.key === 'ArrowRight') goTo(carouselIdx + 1);
    });
});

// ═══════════════════════════════════════════════════════════════
// Wanderweg Trail
// ═══════════════════════════════════════════════════════════════
let _pathEl     = null;
let _pathLen    = 0;
let _hikerAngle = 0;
let _benchShown = false;

function drawTrail() {
    const svg = document.getElementById('trail-svg');
    const tl  = document.getElementById('timeline');
    if (!svg || !tl) return;

    const tlRect = tl.getBoundingClientRect();
    const cx  = tl.offsetWidth / 2;
    const tlH = tl.scrollHeight;
    const W   = tl.offsetWidth;

    const dots   = Array.from(tl.querySelectorAll('.tl-dot'));
    const points = dots.map(dot => {
        const r = dot.getBoundingClientRect();
        return { x: cx, y: r.top - tlRect.top + r.height / 2 };
    });
    if (points.length < 2) return;

    const allPts = [{ x: cx, y: 0 }, ...points, { x: cx, y: tlH }];

    function sr(i) { return Math.abs(Math.sin(i * 9301 + 42 * 49297)) % 1; }

    let d = `M ${allPts[0].x} ${allPts[0].y}`;
    for (let i = 0; i < allPts.length - 1; i++) {
        const p0   = allPts[i], p1 = allPts[i + 1];
        const segH = p1.y - p0.y;
        const maxW = Math.min(44, segH * 0.30);
        const dir  = sr(i) > 0.5 ? 1 : -1;
        const w    = maxW * (0.55 + sr(i + 100) * 0.45) * dir;
        d += ` C ${p0.x + w} ${p0.y + segH * 0.35}, ${p1.x + w * 0.35} ${p1.y - segH * 0.22}, ${p1.x} ${p1.y}`;
    }

    // ── Dekorations-Helfer ─────────────────────────────────────────
    function tree(x, y, scale = 1, dark = false) {
        const col1 = dark ? '#2d4a1e' : '#4a6741';
        const col2 = dark ? '#3a5228' : '#3d5935';
        const col3 = dark ? '#243d17' : '#2d4a1e';
        const tw = 18 * scale, th = 28 * scale, ts = 6 * scale;
        return `<g transform="translate(${x},${y})" opacity="0.55">
          <rect x="${-ts/2*0.7}" y="${th*0.55}" width="${ts*0.7}" height="${ts*0.6}" rx="1" fill="#7a5c3a" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="0,${-th} ${tw*0.55},${-th*0.3} ${-tw*0.55},${-th*0.3}" fill="${col1}" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="0,${-th*0.55} ${tw*0.65},${th*0.05} ${-tw*0.65},${th*0.05}" fill="${col2}" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="0,${-th*0.15} ${tw*0.75},${th*0.42} ${-tw*0.75},${th*0.42}" fill="${col3}" stroke="#2c1a0e" stroke-width="0.8"/>
        </g>`;
    }

    function mountain(x, y, w, h, snow = true) {
        const snowH = h * 0.28;
        return `<g opacity="0.35">
          <polygon points="${x},${y-h} ${x-w*0.5},${y} ${x+w*0.5},${y}" fill="#8a9a7a" stroke="#5a6a4a" stroke-width="1"/>
          ${snow ? `<polygon points="${x},${y-h} ${x-w*0.18},${y-h+snowH} ${x+w*0.18},${y-h+snowH}" fill="#f0ece0" stroke="none" opacity="0.85"/>` : ''}
        </g>`;
    }

    function city(x, y, scale = 1) {
        const s = scale;
        return `<g transform="translate(${x},${y})" opacity="0.5">
          <rect x="${-22*s}" y="${-18*s}" width="${14*s}" height="${18*s}" rx="1" fill="#c9b89a" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="${-22*s},${-18*s} ${-15*s},${-26*s} ${-8*s},${-18*s}" fill="#a08060" stroke="#2c1a0e" stroke-width="0.8"/>
          <rect x="${-7*s}" y="${-24*s}" width="${18*s}" height="${24*s}" rx="1" fill="#d4c5a9" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="${-7*s},${-24*s} ${2*s},${-34*s} ${11*s},${-24*s}" fill="#b09070" stroke="#2c1a0e" stroke-width="0.8"/>
          <rect x="${1*s}" y="${-13*s}" width="${5*s}" height="${8*s}" rx="0.5" fill="#8a9ab0" stroke="#2c1a0e" stroke-width="0.7"/>
          <rect x="${-18*s}" y="${-13*s}" width="${4*s}" height="${5*s}" rx="0.5" fill="#8a9ab0" stroke="#2c1a0e" stroke-width="0.7"/>
          <rect x="${12*s}" y="${-20*s}" width="${10*s}" height="${20*s}" rx="1" fill="#c0b090" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="${12*s},${-20*s} ${17*s},${-28*s} ${22*s},${-20*s}" fill="#a08060" stroke="#2c1a0e" stroke-width="0.8"/>
        </g>`;
    }

    function sign(x, y, flip = false) {
        const ox = flip ? -30 : 2;
        return `<g transform="translate(${x},${y})" opacity="0.55">
          <line x1="0" y1="0" x2="0" y2="-22" stroke="#7a5c3a" stroke-width="2" stroke-linecap="round"/>
          <rect x="${ox}" y="-22" width="28" height="10" rx="2" fill="#f5e6c8" stroke="#2c1a0e" stroke-width="1"/>
          <line x1="${ox+2}" y1="-17" x2="${ox+26}" y2="-17" stroke="#c17f3a" stroke-width="0.8" stroke-dasharray="3 3" opacity="0.6"/>
        </g>`;
    }

    function footprints(x, y, count = 3) {
        let s = '';
        for (let i = 0; i < count; i++) {
            const fy = y + i * 14;
            const fx = x + (i % 2 === 0 ? -4 : 4);
            s += `<ellipse cx="${fx}" cy="${fy}" rx="3" ry="4.5" fill="#c17f3a" opacity="0.25" transform="rotate(${i%2===0?-15:15},${fx},${fy})"/>`;
        }
        return `<g>${s}</g>`;
    }

    function lake(x, y, rx = 18, ry = 7) {
        return `<g opacity="0.35">
          <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#7ab0d4" stroke="#5090b0" stroke-width="0.8"/>
          <ellipse cx="${x-4}" cy="${y-1}" rx="${rx*0.45}" ry="${ry*0.5}" fill="#a0c8e8" opacity="0.5" stroke="none"/>
        </g>`;
    }

    function stones(x, y) {
        return `<g opacity="0.3">
          <ellipse cx="${x-6}" cy="${y}" rx="4" ry="2.5" fill="#a09080" stroke="#7a6050" stroke-width="0.5"/>
          <ellipse cx="${x+5}" cy="${y+3}" rx="3" ry="2" fill="#b0a090" stroke="#7a6050" stroke-width="0.5"/>
          <ellipse cx="${x}" cy="${y+6}" rx="2.5" ry="1.8" fill="#a09080" stroke="#7a6050" stroke-width="0.5"/>
        </g>`;
    }

    const gap    = 80;
    const edge   = W * 0.08;
    const mScale = Math.max(0.6, Math.min(1.6, W / 700));
    const tScale = Math.max(0.7, Math.min(1.4, W / 600));
    function lx(depth = 0.5) { return cx - gap - (cx - gap - edge) * depth; }
    function rx(depth = 0.5) { return cx + gap + (cx - gap - edge) * depth; }

    let decor = '';

    // Top
    decor += mountain(lx(0.9), 100, 130*mScale, 80*mScale, true);
    decor += mountain(lx(0.6), 130, 100*mScale, 65*mScale, true);
    decor += mountain(lx(0.3), 160, 80*mScale,  50*mScale, false);
    decor += mountain(rx(0.9), 110, 120*mScale, 75*mScale, true);
    decor += mountain(rx(0.6), 140, 90*mScale,  58*mScale, true);
    for (let i = 0; i < 5; i++) {
        decor += tree(lx(0.7 - i*0.1), 175 + i*8, tScale*(0.85+i*0.05), true);
        decor += tree(rx(0.7 - i*0.1), 170 + i*8, tScale*(0.9+i*0.04),  true);
    }
    decor += stones(cx - 10, 220);
    decor += stones(cx + 18, 240);

    const pointDecorators = [
        y => { // 0: Gründung
            decor += city(lx(0.75), y - 10, 1.1*tScale); decor += city(lx(0.4), y + 30, 0.75*tScale);
            decor += sign(rx(0.35), y - 5, false); decor += footprints(cx + 14, y + 35);
            decor += tree(rx(0.6), y - 15, tScale*0.85); decor += tree(rx(0.75), y + 5, tScale*0.9);
        },
        y => { // 1: Lieferung
            decor += tree(lx(0.8), y - 22, tScale*1.0); decor += tree(lx(0.6), y - 10, tScale*0.85);
            decor += tree(lx(0.4), y + 5,  tScale*1.1); decor += tree(rx(0.5), y - 18, tScale*0.9);
            decor += tree(rx(0.7), y - 5,  tScale*1.0); decor += lake(rx(0.9), y + 25, 24*mScale, 9*mScale);
            decor += stones(cx - 12, y + 20);
        },
        y => { // 2: Jonas
            decor += sign(lx(0.4), y - 8, true); decor += sign(rx(0.4), y + 15, false);
            decor += tree(rx(0.65), y + 8, tScale*0.95); decor += tree(rx(0.82), y - 5, tScale*1.1);
            decor += tree(lx(0.7),  y + 12, tScale*0.8); decor += footprints(cx - 16, y + 28);
            decor += mountain(lx(0.95), y - 20, 90*mScale, 55*mScale, false);
        },
        y => { // 3: Jubiläum
            decor += lake(lx(0.85), y + 20, 30*mScale, 11*mScale);
            decor += tree(lx(0.65), y - 8, tScale*0.9); decor += tree(lx(0.5), y + 5, tScale*1.05);
            decor += mountain(rx(0.9), y - 25, 100*mScale, 65*mScale, true);
            decor += mountain(rx(0.65), y, 70*mScale, 45*mScale, false);
            decor += tree(rx(0.45), y - 12, tScale*0.85);
        },
        y => { // 4: Äthiopien
            for (const [d, t] of [[-22,1.2],[-10,1.0],[-5,0.9],[8,1.1]]) decor += tree(lx(0.4 + (3-[22,10,5,-8].indexOf(-d))*0.13), y+d, tScale*t, true);
            decor += tree(lx(0.4),  y-22, tScale*1.2, true); decor += tree(lx(0.6), y-10, tScale*1.0, true);
            decor += tree(lx(0.78), y-5,  tScale*0.9, true); decor += tree(lx(0.92), y+8, tScale*1.1, true);
            decor += tree(rx(0.45), y-18, tScale*1.1, true); decor += tree(rx(0.62), y-4, tScale*0.95, true);
            decor += tree(rx(0.8),  y+10, tScale*0.85, true);
            decor += sign(rx(0.35), y - 12, false); decor += stones(cx + 8, y + 18);
        },
        y => { // 5: Café
            decor += city(rx(0.7), y-18, 1.2*tScale); decor += city(rx(0.35), y+10, 0.85*tScale);
            decor += city(lx(0.6), y-5, 0.75*tScale); decor += footprints(cx+12, y+32, 4);
            decor += tree(lx(0.85), y-10, tScale*0.8); decor += tree(lx(0.95), y+8, tScale*0.9);
        },
        y => { // 6: Podcast
            decor += lake(rx(0.88), y+15, 28*mScale, 10*mScale);
            decor += tree(rx(0.6),  y-8,  tScale*1.0); decor += tree(rx(0.75), y+5,  tScale*0.85);
            decor += tree(lx(0.55), y-12, tScale*1.1, true); decor += tree(lx(0.72), y+2, tScale*0.9, true);
            decor += tree(lx(0.88), y+15, tScale*1.0, true);
            decor += stones(cx-14, y+22); decor += sign(lx(0.38), y-5, true);
        },
        y => { // 7: Kooperativen
            decor += mountain(lx(0.95), y-30, 120*mScale, 80*mScale, true);
            decor += mountain(lx(0.7),  y-10, 90*mScale, 58*mScale, true);
            decor += mountain(lx(0.45), y+10, 70*mScale, 44*mScale, false);
            decor += tree(rx(0.5), y-15, tScale*1.1); decor += tree(rx(0.68), y-4, tScale*0.9);
            decor += tree(rx(0.84), y+10, tScale*1.0);
            decor += sign(lx(0.35), y+22, true); decor += footprints(cx-15, y+30);
        },
        y => { // 8: Bio
            for (let i = 0; i < 5; i++) {
                decor += tree(lx(0.4+i*0.13), y-28+i*6, tScale*(1.2-i*0.06), true);
                decor += tree(rx(0.4+i*0.13), y-24+i*6, tScale*(1.1-i*0.05), true);
            }
            decor += lake(lx(0.92), y+30, 22*mScale, 8*mScale);
            decor += footprints(cx-16, y+22, 5);
        },
        y => { // 9: Corona
            decor += stones(cx-8, y+14); decor += stones(cx+16, y+30); decor += stones(cx-20, y+42);
            decor += tree(lx(0.6), y+6,  tScale*0.75); decor += tree(lx(0.8), y+18, tScale*0.8);
            decor += tree(rx(0.6), y+8,  tScale*0.7);  decor += tree(rx(0.8), y+20, tScale*0.75);
            decor += mountain(rx(0.95), y-40, 90*mScale, 58*mScale, true);
        },
        y => { // 10: Rösterei
            decor += city(lx(0.8),  y-25, 1.3*tScale); decor += city(lx(0.48), y+5, 0.9*tScale);
            decor += mountain(rx(0.95), y-45, 110*mScale, 72*mScale, true);
            decor += mountain(rx(0.7),  y-20, 80*mScale, 50*mScale, true);
            decor += tree(rx(0.48), y-8, tScale*0.85);
            decor += sign(rx(0.35), y+18, false); decor += footprints(cx+10, y+28, 4);
        },
        y => { // 11: Heute
            decor += city(rx(0.72), y-30, 1.4*tScale); decor += city(rx(0.4), y-5, 1.0*tScale);
            decor += city(lx(0.5),  y+10, 0.8*tScale);
            decor += tree(lx(0.7),  y-25, tScale*1.1, true); decor += tree(lx(0.85), y-12, tScale*1.0, true);
            decor += tree(lx(0.95), y+5,  tScale*0.9, true);
            decor += lake(lx(0.92), y+35, 26*mScale, 10*mScale);
            decor += footprints(cx+10, y+22, 5);
        },
    ];

    points.forEach((pt, i) => {
        if (pointDecorators[i]) pointDecorators[i](pt.y);
    });

    // Filler
    for (let fy = 300; fy < tlH - 100; fy += 175 + sr(fy) * 80) {
        const nearDot = points.some(p => Math.abs(p.y - fy) < 100);
        if (!nearDot) {
            decor += tree(lx(0.45 + sr(fy*3)*0.45),  fy,              tScale*(0.75+sr(fy*13)*0.35), sr(fy*11)>0.5);
            decor += tree(rx(0.45 + sr(fy*7)*0.45),  fy+sr(fy*17)*20, tScale*(0.7+sr(fy*19)*0.4),  sr(fy*11)>0.5);
            if (sr(fy*23) > 0.78) decor += stones(cx + (sr(fy)*30-15), fy+25);
            if (sr(fy*29) > 0.88) decor += sign(sr(fy*31)>0.5 ? lx(0.35) : rx(0.35), fy-8, sr(fy*31)>0.5);
        }
    }

    svg.setAttribute('viewBox', `0 0 ${W} ${tlH}`);
    svg.setAttribute('height', tlH);
    svg.innerHTML = decor + `
      <path d="${d}" fill="none" stroke="#c17f3a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.15"/>
      <path d="${d}" fill="none" stroke="#8a6430" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="11 9" opacity="0.55"/>
      <path d="${d}" fill="none" stroke="#f5e6c8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 16" stroke-dashoffset="8" opacity="0.65"/>
    `;

    window._trailTlEl = tl;
    _pathEl  = null;
    _pathLen = 0;
    updateHiker();
}

// ── Wanderer ─────────────────────────────────────────────────────
function getPointAtProgress(progress) {
    if (!_pathEl) {
        _pathEl = document.querySelector('#trail-svg path:nth-of-type(2)');
        if (!_pathEl) return null;
        _pathLen = _pathEl.getTotalLength();
    }
    const len = Math.max(0, Math.min(_pathLen, progress * _pathLen));
    return _pathEl.getPointAtLength(len);
}

function updateHiker() {
    const tl    = window._trailTlEl;
    const hiker = document.getElementById('hiker');
    const dog   = document.getElementById('hiker-dog');
    if (!tl || !hiker) return;

    const scrolled = window.scrollY + window.innerHeight * 0.75;
    const progress = Math.max(0, Math.min(1, (scrolled - tl.offsetTop) / tl.scrollHeight));
    const atBottom = progress >= 0.97;

    const bench = document.getElementById('bench-svg');
    if (atBottom && !_benchShown) {
        _benchShown = true;
        hiker.style.transition = 'opacity 0.4s'; hiker.style.opacity = '0';
        if (dog) { dog.style.transition = 'opacity 0.4s'; dog.style.opacity = '0'; }
        if (bench) {
            bench.style.transition = 'opacity 0.6s'; bench.style.opacity = '0.9';
            setTimeout(() => {
                const bs = document.getElementById('bench-steam');
                if (bs) {
                    bs.style.transition = 'opacity 0.5s'; bs.style.opacity = '0.7';
                    let t = 0;
                    (function driftSteam() {
                        t += 0.04;
                        bs.setAttribute('transform', `translate(${Math.sin(t)*2},${Math.sin(t*0.7)*2})`);
                        requestAnimationFrame(driftSteam);
                    })();
                }
            }, 800);
        }
    } else if (!atBottom && _benchShown) {
        _benchShown = false;
        hiker.style.transition = 'opacity 0.3s'; hiker.style.opacity = '1';
        if (dog) { dog.style.transition = 'opacity 0.3s'; dog.style.opacity = '1'; }
        if (bench) { bench.style.transition = 'opacity 0.3s'; bench.style.opacity = '0'; }
    }

    if (atBottom) return;

    const pt  = getPointAtProgress(progress);
    if (!pt) return;
    const pt2   = getPointAtProgress(Math.min(1, progress + 0.008));
    const dx    = pt2 ? pt2.x - pt.x : 0;
    const dy    = pt2 ? pt2.y - pt.y : 1;
    const angle = Math.atan2(dx, -dy) * 180 / Math.PI;
    _hikerAngle += (angle - _hikerAngle) * 0.15;

    const step  = Math.floor(progress * 120) % 2;
    const legEl = document.getElementById('hiker-legs');
    if (legEl) {
        legEl.innerHTML = step === 0
            ? `<line x1="-2" y1="0" x2="-6" y2="11" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>
               <line x1="2"  y1="0" x2="4"  y2="9"  stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`
            : `<line x1="-2" y1="0" x2="-4" y2="9"  stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>
               <line x1="2"  y1="0" x2="6"  y2="11" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`;
    }

    hiker.setAttribute('transform',
        `translate(${pt.x}, ${pt.y}) scale(${dx < -1 ? -1 : 1}, 1) rotate(${_hikerAngle * 0.4})`
    );
}

// ═══════════════════════════════════════════════════════════════
// Scroll-gesteuerte Animationen
// ═══════════════════════════════════════════════════════════════
let _seedPlayed    = false;
let _bikePlayed    = false, _bikeFrame  = null;
let _jonasPlayed   = false;
let _cakePlayed    = false;
let _planePlayed   = false, _planeFrame = null;
let _cafePlayed    = false;
let _podcastPlayed = false;
let _flagsPlayed   = false;
let _bioPlayed     = false;
let _virusPlayed   = false, _virusFrames = [];
let _solarPlayed   = false;
let _heutePlayed   = false;

function getDotPageY(dot) {
    const tl = document.getElementById('timeline');
    let y = 0, el = dot;
    while (el && el !== tl) { y += el.offsetTop; el = el.offsetParent; }
    return y;
}

// ── Samen-zu-Baum ─────────────────────────────────────────────
function triggerSeedAnim() {
    const svg = document.getElementById('seed-svg');
    const dot = document.querySelector('[data-event="gruendung"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 120) + 'px';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    document.getElementById('st-trunk').style.transition = 'none';
    document.getElementById('st-trunk').style.transform  = 'scaleY(0)';
    document.getElementById('st-branches').style.transition = 'none';
    document.getElementById('st-branches').style.opacity    = '0';
    ['st-c3','st-c2','st-c2b','st-c1'].forEach(id => document.getElementById(id)?.setAttribute('r','0'));
    document.getElementById('st-seed').style.opacity = '1';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.4s'; svg.style.opacity = '0.7';
        setTimeout(() => { document.getElementById('st-seed').style.opacity = '0'; }, 350);
        setTimeout(() => {
            document.getElementById('st-trunk').style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
            document.getElementById('st-trunk').style.transform  = 'scaleY(1)';
        }, 700);
        setTimeout(() => { document.getElementById('st-branches').style.transition = 'opacity 0.4s'; document.getElementById('st-branches').style.opacity = '1'; }, 1250);
        setTimeout(() => { document.getElementById('st-c3')?.setAttribute('r','18'); }, 1450);
        setTimeout(() => { document.getElementById('st-c2')?.setAttribute('r','14'); }, 1600);
        setTimeout(() => { document.getElementById('st-c2b')?.setAttribute('r','13'); }, 1700);
        setTimeout(() => { document.getElementById('st-c1')?.setAttribute('r','20'); }, 1850);
    });
}

// ── Lastenrad ─────────────────────────────────────────────────
function triggerBikeAnim() {
    const svg   = document.getElementById('bike-svg');
    const dot   = document.querySelector('[data-event="lieferung"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 80) + 'px';
    const rider = document.getElementById('bike-rider');
    rider.style.transition = 'none'; rider.setAttribute('transform','translate(38,0)');
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.4s'; svg.style.opacity = '0.75';
        let startTime = null;
        setTimeout(() => {
            _bikeFrame = requestAnimationFrame(function animateBike(ts) {
                if (!startTime) startTime = ts;
                const t    = Math.min((ts - startTime) / 1800, 1);
                const ease = t * t;
                rider.setAttribute('transform', `translate(${38 + (150-38)*ease},0)`);
                const legEl = document.getElementById('bike-legs');
                if (legEl) {
                    legEl.innerHTML = Math.floor(t*30)%2 === 0
                        ? `<line x1="34" y1="48" x2="28" y2="54" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="48" x2="40" y2="54" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>`
                        : `<line x1="34" y1="48" x2="30" y2="57" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="48" x2="38" y2="53" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>`;
                }
                if (t < 1) { _bikeFrame = requestAnimationFrame(animateBike); }
                else { rider.style.transition = 'opacity 0.3s'; rider.style.opacity = '0'; }
            });
        }, 600);
    });
}

// ── Jonas ─────────────────────────────────────────────────────
function triggerJonasAnim() {
    const svg    = document.getElementById('jonas-svg');
    const dot    = document.querySelector('[data-event="jonas"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 100) + 'px';
    const person = document.getElementById('jonas-person');
    const shadow = document.getElementById('jonas-shadow');
    const stars  = document.getElementById('jonas-stars');
    person.setAttribute('transform','translate(-110, 0)');
    stars.style.opacity = '0';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.4s'; svg.style.opacity = '0.8';
        let startTime = null;
        requestAnimationFrame(function walkIn(ts) {
            if (!startTime) startTime = ts;
            const t    = Math.min((ts - startTime) / 1100, 1);
            const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
            person.setAttribute('transform', `translate(${-110+110*ease}, 0)`);
            shadow.setAttribute('cx', 50 + (-110+110*ease));
            const legs = document.getElementById('jonas-legs');
            if (legs) {
                legs.innerHTML = Math.floor(t*18)%2 === 0
                    ? `<line x1="46" y1="78" x2="40" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="54" y1="78" x2="58" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`
                    : `<line x1="46" y1="78" x2="48" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="54" y1="78" x2="52" y2="96" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`;
            }
            if (t < 1) { requestAnimationFrame(walkIn); } else { doJumps(); }
        });
        function doJumps() {
            const arms = document.getElementById('jonas-arms');
            const legs = document.getElementById('jonas-legs');
            let jump = 0;
            function oneJump() {
                if (jump >= 3) return;
                person.style.transition = 'transform 0.18s'; person.setAttribute('transform','translate(0, -18)');
                shadow.style.transition = 'all 0.18s'; shadow.setAttribute('rx','6');
                if (arms) arms.innerHTML = `<line x1="40" y1="65" x2="30" y2="52" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/><line x1="58" y1="65" x2="68" y2="52" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>`;
                if (legs) legs.innerHTML = `<line x1="46" y1="78" x2="40" y2="88" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="54" y1="78" x2="60" y2="88" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`;
                if (jump === 0) { stars.style.opacity = '1'; setTimeout(() => { stars.style.opacity = '0'; }, 400); }
                setTimeout(() => {
                    person.setAttribute('transform','translate(0, 0)'); shadow.setAttribute('rx','11');
                    if (arms) arms.innerHTML = `<line x1="40" y1="65" x2="33" y2="74" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/><line x1="58" y1="65" x2="65" y2="74" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>`;
                    if (legs) legs.innerHTML = `<line x1="46" y1="78" x2="42" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="54" y1="78" x2="58" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`;
                    jump++; setTimeout(oneJump, 180);
                }, 220);
            }
            oneJump();
        }
    });
}

// ── Geburtstagskuchen ─────────────────────────────────────────
function triggerCakeAnim() {
    const svg   = document.getElementById('cake-svg');
    const dot   = document.querySelector('[data-event="jubilaeum"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 110) + 'px';
    const flame = document.getElementById('cake-flame');
    const smoke = document.getElementById('cake-smoke');
    const glow  = document.getElementById('cake-glow');
    flame.style.opacity = '1'; smoke.style.opacity = '0'; smoke.style.transition = 'none';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s'; svg.style.opacity = '0.85';
        let flickerRunning = true, flickerFrame;
        function flicker() {
            if (!flickerRunning) return;
            const s = 0.85 + Math.random()*0.3;
            glow.setAttribute('rx', 7*s); glow.setAttribute('ry', 9*s);
            flame.setAttribute('transform', `translate(${(Math.random()-0.5)*3}, 0) scale(1, ${s})`);
            flickerFrame = setTimeout(flicker, 80 + Math.random()*60);
        }
        flicker();
        setTimeout(() => {
            flickerRunning = false; clearTimeout(flickerFrame);
            flame.style.transition = 'opacity 0.3s, transform 0.3s';
            flame.style.opacity = '0'; flame.style.transform = 'scaleY(0) translateY(8px)';
            setTimeout(() => {
                smoke.style.transition = 'opacity 0.4s'; smoke.style.opacity = '1';
                setTimeout(() => { smoke.style.transition = 'opacity 1.2s, transform 1.2s'; smoke.style.opacity = '0'; smoke.style.transform = 'translateY(-18px)'; }, 800);
            }, 200);
        }, 2000);
    });
}

// ── Flugzeug ──────────────────────────────────────────────────
function triggerPlaneAnim() {
    const svg   = document.getElementById('plane-svg');
    const dot   = document.querySelector('[data-event="aethiopien"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 80) + 'px';
    const body  = document.getElementById('plane-body');
    const trail = document.getElementById('plane-trail');
    body.setAttribute('transform','translate(20, 50)'); trail.style.opacity = '0'; trail.style.transition = 'none';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s'; svg.style.opacity = '0.85';
        let startTime = null;
        setTimeout(() => {
            _planeFrame = requestAnimationFrame(function fly(ts) {
                if (!startTime) startTime = ts;
                const t = Math.min((ts - startTime) / 2400, 1);
                const ease = t*t;
                body.setAttribute('transform', `translate(${50+ease*280}, ${20-ease*30}) rotate(${-ease*8}, 58, 18)`);
                if (t > 0.12) { trail.style.transition = 'opacity 0.4s'; trail.style.opacity = '1'; }
                if (t < 1) { _planeFrame = requestAnimationFrame(fly); }
                else { svg.style.transition = 'opacity 0.8s'; svg.style.opacity = '0'; }
            });
        }, 500);
    });
}

// ── Café-Schild ───────────────────────────────────────────────
function triggerCafeAnim() {
    const svg  = document.getElementById('cafe-svg');
    const dot  = document.querySelector('[data-event="cafe"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 110) + 'px';
    const signBg = document.getElementById('cafe-sign-bg');
    const closed = document.getElementById('cafe-closed');
    const open   = document.getElementById('cafe-open');
    const sign   = document.getElementById('cafe-sign');
    signBg.setAttribute('fill','#f8a285'); closed.style.opacity = '1'; open.style.opacity = '0';
    sign.style.transition = 'none'; sign.style.transform = 'rotate(0deg)';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s'; svg.style.opacity = '0.9';
        setTimeout(() => {
            sign.style.transition = 'transform 0.5s ease-in-out'; sign.style.transform = 'rotate(-8deg)';
            setTimeout(() => { sign.style.transform = 'rotate(5deg)'; }, 500);
            setTimeout(() => { sign.style.transform = 'rotate(-3deg)'; }, 1000);
            setTimeout(() => { sign.style.transform = 'rotate(0deg)'; }, 1500);
        }, 300);
        setTimeout(() => {
            sign.style.transition = 'transform 0.25s ease-in'; sign.style.transform = 'scaleX(0)';
            setTimeout(() => {
                signBg.setAttribute('fill','#4a6741'); closed.style.opacity = '0'; open.style.opacity = '1';
                sign.style.transition = 'transform 0.25s ease-out'; sign.style.transform = 'scaleX(1)';
                setTimeout(() => {
                    sign.style.transition = 'transform 0.4s ease-in-out'; sign.style.transform = 'rotate(6deg)';
                    setTimeout(() => { sign.style.transform = 'rotate(-4deg)'; }, 400);
                    setTimeout(() => { sign.style.transform = 'rotate(0deg)'; }, 800);
                }, 300);
            }, 260);
        }, 2000);
    });
}

// ── Podcast ───────────────────────────────────────────────────
function triggerPodcastAnim() {
    const svg  = document.getElementById('podcast-svg');
    const dot  = document.querySelector('[data-event="podcast"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 115) + 'px';
    const waves = document.getElementById('pod-waves');
    const light = document.getElementById('pod-light');
    const bean  = document.getElementById('pod-bean');
    waves.style.opacity = '0'; light.setAttribute('fill','#d85a30');
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s'; svg.style.opacity = '0.9';
        setTimeout(() => {
            let bobT = 0;
            (function bob() { bobT += 0.08; bean.setAttribute('transform', `translateY(${Math.sin(bobT)*2.5})`); requestAnimationFrame(bob); })();
            let waveOn = true;
            const waveInterval = setInterval(() => { waveOn = !waveOn; waves.style.transition = 'opacity 0.15s'; waves.style.opacity = waveOn ? '1' : '0.2'; }, 350);
            let lightOn = true;
            const lightInterval = setInterval(() => { lightOn = !lightOn; light.setAttribute('fill', lightOn ? '#d85a30' : '#f5c518'); }, 600);
            svg._cleanup = () => { clearInterval(waveInterval); clearInterval(lightInterval); };
        }, 400);
    });
}

// ── Fahnen ────────────────────────────────────────────────────
function triggerFlagsAnim() {
    const svg = document.getElementById('flags-svg');
    const dot = document.querySelector('[data-event="kooperativen"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 110) + 'px';
    ['flag1','flag2','flag3'].forEach(id => { const f = document.getElementById(id); f.style.transition = 'none'; f.style.transform = 'scaleY(0)'; });
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s'; svg.style.opacity = '0.88';
        [['flag1',400],['flag2',750],['flag3',1100]].forEach(([id,delay]) => {
            setTimeout(() => { const f = document.getElementById(id); f.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)'; f.style.transform = 'scaleY(1)'; }, delay);
        });
        setTimeout(() => {
            ['flag1','flag2','flag3'].forEach((id, i) => {
                let t = 0;
                const f = document.getElementById(id);
                (function wave() { t += 0.06; f.style.transform = `scaleY(1) skewY(${Math.sin(t+i*0.8)*2.5}deg)`; requestAnimationFrame(wave); })();
            });
        }, 1800);
    });
}

// ── Bio-Stempel ───────────────────────────────────────────────
function triggerBioAnim() {
    const svg   = document.getElementById('stamp-svg');
    const dot   = document.querySelector('[data-event="bio"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 100) + 'px';
    const group = document.getElementById('stamp-group');
    const ink   = document.getElementById('stamp-ink');
    group.style.transition = 'none'; group.style.transform = 'scale(0) rotate(-12deg) translateY(-40px)';
    ink.style.opacity = '0'; svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.3s'; svg.style.opacity = '1';
        setTimeout(() => {
            group.style.transition = 'transform 0.18s cubic-bezier(0.4,0,1,1)';
            group.style.transform  = 'scale(1.12) rotate(-12deg) translateY(0)';
            setTimeout(() => {
                ink.style.opacity = '0.18'; setTimeout(() => { ink.style.opacity = '0'; }, 80);
                group.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
                group.style.transform  = 'scale(1) rotate(0deg) translateY(0)';
            }, 180);
        }, 300);
    });
}

// ── Corona-Viren ──────────────────────────────────────────────
function triggerVirusAnim() {
    const svg = document.getElementById('virus-svg');
    const dot = document.querySelector('[data-event="corona"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 140) + 'px';
    ['v1','v2','v3'].forEach(id => { const v = document.getElementById(id); v.style.transition = 'none'; v.style.opacity = '0'; v.setAttribute('transform',''); });
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s'; svg.style.opacity = '0.88';
        const dirs = [{ax:0.025,ay:0.018},{ax:-0.02,ay:0.022},{ax:0.018,ay:-0.02}];
        ['v1','v2','v3'].forEach((id, i) => {
            setTimeout(() => {
                const v = document.getElementById(id); v.style.opacity = '1';
                let t = i * 2;
                (function float() {
                    t += 0.03;
                    v.setAttribute('transform', `translate(${Math.sin(t*dirs[i].ax*60)*6},${Math.sin(t*dirs[i].ay*60+1)*5}) rotate(${Math.sin(t*0.4)*8})`);
                    const f = requestAnimationFrame(float);
                    _virusFrames.push(f);
                })();
            }, 300 + i*220);
        });
    });
}

// ── Solarpanels ───────────────────────────────────────────────
function triggerSolarAnim() {
    const svg  = document.getElementById('solar-svg');
    const dot  = document.querySelector('[data-event="roesterei"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 100) + 'px';
    const pl   = document.getElementById('panel-left');
    const pr   = document.getElementById('panel-right');
    const sun  = document.getElementById('solar-sun');
    const bolt = document.getElementById('solar-bolt');
    pl.style.transition = 'none'; pl.style.transform = 'rotateX(90deg)';
    pr.style.transition = 'none'; pr.style.transform = 'rotateX(90deg)';
    sun.style.opacity = '0'; bolt.style.opacity = '0';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.4s'; svg.style.opacity = '0.9';
        setTimeout(() => { pl.style.transition = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1)'; pl.style.transform = 'rotateX(0deg)'; }, 400);
        setTimeout(() => { pr.style.transition = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1)'; pr.style.transform = 'rotateX(0deg)'; }, 680);
        setTimeout(() => { sun.style.opacity = '1'; }, 1200);
        setTimeout(() => {
            bolt.style.opacity = '1';
            let on = true;
            setInterval(() => { on = !on; bolt.style.opacity = on ? '1' : '0.2'; }, 500);
        }, 1600);
    });
}

// ── Kaffeetasse ───────────────────────────────────────────────
function triggerCupAnim() {
    const svg  = document.getElementById('cup-svg');
    const dot  = document.querySelector('[data-event="heute"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotPageY(dot) + dot.offsetHeight/2 - 120) + 'px';
    const heart  = document.getElementById('cup-heart');
    const steam1 = document.getElementById('steam1');
    const steam2 = document.getElementById('steam2');
    const steam3 = document.getElementById('steam3');
    [heart, steam1, steam2, steam3].forEach(el => { el.style.transition = 'none'; el.style.opacity = '0'; });
    svg.style.transform = 'translateY(30px)'; svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
        svg.style.opacity = '0.95'; svg.style.transform = 'translateY(0)';
        setTimeout(() => { heart.style.transition = 'opacity 0.6s'; heart.style.opacity = '1'; }, 700);
        setTimeout(() => {
            steam1.style.transition = 'opacity 0.5s';
            steam2.style.transition = 'opacity 0.5s 0.15s';
            steam3.style.transition = 'opacity 0.5s 0.3s';
            steam1.style.opacity = steam2.style.opacity = steam3.style.opacity = '0.7';
            let st = 0;
            (function steamAnim() {
                st += 0.025;
                [steam1, steam2, steam3].forEach((s, i) => {
                    s.setAttribute('transform', `translate(${Math.cos(st*0.7+i)*2},${Math.sin(st+i*1.2)*3})`);
                });
                requestAnimationFrame(steamAnim);
            })();
        }, 900);
    });
}

// ── Scroll-Handler ────────────────────────────────────────────
window.addEventListener('scroll', () => {
    updateHiker();
    const scrollMid = window.scrollY + window.innerHeight * 0.45;

    const checks = [
        { event: 'gruendung',   played: () => _seedPlayed,    setPlayed: v => _seedPlayed = v,
            trigger: triggerSeedAnim,  svgId: 'seed-svg' },
        { event: 'lieferung',   played: () => _bikePlayed,    setPlayed: v => _bikePlayed = v,
            trigger: triggerBikeAnim,  svgId: 'bike-svg',
            reset: () => { if (_bikeFrame) cancelAnimationFrame(_bikeFrame); const r = document.getElementById('bike-rider'); if (r) { r.style.opacity='1'; r.setAttribute('transform','translate(38,0)'); } }},
        { event: 'jonas',       played: () => _jonasPlayed,   setPlayed: v => _jonasPlayed = v,
            trigger: triggerJonasAnim, svgId: 'jonas-svg' },
        { event: 'jubilaeum',   played: () => _cakePlayed,    setPlayed: v => _cakePlayed = v,
            trigger: triggerCakeAnim,  svgId: 'cake-svg',
            reset: () => { const fl=document.getElementById('cake-flame'); const sm=document.getElementById('cake-smoke'); if(fl){fl.style.transition='none';fl.style.opacity='1';fl.style.transform='';} if(sm){sm.style.transition='none';sm.style.opacity='0';sm.style.transform='';} }},
        { event: 'aethiopien',  played: () => _planePlayed,   setPlayed: v => _planePlayed = v,
            trigger: triggerPlaneAnim, svgId: 'plane-svg',
            reset: () => { if (_planeFrame) cancelAnimationFrame(_planeFrame); }},
        { event: 'cafe',        played: () => _cafePlayed,    setPlayed: v => _cafePlayed = v,
            trigger: triggerCafeAnim,  svgId: 'cafe-svg' },
        { event: 'podcast',     played: () => _podcastPlayed, setPlayed: v => _podcastPlayed = v,
            trigger: triggerPodcastAnim, svgId: 'podcast-svg',
            reset: () => { const pv=document.getElementById('podcast-svg'); if(pv?._cleanup) pv._cleanup(); }},
        { event: 'kooperativen',played: () => _flagsPlayed,   setPlayed: v => _flagsPlayed = v,
            trigger: triggerFlagsAnim, svgId: 'flags-svg' },
        { event: 'bio',         played: () => _bioPlayed,     setPlayed: v => _bioPlayed = v,
            trigger: triggerBioAnim,   svgId: 'stamp-svg' },
        { event: 'corona',      played: () => _virusPlayed,   setPlayed: v => _virusPlayed = v,
            trigger: triggerVirusAnim, svgId: 'virus-svg',
            reset: () => { _virusFrames.forEach(f => cancelAnimationFrame(f)); _virusFrames = []; }},
        { event: 'roesterei',   played: () => _solarPlayed,   setPlayed: v => _solarPlayed = v,
            trigger: triggerSolarAnim, svgId: 'solar-svg' },
        { event: 'heute',       played: () => _heutePlayed,   setPlayed: v => _heutePlayed = v,
            trigger: triggerCupAnim,   svgId: 'cup-svg' },
    ];

    checks.forEach(({ event, played, setPlayed, trigger, svgId, reset }) => {
        const dot = document.querySelector(`[data-event="${event}"]`);
        if (!dot) return;
        const tl     = document.getElementById('timeline');
        const pageY  = getDotPageY(dot) + tl.offsetTop;
        const passed = scrollMid >= pageY;
        if (passed && !played()) { setPlayed(true); trigger(); }
        if (!passed && played()) {
            setPlayed(false);
            if (reset) reset();
            const sv = document.getElementById(svgId);
            if (sv) { sv.style.transition = 'opacity 0.3s'; sv.style.opacity = '0'; }
        }
    });

}, { passive: true });

// ═══════════════════════════════════════════════════════════════
// Init
// ═══════════════════════════════════════════════════════════════
setTimeout(() => { drawTrail(); updateHiker(); }, 200);
window.addEventListener('resize', () => {
    _pathEl = null; _pathLen = 0;
    setTimeout(() => { drawTrail(); updateHiker(); }, 80);
}, { passive: true });