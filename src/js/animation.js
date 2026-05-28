// ── animations.js ────────────────────────────────────────────────

// ── Trail & Wanderer ─────────────────────────────────────────────
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

    const startY = points.length > 0 ? Math.max(0, points[0].y - 60) : 0;
    const allPts = [{ x: cx, y: startY }, ...points, { x: cx, y: tlH }];

    function sr(i) { return Math.abs(Math.sin(i * 9301 + 42 * 49297)) % 1; }

    let d = `M ${allPts[0].x} ${allPts[0].y}`;
    for (let i = 0; i < allPts.length - 1; i++) {
        const p0 = allPts[i], p1 = allPts[i+1];
        const segH = p1.y - p0.y;
        const maxW = Math.min(44, segH * 0.30);
        const dir  = sr(i) > 0.5 ? 1 : -1;
        const w    = maxW * (0.55 + sr(i+100)*0.45) * dir;
        const cp1x = p0.x + w,      cp1y = p0.y + segH*0.35;
        const cp2x = p1.x + w*0.35, cp2y = p1.y - segH*0.22;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    // SVG helpers
    function tree(x, y, scale=1, dark=false) {
        const col1 = dark ? '#2d4a1e' : '#4a6741';
        const col2 = dark ? '#3a5228' : '#3d5935';
        const col3 = dark ? '#243d17' : '#2d4a1e';
        const tw = 18*scale, th = 28*scale, ts = 6*scale;
        return `<g transform="translate(${x},${y})" opacity="0.55">
          <rect x="${-ts/2*0.7}" y="${th*0.55}" width="${ts*0.7}" height="${ts*0.6}" rx="1" fill="#7a5c3a" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="0,${-th} ${tw*0.55},${-th*0.3} ${-tw*0.55},${-th*0.3}" fill="${col1}" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="0,${-th*0.55} ${tw*0.65},${th*0.05} ${-tw*0.65},${th*0.05}" fill="${col2}" stroke="#2c1a0e" stroke-width="0.8"/>
          <polygon points="0,${-th*0.15} ${tw*0.75},${th*0.42} ${-tw*0.75},${th*0.42}" fill="${col3}" stroke="#2c1a0e" stroke-width="0.8"/>
        </g>`;
    }

    function mountain(x, y, w, h, snow=true) {
        const snowH = h * 0.28;
        return `<g opacity="0.35">
          <polygon points="${x},${y-h} ${x-w*0.5},${y} ${x+w*0.5},${y}" fill="#8a9a7a" stroke="#5a6a4a" stroke-width="1"/>
          <polygon points="${x-w*0.22},${y-h*0.5} ${x+w*0.28},${y-h*0.62} ${x+w*0.18},${y-h*0.35} ${x-w*0.12},${y-h*0.28}" fill="#7a8a6a" stroke="none" opacity="0.5"/>
          ${snow ? `<polygon points="${x},${y-h} ${x-w*0.18},${y-h+snowH} ${x+w*0.18},${y-h+snowH}" fill="#f0ece0" stroke="none" opacity="0.85"/>` : ''}
        </g>`;
    }

    function city(x, y, scale=1) {
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

    function sign(x, y, flip=false) {
        const ox = flip ? -30 : 2;
        return `<g transform="translate(${x},${y})" opacity="0.55">
          <line x1="0" y1="0" x2="0" y2="-22" stroke="#7a5c3a" stroke-width="2" stroke-linecap="round"/>
          <rect x="${ox}" y="-22" width="28" height="10" rx="2" fill="#f5e6c8" stroke="#2c1a0e" stroke-width="1"/>
          <line x1="${ox+2}" y1="-17" x2="${ox+26}" y2="-17" stroke="#c17f3a" stroke-width="0.8" stroke-dasharray="3 3" opacity="0.6"/>
        </g>`;
    }

    function footprints(x, y, count=3) {
        let s = '';
        for (let i=0; i<count; i++) {
            const fy = y + i*14, fx = x + (i%2===0 ? -4 : 4);
            s += `<ellipse cx="${fx}" cy="${fy}" rx="3" ry="4.5" fill="#c17f3a" opacity="0.25" transform="rotate(${i%2===0?-15:15},${fx},${fy})"/>`;
        }
        return `<g>${s}</g>`;
    }

    function lake(x, y, rx=18, ry=7) {
        return `<g opacity="0.35">
          <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#7ab0d4" stroke="#5090b0" stroke-width="0.8"/>
          <ellipse cx="${x-4}" cy="${y-1}" rx="${rx*0.45}" ry="${ry*0.5}" fill="#a0c8e8" opacity="0.5"/>
        </g>`;
    }

    function stones(x, y) {
        return `<g opacity="0.3">
          <ellipse cx="${x-6}" cy="${y}" rx="4" ry="2.5" fill="#a09080" stroke="#7a6050" stroke-width="0.5"/>
          <ellipse cx="${x+5}" cy="${y+3}" rx="3" ry="2" fill="#b0a090" stroke="#7a6050" stroke-width="0.5"/>
          <ellipse cx="${x}" cy="${y+6}" rx="2.5" ry="1.8" fill="#a09080" stroke="#7a6050" stroke-width="0.5"/>
        </g>`;
    }

    const gap = 80, edge = W * 0.08;
    function lx(depth=0.5) { return cx - gap - (cx - gap - edge) * depth; }
    function rx(depth=0.5) { return cx + gap + (cx - gap - edge) * depth; }
    const mScale = Math.max(0.6, Math.min(1.6, W / 700));
    const tScale = Math.max(0.7, Math.min(1.4, W / 600));

    let decor = '';
    decor += mountain(lx(0.9), 100, 130*mScale, 80*mScale, true);
    decor += mountain(lx(0.6), 130, 100*mScale, 65*mScale, true);
    decor += mountain(rx(0.9), 110, 120*mScale, 75*mScale, true);
    decor += mountain(rx(0.6), 140,  90*mScale, 58*mScale, true);
    for (let i=0; i<5; i++) {
        decor += tree(lx(0.7 - i*0.1), 175 + i*8, tScale*(0.85+i*0.05), true);
        decor += tree(rx(0.7 - i*0.1), 170 + i*8, tScale*(0.9+i*0.04),  true);
    }

    const ptDefs = [
        p => { decor += city(lx(0.75),p.y-10,1.1*tScale); decor += city(lx(0.4),p.y+30,0.75*tScale); decor += sign(rx(0.35),p.y-5); decor += footprints(cx+14,p.y+35); decor += tree(rx(0.6),p.y-15,tScale*0.85); decor += tree(rx(0.75),p.y+5,tScale*0.9); },
        p => { decor += tree(lx(0.8),p.y-22,tScale); decor += tree(lx(0.6),p.y-10,tScale*0.85); decor += tree(lx(0.4),p.y+5,tScale*1.1); decor += tree(rx(0.5),p.y-18,tScale*0.9); decor += tree(rx(0.7),p.y-5,tScale); decor += lake(rx(0.9),p.y+25,24*mScale,9*mScale); decor += stones(cx-12,p.y+20); },
        p => { decor += sign(lx(0.4),p.y-8,true); decor += sign(rx(0.4),p.y+15); decor += tree(rx(0.65),p.y+8,tScale*0.95); decor += tree(rx(0.82),p.y-5,tScale*1.1); decor += tree(lx(0.7),p.y+12,tScale*0.8); decor += footprints(cx-16,p.y+28); decor += mountain(lx(0.95),p.y-20,90*mScale,55*mScale,false); },
        p => { decor += lake(lx(0.85),p.y+20,30*mScale,11*mScale); decor += tree(lx(0.65),p.y-8,tScale*0.9); decor += tree(lx(0.5),p.y+5,tScale*1.05); decor += mountain(rx(0.9),p.y-25,100*mScale,65*mScale,true); decor += mountain(rx(0.65),p.y,70*mScale,45*mScale,false); decor += tree(rx(0.45),p.y-12,tScale*0.85); },
        p => { [0.4,0.6,0.78,0.92].forEach((dd,i) => decor += tree(lx(dd),p.y-22+i*5,tScale*(1.2-i*0.05),true)); [0.45,0.62,0.8].forEach((dd,i) => decor += tree(rx(dd),p.y-18+i*7,tScale*(1.1-i*0.05),true)); decor += sign(rx(0.35),p.y-12); decor += stones(cx+8,p.y+18); },
        p => { decor += city(rx(0.7),p.y-18,1.2*tScale); decor += city(rx(0.35),p.y+10,0.85*tScale); decor += city(lx(0.6),p.y-5,0.75*tScale); decor += footprints(cx+12,p.y+32,4); decor += tree(lx(0.85),p.y-10,tScale*0.8); decor += tree(lx(0.95),p.y+8,tScale*0.9); },
        p => { decor += lake(rx(0.88),p.y+15,28*mScale,10*mScale); decor += tree(rx(0.6),p.y-8,tScale); decor += tree(rx(0.75),p.y+5,tScale*0.85); decor += tree(lx(0.55),p.y-12,tScale*1.1,true); decor += tree(lx(0.72),p.y+2,tScale*0.9,true); decor += tree(lx(0.88),p.y+15,tScale,true); decor += stones(cx-14,p.y+22); decor += sign(lx(0.38),p.y-5,true); },
        p => { [0.95,0.7,0.45].forEach((dd,i) => decor += mountain(lx(dd),p.y-30+i*15,(120-i*25)*mScale,(80-i*18)*mScale,i<2)); [0.5,0.68,0.84].forEach((dd,i) => decor += tree(rx(dd),p.y-15+i*10,tScale*(1.1-i*0.1))); decor += sign(lx(0.35),p.y+22,true); decor += footprints(cx-15,p.y+30); },
        p => { for(let i=0;i<5;i++) { decor += tree(lx(0.4+i*0.13),p.y-28+i*6,tScale*(1.2-i*0.06),true); decor += tree(rx(0.4+i*0.13),p.y-24+i*6,tScale*(1.1-i*0.05),true); } decor += lake(lx(0.92),p.y+30,22*mScale,8*mScale); decor += footprints(cx-16,p.y+22,5); },
        p => { [cx-8,cx+16,cx-20].forEach((x,i) => decor += stones(x,p.y+14+i*16)); [0.6,0.8].forEach((dd,i) => { decor += tree(lx(dd),p.y+6+i*12,tScale*0.75); decor += tree(rx(dd),p.y+8+i*12,tScale*0.7); }); decor += mountain(rx(0.95),p.y-40,90*mScale,58*mScale,true); },
        p => { decor += city(lx(0.8),p.y-25,1.3*tScale); decor += city(lx(0.48),p.y+5,0.9*tScale); decor += mountain(rx(0.95),p.y-45,110*mScale,72*mScale,true); decor += mountain(rx(0.7),p.y-20,80*mScale,50*mScale,true); decor += tree(rx(0.48),p.y-8,tScale*0.85); decor += sign(rx(0.35),p.y+18); decor += footprints(cx+10,p.y+28,4); },
        p => { decor += city(rx(0.72),p.y-30,1.4*tScale); decor += city(rx(0.4),p.y-5,tScale); decor += city(lx(0.5),p.y+10,0.8*tScale); [0.7,0.85,0.95].forEach((dd,i) => decor += tree(lx(dd),p.y-25+i*13,tScale*(1.1-i*0.1),true)); decor += lake(lx(0.92),p.y+35,26*mScale,10*mScale); decor += footprints(cx+10,p.y+22,5); },
    ];

    points.forEach((p, i) => { if (ptDefs[i]) ptDefs[i](p); });

    for (let fy = 300; fy < tlH - 100; fy += 175 + sr(fy)*80) {
        const nearDot = points.some(p => Math.abs(p.y - fy) < 100);
        if (!nearDot) {
            decor += tree(lx(0.45 + sr(fy*3)*0.45), fy, tScale*(0.75 + sr(fy*13)*0.35), sr(fy*11) > 0.5);
            decor += tree(rx(0.45 + sr(fy*7)*0.45), fy + sr(fy*17)*20, tScale*(0.7 + sr(fy*19)*0.4), sr(fy*11) > 0.5);
            if (sr(fy*23) > 0.78) decor += stones(cx + (sr(fy)*30 - 15), fy + 25);
            if (sr(fy*29) > 0.88) decor += sign(sr(fy*31) > 0.5 ? lx(0.35) : rx(0.35), fy - 8, sr(fy*31) > 0.5);
        }
    }

    svg.setAttribute('viewBox', `0 0 ${W} ${tlH}`);
    svg.setAttribute('height', tlH);
    svg.innerHTML = decor + `
      <path d="${d}" fill="none" stroke="#c17f3a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.15"/>
      <path d="${d}" fill="none" stroke="#8a6430" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="11 9" opacity="0.55"/>
      <path d="${d}" fill="none" stroke="#f5e6c8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 16" stroke-dashoffset="8" opacity="0.65"/>`;

    window._trailTlEl = tl;
}

// ── Wanderer ─────────────────────────────────────────────────────
let _pathEl = null, _pathLen = 0, _hikerAngle = 0, _benchShown = false;

function getPointAtProgress(progress) {
    if (!_pathEl) {
        _pathEl = document.querySelector('#trail-svg path:nth-of-type(2)');
        if (!_pathEl) return null;
        _pathLen = _pathEl.getTotalLength();
    }
    return _pathEl.getPointAtLength(Math.max(0, Math.min(_pathLen, progress * _pathLen)));
}

function updateHiker() {
    const tl    = window._trailTlEl;
    const hiker = document.getElementById('hiker');
    if (!tl || !hiker) return;

    // Wanderer startet erst beim ersten Dot
    const tlHeader = tl.querySelector('.tl-header');
    const headerH  = tlHeader ? tlHeader.offsetHeight + 60 : 60;
    const tlStart  = tl.offsetTop + headerH;
    const tlRange  = tl.scrollHeight - headerH;
    const scrolled = window.scrollY + window.innerHeight * 0.6;
    const progress = Math.max(0, Math.min(1, (scrolled - tlStart) / tlRange));

    const atBottom = progress >= 0.97;
    const bench    = document.getElementById('bench-svg');
    const dog      = document.getElementById('hiker-dog');

    if (atBottom && !_benchShown) {
        _benchShown = true;
        hiker.style.transition = 'opacity 0.4s'; hiker.style.opacity = '0';
        if (dog)   { dog.style.transition = 'opacity 0.4s'; dog.style.opacity = '0'; }
        if (bench) {
            bench.style.transition = 'opacity 0.6s'; bench.style.opacity = '0.9';
            setTimeout(() => {
                const bs = document.getElementById('bench-steam');
                if (bs) {
                    bs.style.transition = 'opacity 0.5s'; bs.style.opacity = '0.7';
                    let t = 0;
                    function driftSteam() { t += 0.04; bs.setAttribute('transform', `translate(${Math.sin(t)*2},${Math.sin(t*0.7)*2})`); requestAnimationFrame(driftSteam); }
                    driftSteam();
                }
            }, 800);
        }
    } else if (!atBottom && _benchShown) {
        _benchShown = false;
        hiker.style.transition = 'opacity 0.3s'; hiker.style.opacity = '1';
        if (dog)   { dog.style.transition = 'opacity 0.3s'; dog.style.opacity = '1'; }
        if (bench) { bench.style.transition = 'opacity 0.3s'; bench.style.opacity = '0'; }
    }
    if (atBottom) return;

    const pt  = getPointAtProgress(progress);
    if (!pt) return;
    const pt2 = getPointAtProgress(Math.min(1, progress + 0.008));
    const dx  = pt2 ? pt2.x - pt.x : 0;
    const dy  = pt2 ? pt2.y - pt.y : 1;
    _hikerAngle += (Math.atan2(dx, -dy) * 180 / Math.PI - _hikerAngle) * 0.15;

    const step  = Math.floor(progress * 120) % 2;
    const legEl = document.getElementById('hiker-legs');
    if (legEl) {
        legEl.innerHTML = step === 0
            ? `<line x1="-2" y1="0" x2="-6" y2="11" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="2" y1="0" x2="4" y2="9" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`
            : `<line x1="-2" y1="0" x2="-4" y2="9" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="2" y1="0" x2="6" y2="11" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`;
    }
    hiker.setAttribute('transform', `translate(${pt.x}, ${pt.y}) scale(${dx < -1 ? -1 : 1}, 1) rotate(${_hikerAngle * 0.4})`);
}

// ── Scroll-Trigger Animationen ───────────────────────────────────
function getDotTop(dot) {
    const tl = document.getElementById('timeline');
    let y = 0, el = dot;
    while (el && el !== tl) { y += el.offsetTop; el = el.offsetParent; }
    return y;
}

// ── Samen-zu-Baum ────────────────────────────────────────────────
let _seedPlayed = false;
function triggerSeedAnim() {
    const svg = document.getElementById('seed-svg');
    const dot = document.querySelector('[data-event="gruendung"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 120) + 'px';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    const trunk    = document.getElementById('st-trunk');
    const branches = document.getElementById('st-branches');
    const seed     = document.getElementById('st-seed');
    trunk.style.transition = 'none'; trunk.style.transform = 'scaleY(0)';
    branches.style.transition = 'none'; branches.style.opacity = '0';
    ['st-c3','st-c2','st-c2b','st-c1'].forEach(id => document.getElementById(id).setAttribute('r','0'));
    seed.style.opacity = '1';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.4s'; svg.style.opacity = '0.7';
        setTimeout(() => { seed.style.opacity = '0'; }, 350);
        setTimeout(() => { trunk.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)'; trunk.style.transform = 'scaleY(1)'; }, 700);
        setTimeout(() => { branches.style.transition = 'opacity 0.4s'; branches.style.opacity = '1'; }, 1250);
        setTimeout(() => { document.getElementById('st-c3').setAttribute('r','18'); }, 1450);
        setTimeout(() => { document.getElementById('st-c2').setAttribute('r','14'); }, 1600);
        setTimeout(() => { document.getElementById('st-c2b').setAttribute('r','13'); }, 1700);
        setTimeout(() => { document.getElementById('st-c1').setAttribute('r','20'); }, 1850);
    });
}

// ── Lastenrad ────────────────────────────────────────────────────
let _bikePlayed = false;
let _bikeFrame  = null;
function triggerBikeAnim() {
    const svg = document.getElementById('bike-svg');
    const dot = document.querySelector('[data-event="lieferung"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 80) + 'px';
    const rider = document.getElementById('bike-rider');
    rider.style.transition = 'none'; rider.setAttribute('transform', 'translate(38,0)');
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.4s'; svg.style.opacity = '0.75';
        let startTime = null;
        function animateBike(ts) {
            if (!startTime) startTime = ts;
            const t = Math.min((ts - startTime) / 1800, 1);
            rider.setAttribute('transform', `translate(${38 + (150-38)*t*t},0)`);
            const legEl = document.getElementById('bike-legs');
            if (legEl) {
                const step = Math.floor(t * 30) % 2;
                legEl.innerHTML = step === 0
                    ? `<line x1="34" y1="48" x2="28" y2="54" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="48" x2="40" y2="54" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>`
                    : `<line x1="34" y1="48" x2="30" y2="57" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="48" x2="38" y2="53" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>`;
            }
            if (t < 1) { _bikeFrame = requestAnimationFrame(animateBike); }
            else { rider.style.transition = 'opacity 0.3s'; rider.style.opacity = '0'; }
        }
        setTimeout(() => { _bikeFrame = requestAnimationFrame(animateBike); }, 600);
    });
}

