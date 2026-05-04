// ─── Tannenkaffee · Wanderkarte Zeitstrahl ───────────────────────────────────

const STATIONS = [
    { x: 60,   y: 230, year: "2010", label: "Gründung",      title: "Die Gründung",        icon: "🌱",
        photo: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80", photoAlt: "Kleine Rösterei",
        text: "Elena Berger kehrt nach einer Kaffeereise durch Äthiopien nach Freiburg zurück und gründet Tannenkaffee in einem kleinen Keller im Stühlinger. Die erste Röstmaschine: eine gebrauchte Probatone 5." },
    { x: 200,  y: 110, year: "2013", label: "Erstes Café",    title: "Das erste Café",      icon: "☕",
        photo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80", photoAlt: "Gemütliches Café",
        text: "Das Café in der Wilhelmstraße öffnet – mit nur acht Sitzplätzen und täglich wechselnden Filterkaffees. Die Schlange steht oft bis auf die Straße." },
    { x: 370,  y: 260, year: "2015", label: "Direkthandel",   title: "Direkter Handel",     icon: "🤝",
        photo: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80", photoAlt: "Kaffeebauern",
        text: "Tannenkaffee etabliert direkte Partnerschaften mit drei Kleinbauernkooperativen in Äthiopien, Kolumbien und Guatemala. Faire Preise, Transparenz, persönliche Beziehung." },
    { x: 530,  y: 90,  year: "2017", label: "Bio",            title: "Bio-Zertifizierung",  icon: "🌿",
        photo: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=600&q=80", photoAlt: "Nachhaltig Bio",
        text: "Alle Rohkaffees sind nun EU-bio-zertifiziert. Die Rösterei bezieht 100 % Ökostrom und kompensiert Emissionen durch Aufforstungsprojekte im Schwarzwald." },
    { x: 680,  y: 200, year: "2020", label: "Pandemie",       title: "Pandemie & Wandel",   icon: "💻",
        photo: "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=600&q=80", photoAlt: "Online Workshop",
        text: "Corona trifft hart – das Café schließt monatelang. Stattdessen: Online-Shop-Ausbau, Kaffee-Abonnements und digitale Röst-Workshops mit über 1.200 Teilnehmenden." },
    { x: 870,  y: 95,  year: "2023", label: "Neue Rösterei",  title: "Neue Rösterei",       icon: "🏭",
        photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", photoAlt: "Moderne Rösterei",
        text: "Umzug in die neue, größere Rösterei im Industriegebiet Nord. Solaranlage auf dem Dach, Regenwassernutzung, lärmarme Nachbrenner-Technologie." },
    { x: 1060, y: 240, year: "2025", label: "Heute",          title: "Tannenkaffee heute",  icon: "✨",
        photo: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80", photoAlt: "Kaffee heute",
        text: "Tannenkaffee zählt heute zu den bekanntesten Spezialitätenröstern im Südwesten. Über 2.000 treue Abonnenten, drei Partnerkooperativen, ein wachsendes Team – und noch immer dieselbe Leidenschaft wie im ersten Keller." }
];

const TREES = [
    { x: 130, y: 52,  s: 1.0,  o: 0.52 }, { x: 162, y: 36,  s: 0.7,  o: 0.38 },
    { x: 290, y: 45,  s: 0.85, o: 0.45 }, { x: 460, y: 38,  s: 0.9,  o: 0.48 },
    { x: 492, y: 22,  s: 0.6,  o: 0.32 }, { x: 620, y: 50,  s: 0.8,  o: 0.42 },
    { x: 760, y: 40,  s: 0.95, o: 0.48 }, { x: 795, y: 24,  s: 0.65, o: 0.32 },
    { x: 980, y: 48,  s: 0.9,  o: 0.45 }, { x: 1015,y: 30,  s: 0.7,  o: 0.35 },
    { x: 55,  y: 300, s: 0.65, o: 0.25 }, { x: 430, y: 308, s: 0.7,  o: 0.25 },
    { x: 850, y: 302, s: 0.7,  o: 0.25 },
];

function drawTree(x, y, s, o) {
    return `<g opacity="${o}" transform="translate(${x},${y}) scale(${s})">
    <polygon points="0,-30 19,6 -19,6" fill="#4a6741"/>
    <polygon points="0,-15 17,20 -17,20" fill="#3d5935"/>
    <polygon points="0,0 13,30 -13,30" fill="#4a6741"/>
    <rect x="-4" y="30" width="8" height="12" fill="#5a3e22" opacity="0.7"/>
  </g>`;
}

// Kleines Haus
function drawHouse(x, y, s) {
    return `<g transform="translate(${x},${y}) scale(${s})" opacity="0.45">
    <rect x="-18" y="0" width="36" height="26" fill="#c8a06e" rx="1"/>
    <polygon points="0,-16 22,0 -22,0" fill="#7a5c3a"/>
    <rect x="-5" y="10" width="10" height="16" fill="#5a3e22" opacity="0.6"/>
    <rect x="-14" y="6" width="8" height="8" fill="#d4c4a0" opacity="0.7"/>
  </g>`;
}

