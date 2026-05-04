// ─── Tannkaffee · Kaffee-Persönlichkeitsquiz ─────────────────────────────────

const QUESTIONS = [
    {
        question: "Wie startest du am liebsten in den Morgen?",
        options: [
            { text: "Langsam, mit Ritual und Ruhe – der Tag beginnt erst nach dem ersten Schluck", score: { filter: 3, espresso: 0, cold: 0 } },
            { text: "Direkt und effizient – Energie sofort, keine Zeit verlieren", score: { filter: 0, espresso: 3, cold: 0 } },
            { text: "Ich bin eher ein Nacht-Mensch, der Morgen beginnt eigentlich am Nachmittag", score: { filter: 0, espresso: 1, cold: 3 } },
            { text: "Mit einer langen Runde durch den Schwarzwald – Bewegung zuerst", score: { filter: 2, espresso: 0, cold: 2 } }
        ]
    },
    {
        question: "Was beschreibt dich am besten?",
        options: [
            { text: "Ich schätze Handwerk und nehme mir Zeit für die Dinge, die mir wichtig sind", score: { filter: 3, espresso: 1, cold: 0 } },
            { text: "Ich weiß was ich will und komme direkt auf den Punkt", score: { filter: 0, espresso: 3, cold: 0 } },
            { text: "Ich bin neugierig, probiere gern Neues und überrasche auch mal", score: { filter: 1, espresso: 0, cold: 3 } },
            { text: "Ich bin flexibel und passe mich der Situation an", score: { filter: 1, espresso: 2, cold: 1 } }
        ]
    },
    {
        question: "Dein perfekter Sonntag in Freiburg?",
        options: [
            { text: "Filterkaffee im Lieblingscafé, Buch, keine Eile", score: { filter: 3, espresso: 0, cold: 0 } },
            { text: "Frühes Aufstehen, Espresso, Wochenmarkt auf dem Münsterplatz", score: { filter: 0, espresso: 3, cold: 0 } },
            { text: "Ausschlafen, Cold Brew über Eis, Dreisam-Wiese am Nachmittag", score: { filter: 0, espresso: 0, cold: 3 } },
            { text: "Spontan – schauen was der Tag bringt", score: { filter: 1, espresso: 1, cold: 1 } }
        ]
    },
    {
        question: "Was ist dir bei deinem Kaffee am wichtigsten?",
        options: [
            { text: "Die Herkunft und die Geschichte hinter der Bohne", score: { filter: 3, espresso: 1, cold: 0 } },
            { text: "Intensität und Crema – ein richtiger Espresso ohne Kompromisse", score: { filter: 0, espresso: 3, cold: 0 } },
            { text: "Natürliche Süße, keine Bitterkeit – am liebsten kalt", score: { filter: 0, espresso: 0, cold: 3 } },
            { text: "Hauptsache frisch geröstet und fair gehandelt", score: { filter: 2, espresso: 1, cold: 1 } }
        ]
    }
];

const RESULTS = {
    filter: {
        emoji: "🫖",
        title: "Der Handfilter-Liebhaber",
        kaffee: "Äthiopischer Yirgacheffe",
        description: "Du schätzt das Handwerk und nimmst dir Zeit für die Dinge, die dir wichtig sind. Der Weg ist das Ziel – auch beim Kaffee. Unser äthiopischer Yirgacheffe mit fruchtigen Beeren- und Blumennoten ist wie gemacht für dich. Lass das Wasser langsam aufgießen. Genieß den Duft. Das Leben ist kein Sprint.",
        color: "#c8973a"
    },
    espresso: {
        emoji: "☕",
        title: "Der Espresso-Connoisseur",
        kaffee: "Freiburger Hausblend",
        description: "Direkt, präzise, keine Zeit für Umwege. Du weißt was du willst – und du bekommst es. Unser Freiburger Hausblend vereint kräftigen Körper mit kakaosüßem Abgang. Perfekt für die Siebträgermaschine, perfekt für dich.",
        color: "#4a2c12"
    },
    cold: {
        emoji: "🧊",
        title: "Der Cold-Brew-Entdecker",
        kaffee: "Kolumbianischer Cold Brew",
        description: "Modern, entspannt, immer einen Schritt voraus. Du überraschst gern – und lässt dich überraschen. Unser 18-Stunden Cold Brew aus kolumbianischen Hochlandbohnen: samtig, natürlich süß, perfekt für den Sommer am Dreisam. Oder einfach immer.",
        color: "#2d4a2d"
    }
};