// ── Jonas kommt dazu & springt ───────────────────────────────────
let _jonasPlayed = false;
function triggerJonasAnim() {
    const svg = document.getElementById('jonas-svg');
    const dot = document.querySelector('[data-event="jonas"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 100) + 'px';
    const person = document.getElementById('jonas-person');
    const shadow = document.getElementById('jonas-shadow');
    const stars  = document.getElementById('jonas-stars');
    person.setAttribute('transform', 'translate(-110, 0)');
    stars.style.opacity = '0';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.4s'; svg.style.opacity = '0.8';
        let startTime = null;
        function walkIn(ts) {
            if (!startTime) startTime = ts;
            const t = Math.min((ts - startTime) / 1100, 1);
            const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
            const x = -110 + 110 * ease;
            person.setAttribute('transform', `translate(${x}, 0)`);
            shadow.setAttribute('cx', 50 + x);
            const legs = document.getElementById('jonas-legs');
            if (legs) {
                const s = Math.floor(t * 18) % 2;
                legs.innerHTML = s === 0
                    ? `<line x1="46" y1="78" x2="40" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="54" y1="78" x2="58" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`
                    : `<line x1="46" y1="78" x2="48" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="54" y1="78" x2="52" y2="96" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`;
            }
            if (t < 1) requestAnimationFrame(walkIn);
            else doJumps();
        }
        requestAnimationFrame(walkIn);
        function doJumps() {
            const arms = document.getElementById('jonas-arms');
            const legs = document.getElementById('jonas-legs');
            let jump = 0;
            function oneJump() {
                if (jump >= 3) return;
                person.style.transition = 'transform 0.18s cubic-bezier(0.4,0,0.2,1)';
                shadow.style.transition = 'all 0.18s';
                person.setAttribute('transform', 'translate(0, -18)');
                shadow.setAttribute('rx', '6');
                if (arms) arms.innerHTML = `<line x1="40" y1="65" x2="30" y2="52" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/><line x1="58" y1="65" x2="68" y2="52" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>`;
                if (legs) legs.innerHTML = `<line x1="46" y1="78" x2="40" y2="88" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="54" y1="78" x2="60" y2="88" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`;
                if (jump === 0) { stars.style.opacity = '1'; setTimeout(() => { stars.style.opacity = '0'; }, 400); }
                setTimeout(() => {
                    person.setAttribute('transform', 'translate(0, 0)');
                    shadow.setAttribute('rx', '11');
                    if (arms) arms.innerHTML = `<line x1="40" y1="65" x2="33" y2="74" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/><line x1="58" y1="65" x2="65" y2="74" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>`;
                    if (legs) legs.innerHTML = `<line x1="46" y1="78" x2="42" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/><line x1="54" y1="78" x2="58" y2="98" stroke="#5a3e22" stroke-width="2.2" stroke-linecap="round"/>`;
                    jump++;
                    setTimeout(oneJump, 180);
                }, 220);
            }
            oneJump();
        }
    });
}