// Wanderer
function drawHiker(x, y, s) {
    return `<g transform="translate(${x},${y}) scale(${s})" opacity="0.5">
    <circle cx="0" cy="-22" r="5" fill="#5a3e22"/>
    <line x1="0" y1="-17" x2="0" y2="0" stroke="#5a3e22" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="0" y1="-10" x2="-8" y2="-2" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>
    <line x1="0" y1="-10" x2="10" y2="-5" stroke="#5a3e22" stroke-width="2" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="-6" y2="14" stroke="#5a3e22" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="6" y2="14" stroke="#5a3e22" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="10" y1="-5" x2="16" y2="-12" stroke="#7a5c3a" stroke-width="1.5" stroke-linecap="round"/>
  </g>`;
}

// Reh
function drawDeer(x, y, s) {
    return `<g transform="translate(${x},${y}) scale(${s})" opacity="0.42">
    <ellipse cx="0" cy="0" rx="14" ry="9" fill="#a07840"/>
    <ellipse cx="14" cy="-8" rx="7" ry="6" fill="#a07840"/>
    <line x1="14" y1="-14" x2="12" y2="-22" stroke="#7a5c3a" stroke-width="1.5"/>
    <line x1="14" y1="-14" x2="18" y2="-22" stroke="#7a5c3a" stroke-width="1.5"/>
    <line x1="16" y1="-20" x2="14" y2="-25" stroke="#7a5c3a" stroke-width="1"/>
    <line x1="16" y1="-20" x2="19" y2="-25" stroke="#7a5c3a" stroke-width="1"/>
    <line x1="-8" y1="8" x2="-10" y2="20" stroke="#7a5c3a" stroke-width="2"/>
    <line x1="-2" y1="9" x2="-3" y2="21" stroke="#7a5c3a" stroke-width="2"/>
    <line x1="6" y1="9" x2="7" y2="21" stroke="#7a5c3a" stroke-width="2"/>
    <line x1="12" y1="8" x2="14" y2="20" stroke="#7a5c3a" stroke-width="2"/>
    <circle cx="19" cy="-8" r="1.5" fill="#5a3e22"/>
  </g>`;
}

function buildMapSVG() {
    const trees = TREES.map(t => drawTree(t.x, t.y, t.s, t.o)).join('');

    const dots = STATIONS.map((s, i) => `
    <g class="tk-station" id="tk-dot-${i}" style="cursor:pointer" onclick="tkSelect(${i})">
      <circle cx="${s.x}" cy="${s.y}" r="22" fill="#fdf6ec" stroke="#4a6741" stroke-width="2" id="tk-circle-${i}"/>
      <text x="${s.x}" y="${s.y + 6}" text-anchor="middle" font-size="15" font-family="sans-serif">${s.icon}</text>
      <text x="${s.x}" y="${s.y + 38}" text-anchor="middle" font-size="10" font-weight="500"
        fill="#2d4a2d" font-family="sans-serif">${s.year}</text>
    </g>`).join('');

    return `<svg width="100%" viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

    ${trees}

    ${drawHouse(298, 268, 0.9)}
    ${drawHouse(720, 252, 0.78)}
    ${drawHiker(155, 218, 1.0)}
    ${drawHiker(615, 192, 0.88)}
    ${drawDeer(810, 212, 0.95)}
    ${drawDeer(1000, 228, 0.82)}

    <!-- Unregelmäßiger Wanderweg -->
    <path d="M 60,230
             C 90,195 140,115 200,110
             C 250,105 300,220 370,260
             C 420,285 460,140 530,90
             C 575,58 620,175 680,200
             C 725,218 790,108 870,95
             C 930,85 990,210 1060,240"
      fill="none" stroke="#a07840" stroke-width="2.5"
      stroke-dasharray="10,6" stroke-linecap="round" opacity="0.78"/>

    <text x="280" y="200" font-size="9" fill="#c8a06e" opacity="0.65"
      font-family="sans-serif" transform="rotate(-18,280,200)">~ 3 km</text>
    <text x="450" y="188" font-size="9" fill="#c8a06e" opacity="0.65"
      font-family="sans-serif" transform="rotate(22,450,188)">~ 6 km</text>
    <text x="765" y="162" font-size="9" fill="#c8a06e" opacity="0.65"
      font-family="sans-serif" transform="rotate(-8,765,162)">~ 4 km</text>
    <text x="960" y="185" font-size="9" fill="#c8a06e" opacity="0.65"
      font-family="sans-serif" transform="rotate(14,960,185)">~ 5 km</text>

    <g transform="translate(1168,285)">
      <circle cx="0" cy="0" r="20" fill="rgba(253,246,236,0.85)" stroke="#c8a96e" stroke-width="1"/>
      <polygon points="0,-13 3.5,-4 -3.5,-4" fill="#4a6741"/>
      <polygon points="0,13 3.5,4 -3.5,4" fill="#c8a96e" opacity="0.5"/>
      <polygon points="-13,0 -4,-3.5 -4,3.5" fill="#c8a96e" opacity="0.5"/>
      <polygon points="13,0 4,-3.5 4,3.5" fill="#c8a96e" opacity="0.5"/>
      <text x="0" y="-16" text-anchor="middle" font-size="7" fill="#4a6741"
        font-weight="500" font-family="sans-serif">N</text>
    </g>

    ${dots}

    <text x="600" y="310" text-anchor="middle" font-size="11" fill="#a09070"
      font-family="Georgia, serif" font-style="italic" opacity="0.75">
      Tannenkaffee · Eine Reise durch den Schwarzwald · 2010–2025
    </text>
  </svg>`;
}