class Quiz {
    constructor(container) {
        this.container = container;
        this.currentQuestion = 0;
        this.answers = new Map();
        this.render();
    }

    getProgressPercent() {
        return (this.currentQuestion / QUESTIONS.length) * 100;
    }

    render() {
        if (this.currentQuestion >= QUESTIONS.length) {
            this.renderResult();
            return;
        }

        const q = QUESTIONS[this.currentQuestion];
        const selectedIndex = this.answers.get(this.currentQuestion);
        const isLast = this.currentQuestion === QUESTIONS.length - 1;

        this.container.innerHTML = `
      <div class="quiz__progress-bar">
        <div class="quiz__progress-bar-fill" style="width: ${this.getProgressPercent()}%"></div>
      </div>
      <div class="quiz__step">Frage ${this.currentQuestion + 1} von ${QUESTIONS.length}</div>
      <p class="quiz__question">${q.question}</p>
      <div class="quiz__options">
        ${q.options.map((opt, i) => `
          <button class="quiz__option${selectedIndex === i ? ' selected' : ''}" data-option="${i}">
            <span class="quiz__option-dot"></span>
            ${opt.text}
          </button>
        `).join('')}
      </div>
      <div class="quiz__nav">
        <button class="btn btn--outline quiz__back" ${this.currentQuestion === 0 ? 'disabled' : ''}>
          ← Zurück
        </button>
        <button class="btn btn--primary quiz__next" ${selectedIndex === undefined ? 'disabled' : ''}>
          ${isLast ? 'Auswertung ☕' : 'Weiter →'}
        </button>
      </div>
    `;

        this.container.querySelectorAll('.quiz__option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.answers.set(this.currentQuestion, parseInt(btn.dataset.option));
                this.render();
            });
        });

        this.container.querySelector('.quiz__back')?.addEventListener('click', () => {
            if (this.currentQuestion > 0) { this.currentQuestion--; this.render(); }
        });

        this.container.querySelector('.quiz__next')?.addEventListener('click', () => {
            if (this.answers.has(this.currentQuestion)) { this.currentQuestion++; this.render(); }
        });
    }

    calculateResult() {
        const scores = { filter: 0, espresso: 0, cold: 0 };
        this.answers.forEach((optIdx, qIdx) => {
            const selected = QUESTIONS[qIdx].options[optIdx];
            for (const [key, val] of Object.entries(selected.score)) {
                scores[key] += val;
            }
        });
        return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    }

    renderResult() {
        const key = this.calculateResult();
        const r = RESULTS[key];

        this.container.innerHTML = `
      <div class="quiz__result">
        <div class="quiz__result-badge" style="background: ${r.color}">
          <span class="quiz__result-emoji">${r.emoji}</span>
        </div>
        <div class="quiz__result-label">Dein Kaffee-Typ</div>
        <h3 class="quiz__result-title">${r.title}</h3>
        <div class="quiz__result-kaffee">
          <span class="quiz__result-kaffee-label">Empfehlung</span>
          <span class="quiz__result-kaffee-name">${r.kaffee}</span>
        </div>
        <p class="quiz__result-text">${r.description}</p>
        <button class="btn btn--outline quiz__restart" style="margin-top: 1.5rem">
          Nochmal versuchen
        </button>
      </div>
    `;

        this.container.querySelector('.quiz__restart')?.addEventListener('click', () => {
            this.currentQuestion = 0;
            this.answers.clear();
            this.render();
        });
    }
}

function initQuiz() {
    const container = document.querySelector('.quiz');
    if (!container) return;
    new Quiz(container);
}

export { initQuiz };