// ── Geburtstagskuchen ────────────────────────────────────────────
let _cakePlayed = false;
function triggerCakeAnim() {
    const svg = document.getElementById('cake-svg');
    const dot = document.querySelector('[data-event="jubilaeum"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 110) + 'px';
    const flame = document.getElementById('cake-flame');
    const smoke = document.getElementById('cake-smoke');
    const glow  = document.getElementById('cake-glow');
    flame.style.opacity = '1'; smoke.style.opacity = '0';
    smoke.style.transition = 'none'; svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s'; svg.style.opacity = '0.85';
        let flickerRunning = true, flickerFrame;
        function flicker() {
            if (!flickerRunning) return;
            const s = 0.85 + Math.random() * 0.3;
            glow.setAttribute('rx', 7*s); glow.setAttribute('ry', 9*s);
            flame.setAttribute('transform', `translate(${(Math.random()-0.5)*3},0) scale(1,${s})`);
            flickerFrame = setTimeout(flicker, 80 + Math.random() * 60);
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

// ── Flugzeug ─────────────────────────────────────────────────────
let _planePlayed = false;
let _planeFrame  = null;
function triggerPlaneAnim() {
    const svg = document.getElementById('plane-svg');
    const dot = document.querySelector('[data-event="aethiopien"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 80) + 'px';
    const body  = document.getElementById('plane-body');
    const trail = document.getElementById('plane-trail');
    body.setAttribute('transform', 'translate(20, 50)');
    trail.style.opacity = '0'; trail.style.transition = 'none';
    svg.style.transition = 'none'; svg.style.opacity = '0';
    requestAnimationFrame(() => {
        svg.style.transition = 'opacity 0.5s'; svg.style.opacity = '0.85';
        let startTime = null;
        function fly(ts) {
            if (!startTime) startTime = ts;
            const t = Math.min((ts - startTime) / 2400, 1);
            const ease = t * t;
            body.setAttribute('transform', `translate(${50+ease*280},${20-ease*30}) rotate(${-ease*8},58,18)`);
            if (t > 0.12) { trail.style.transition = 'opacity 0.4s'; trail.style.opacity = '1'; }
            if (t < 1) { _planeFrame = requestAnimationFrame(fly); }
            else { svg.style.transition = 'opacity 0.8s'; svg.style.opacity = '0'; }
        }
        setTimeout(() => { _planeFrame = requestAnimationFrame(fly); }, 500);
    });
}

// ── Café-Schild ──────────────────────────────────────────────────
let _cafePlayed = false;
function triggerCafeAnim() {
    const svg  = document.getElementById('cafe-svg');
    const dot  = document.querySelector('[data-event="cafe"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 110) + 'px';
    const signBg = document.getElementById('cafe-sign-bg');
    const closed = document.getElementById('cafe-closed');
    const open   = document.getElementById('cafe-open');
    const sign   = document.getElementById('cafe-sign');
    signBg.setAttribute('fill','#d85a30');
    closed.style.transition='none'; closed.style.opacity='1';
    open.style.transition='none';   open.style.opacity='0';
    sign.style.transition='none';   sign.style.transform='rotate(0deg)';
    svg.style.transition='none';    svg.style.opacity='0';
    requestAnimationFrame(() => {
        svg.style.transition='opacity 0.5s'; svg.style.opacity='0.9';
        setTimeout(() => { sign.style.transition='transform 0.5s ease-in-out'; sign.style.transform='rotate(-8deg)'; setTimeout(()=>sign.style.transform='rotate(5deg)',500); setTimeout(()=>sign.style.transform='rotate(-3deg)',1000); setTimeout(()=>sign.style.transform='rotate(0deg)',1500); }, 300);
        setTimeout(() => {
            sign.style.transition='transform 0.25s ease-in'; sign.style.transform='scaleX(0)';
            setTimeout(() => {
                signBg.setAttribute('fill','#4a6741'); closed.style.opacity='0'; open.style.opacity='1';
                sign.style.transition='transform 0.25s ease-out'; sign.style.transform='scaleX(1)';
                setTimeout(() => { sign.style.transition='transform 0.4s ease-in-out'; sign.style.transform='rotate(6deg)'; setTimeout(()=>sign.style.transform='rotate(-4deg)',400); setTimeout(()=>sign.style.transform='rotate(0deg)',800); }, 300);
            }, 260);
        }, 2000);
    });
}

// ── Podcast ──────────────────────────────────────────────────────
let _podcastPlayed = false;
function triggerPodcastAnim() {
    const svg = document.getElementById('podcast-svg');
    const dot = document.querySelector('[data-event="podcast"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 115) + 'px';
    const waves = document.getElementById('pod-waves');
    const light = document.getElementById('pod-light');
    const bean  = document.getElementById('pod-bean');
    waves.style.opacity='0'; light.setAttribute('fill','#d85a30');
    svg.style.transition='none'; svg.style.opacity='0';
    requestAnimationFrame(() => {
        svg.style.transition='opacity 0.5s'; svg.style.opacity='0.9';
        let bobT=0, bobFrame;
        function bob() { bobT+=0.08; bean.setAttribute('transform',`translateY(${Math.sin(bobT)*2.5})`); bobFrame=requestAnimationFrame(bob); }
        setTimeout(() => {
            bobFrame=requestAnimationFrame(bob);
            let waveOn=true; const wI=setInterval(()=>{ waveOn=!waveOn; waves.style.transition='opacity 0.15s'; waves.style.opacity=waveOn?'1':'0.2'; },350);
            let lightOn=true; const lI=setInterval(()=>{ lightOn=!lightOn; light.setAttribute('fill',lightOn?'#d85a30':'#f5c518'); },600);
            svg._cleanup=()=>{ cancelAnimationFrame(bobFrame); clearInterval(wI); clearInterval(lI); };
        },400);
    });
}

// ── Drei Fahnen ──────────────────────────────────────────────────
let _flagsPlayed = false;
function triggerFlagsAnim() {
    const svg = document.getElementById('flags-svg');
    const dot = document.querySelector('[data-event="kooperativen"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 110) + 'px';
    ['flag1','flag2','flag3'].forEach(id=>{ const f=document.getElementById(id); f.style.transition='none'; f.style.transform='scaleY(0)'; });
    svg.style.transition='none'; svg.style.opacity='0';
    requestAnimationFrame(() => {
        svg.style.transition='opacity 0.5s'; svg.style.opacity='0.88';
        [['flag1',400],['flag2',750],['flag3',1100]].forEach(([id,delay])=>setTimeout(()=>{ const f=document.getElementById(id); f.style.transition='transform 0.55s cubic-bezier(0.34,1.56,0.64,1)'; f.style.transform='scaleY(1)'; },delay));
        setTimeout(()=>{ ['flag1','flag2','flag3'].forEach((id,i)=>{ const f=document.getElementById(id); let t=0; function wave(){ t+=0.06; f.style.transform=`scaleY(1) skewY(${Math.sin(t+i*0.8)*2.5}deg)`; requestAnimationFrame(wave); } wave(); }); },1800);
    });
}

// ── Bio-Stempel ──────────────────────────────────────────────────
let _bioPlayed = false;
function triggerBioAnim() {
    const svg = document.getElementById('stamp-svg');
    const dot = document.querySelector('[data-event="bio"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 100) + 'px';
    const group=document.getElementById('stamp-group'); const ink=document.getElementById('stamp-ink');
    group.style.transition='none'; group.style.transform='scale(0) rotate(-12deg) translateY(-40px)';
    ink.style.opacity='0'; svg.style.transition='none'; svg.style.opacity='0';
    requestAnimationFrame(() => {
        svg.style.transition='opacity 0.3s'; svg.style.opacity='1';
        setTimeout(()=>{ group.style.transition='transform 0.18s cubic-bezier(0.4,0,1,1)'; group.style.transform='scale(1.12) rotate(-12deg) translateY(0)'; setTimeout(()=>{ ink.style.opacity='0.18'; setTimeout(()=>ink.style.opacity='0',80); group.style.transition='transform 0.35s cubic-bezier(0.34,1.56,0.64,1)'; group.style.transform='scale(1) rotate(0deg) translateY(0)'; },180); },300);
    });
}

// ── Corona-Viren ─────────────────────────────────────────────────
let _virusPlayed = false;
let _virusFrames = [];
function triggerVirusAnim() {
    const svg = document.getElementById('virus-svg');
    const dot = document.querySelector('[data-event="corona"]');
    if (!svg || !dot) return;
    svg.style.top = (getDotTop(dot) + dot.offsetHeight/2 - 140) + 'px';
    ['v1','v2','v3'].forEach(id=>{ const v=document.getElementById(id); v.style.transition='none'; v.style.opacity='0'; v.setAttribute('transform',''); });
    svg.style.transition='none'; svg.style.opacity='0';
    requestAnimationFrame(() => {
        svg.style.transition='opacity 0.5s'; svg.style.opacity='0.88';
        ['v1','v2','v3'].forEach((id,i)=>{ setTimeout(()=>{ const v=document.getElementById(id); v.style.transition='opacity 0.3s'; v.style.opacity='1'; const dirs=[{ax:0.025,ay:0.018},{ax:-0.02,ay:0.022},{ax:0.018,ay:-0.02}]; const dd=dirs[i]; let t=i*2; function float(){ t+=0.03; v.setAttribute('transform',`translate(${Math.sin(t*dd.ax*60)*6},${Math.sin(t*dd.ay*60+1)*5}) rotate(${Math.sin(t*0.4)*8})`); _virusFrames.push(requestAnimationFrame(float)); } float(); },300+i*220); });
    });
}

// ── Solar-Panels ─────────────────────────────────────────────────
let _solarPlayed = false;
function triggerSolarAnim() {
    const svg=document.getElementById('solar-svg'); const dot=document.querySelector('[data-event="roesterei"]');
    if (!svg||!dot) return;
    svg.style.top=(getDotTop(dot)+dot.offsetHeight/2-100)+'px';
    const pl=document.getElementById('panel-left'); const pr=document.getElementById('panel-right');
    const sun=document.getElementById('solar-sun'); const bolt=document.getElementById('solar-bolt');
    [pl,pr].forEach(p=>{ p.style.transition='none'; p.style.transform='rotateX(90deg)'; });
    sun.style.opacity='0'; bolt.style.opacity='0'; svg.style.transition='none'; svg.style.opacity='0';
    requestAnimationFrame(()=>{ svg.style.transition='opacity 0.4s'; svg.style.opacity='0.9'; setTimeout(()=>{ pl.style.transition='transform 0.65s cubic-bezier(0.34,1.56,0.64,1)'; pl.style.transform='rotateX(0deg)'; },400); setTimeout(()=>{ pr.style.transition='transform 0.65s cubic-bezier(0.34,1.56,0.64,1)'; pr.style.transform='rotateX(0deg)'; },680); setTimeout(()=>sun.style.opacity='1',1200); setTimeout(()=>{ bolt.style.opacity='1'; let on=true; setInterval(()=>{ on=!on; bolt.style.opacity=on?'1':'0.2'; },500); },1600); });
}

// ── Kaffeetasse ──────────────────────────────────────────────────
let _heutePlayed = false;
function triggerCupAnim() {
    const svg=document.getElementById('cup-svg'); const dot=document.querySelector('[data-event="heute"]');
    if (!svg||!dot) return;
    svg.style.top=(getDotTop(dot)+dot.offsetHeight/2-120)+'px';
    const heart=document.getElementById('cup-heart');
    const s1=document.getElementById('steam1'), s2=document.getElementById('steam2'), s3=document.getElementById('steam3');
    [heart,s1,s2,s3].forEach(el=>{ el.style.transition='none'; el.style.opacity='0'; });
    svg.style.transition='none'; svg.style.opacity='0';
    requestAnimationFrame(()=>{
        svg.style.transform='translateY(30px)'; svg.style.transition='opacity 0.5s,transform 0.6s cubic-bezier(0.34,1.56,0.64,1)'; svg.style.opacity='0.95'; svg.style.transform='translateY(0)';
        setTimeout(()=>{ heart.style.transition='opacity 0.6s'; heart.style.opacity='1'; },700);
        setTimeout(()=>{ [s1,s2,s3].forEach((s,i)=>{ s.style.transition=`opacity 0.5s ${i*0.15}s`; s.style.opacity='0.7'; }); let st=0; function steamAnim(){ st+=0.025; [s1,s2,s3].forEach((s,i)=>s.setAttribute('transform',`translate(${Math.cos(st*0.7+i)*2},${Math.sin(st+i*1.2)*3})`)); requestAnimationFrame(steamAnim); } steamAnim(); },900);
    });
}

// ── Scroll-Handler ───────────────────────────────────────────────
function checkAnimationTriggers() {
    function check(eventName, flag, triggerFn, resetFn) {
        const dot = document.querySelector(`[data-event="${eventName}"]`);
        if (!dot) return flag;
        // Feuert wenn der Dot im unteren 75% des Bildschirms sichtbar ist
        const passed = dot.getBoundingClientRect().top <= window.innerHeight * 0.75;
        if (passed && !flag)  { triggerFn(); return true; }
        if (!passed && flag)  { resetFn();   return false; }
        return flag;
    }

    function hideSvg(id, extraReset) {
        const el = document.getElementById(id);
        if (el) { el.style.transition='opacity 0.3s'; el.style.opacity='0'; }
        if (extraReset) extraReset();
    }

    _seedPlayed    = check('gruendung',    _seedPlayed,    triggerSeedAnim,    ()=>hideSvg('seed-svg'));
    _bikePlayed    = check('lieferung',    _bikePlayed,    triggerBikeAnim,    ()=>{ if(_bikeFrame)cancelAnimationFrame(_bikeFrame); hideSvg('bike-svg'); const r=document.getElementById('bike-rider'); if(r){r.style.opacity='1';r.setAttribute('transform','translate(38,0)');} });
    _jonasPlayed   = check('jonas',        _jonasPlayed,   triggerJonasAnim,   ()=>hideSvg('jonas-svg'));
    _cakePlayed    = check('jubilaeum',    _cakePlayed,    triggerCakeAnim,    ()=>{ hideSvg('cake-svg'); const fl=document.getElementById('cake-flame'); const sm=document.getElementById('cake-smoke'); if(fl){fl.style.transition='none';fl.style.opacity='1';fl.style.transform='';} if(sm){sm.style.transition='none';sm.style.opacity='0';sm.style.transform='';} });
    _planePlayed   = check('aethiopien',   _planePlayed,   triggerPlaneAnim,   ()=>{ if(_planeFrame)cancelAnimationFrame(_planeFrame); hideSvg('plane-svg'); });
    _cafePlayed    = check('cafe',         _cafePlayed,    triggerCafeAnim,    ()=>hideSvg('cafe-svg'));
    _podcastPlayed = check('podcast',      _podcastPlayed, triggerPodcastAnim, ()=>{ const pv=document.getElementById('podcast-svg'); if(pv){if(pv._cleanup)pv._cleanup(); pv.style.transition='opacity 0.3s'; pv.style.opacity='0';} });
    _flagsPlayed   = check('kooperativen', _flagsPlayed,   triggerFlagsAnim,   ()=>hideSvg('flags-svg'));
    _bioPlayed     = check('bio',          _bioPlayed,     triggerBioAnim,     ()=>hideSvg('stamp-svg'));
    _virusPlayed   = check('corona',       _virusPlayed,   triggerVirusAnim,   ()=>{ _virusFrames.forEach(f=>cancelAnimationFrame(f)); _virusFrames=[]; hideSvg('virus-svg'); });
    _solarPlayed   = check('roesterei',    _solarPlayed,   triggerSolarAnim,   ()=>hideSvg('solar-svg'));
    _heutePlayed   = check('heute',        _heutePlayed,   triggerCupAnim,     ()=>hideSvg('cup-svg'));
}

// ── Init ─────────────────────────────────────────────────────────
export function initAnimations() {
    setTimeout(() => { drawTrail(); updateHiker(); }, 200);
    window.addEventListener('resize', () => {
        _pathEl=null; _pathLen=0;
        setTimeout(() => { drawTrail(); updateHiker(); }, 80);
    });
    window.addEventListener('scroll', () => {
        updateHiker();
        checkAnimationTriggers();
    }, { passive: true });
}