function injectStyles() {
    if (document.getElementById('tk-styles')) return;
    const style = document.createElement('style');
    style.id = 'tk-styles';
    style.textContent = `
    .tk-wrapper { height: 100%; padding: 0; border-radius: 0; background: transparent; }
    .tk-station { cursor: pointer; }
    .tk-station:hover circle { stroke-width: 3; stroke: #2d4a2d; }
    .tk-scroll-entries { max-width: 860px; margin: 0 auto; padding: 2rem 2rem 4rem; display: flex; flex-direction: column; gap: 0; }
    .tk-scroll-entry { display: flex; gap: 1.25rem; align-items: flex-start; padding: 1.25rem 1rem; border-radius: 12px; transition: background 0.3s, box-shadow 0.3s; position: relative; scroll-margin-top: calc(var(--nav-h, 48px) + var(--map-h, 33vh) + 1rem); }
    .tk-scroll-entry::before { content: ''; position: absolute; left: 2.35rem; top: 4.2rem; bottom: -1.25rem; width: 1.5px; background: rgba(160,120,64,0.18); }
    .tk-scroll-entry:last-child::before { display: none; }
    .tk-scroll-entry.tk-active { background: rgba(255,250,240,0.95); box-shadow: 0 2px 16px rgba(74,50,18,0.08); }
    .tk-scroll-dot { width: 44px; height: 44px; border-radius: 50%; background: #fdf6ec; border: 2px solid #c8a96e; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; transition: background 0.3s, border-color 0.3s; }
    .tk-scroll-entry.tk-active .tk-scroll-dot { background: #2d4a2d; border-color: #1a2e1a; animation: tkPulse 0.6s ease; }
    .tk-scroll-body { flex: 1; padding-top: 4px; }
    .tk-scroll-year { font-size: 11px; color: #8a6a30; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
    .tk-scroll-title { font-family: Georgia, serif; font-size: 1.15rem; color: #2c1a0e; margin-bottom: 10px; }
    .tk-scroll-content { display: flex; gap: 1.25rem; align-items: flex-start; }
    .tk-scroll-photo { width: 200px; height: 140px; object-fit: cover; border-radius: 10px; flex-shrink: 0; transition: transform 0.3s, box-shadow 0.3s; }
    .tk-scroll-entry.tk-active .tk-scroll-photo { box-shadow: 0 4px 20px rgba(45,74,45,0.18); transform: scale(1.02); }
    .tk-scroll-text { font-size: 0.875rem; color: #5a3e22; line-height: 1.7; flex: 1; }
    @keyframes tkPulse { 0% { box-shadow: 0 0 0 0 rgba(45,74,45,0.4); } 70% { box-shadow: 0 0 0 10px rgba(45,74,45,0); } 100% { box-shadow: 0 0 0 0 rgba(45,74,45,0); } }
    @media (max-width: 600px) { .tk-scroll-content { flex-direction: column; } .tk-scroll-photo { width: 100%; height: 180px; } }
  `;
    document.head.appendChild(style);
}

let tkActiveIndex = -1;

window.tkSelect = function(i) {
    // Vorherigen deaktivieren
    if (tkActiveIndex >= 0) {
        const prevCircle = document.getElementById(`tk-circle-${tkActiveIndex}`);
        if (prevCircle) { prevCircle.setAttribute('fill', '#fdf6ec'); prevCircle.setAttribute('stroke', '#4a6741'); prevCircle.setAttribute('stroke-width', '2'); }
        document.getElementById(`tk-entry-${tkActiveIndex}`)?.classList.remove('tk-active');
    }

    if (tkActiveIndex === i) { tkActiveIndex = -1; return; }

    // Neuen aktivieren
    const circle = document.getElementById(`tk-circle-${i}`);
    if (circle) { circle.setAttribute('fill', '#2d4a2d'); circle.setAttribute('stroke', '#1a2e1a'); circle.setAttribute('stroke-width', '3'); }

    const entry = document.getElementById(`tk-entry-${i}`);
    if (entry) {
        entry.classList.add('tk-active');
        // Scrollen zum Eintrag – offset berücksichtigt Nav + fixe Karte
        const navH = 48;
        const mapH = window.innerHeight * 0.42;
        const top = entry.getBoundingClientRect().top + window.scrollY - navH - mapH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    tkActiveIndex = i;
};

function initTimeline() {
    // Horizontale Wanderkarte deaktiviert – neue vertikale Timeline in index.html
}

export { initTimeline };