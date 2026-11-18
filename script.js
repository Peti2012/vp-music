const navButtons = document.querySelectorAll(".nav-btn");
// A VP MUSIC LOGÓ VISSZAVISZ A KEZDŐLAPRA

document.getElementById("home-logo").addEventListener("click", function(event) {
    event.preventDefault();
    showPage("home");
});
const pages = document.querySelectorAll(".page");

// MENÜRENDSZER

function showPage(pageId) {
    pages.forEach(page => page.classList.remove("active"));

    navButtons.forEach(button => button.classList.remove("active"));

    document.getElementById(pageId)?.classList.add("active");

    document.querySelector(
        `.nav-btn[data-page="${pageId}"]`
    )?.classList.add("active");

    document.getElementById("lesson-detail").classList.add("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });
});

// TANANYAGOK

const lessons = {
    hangok: {
        title: "🎵 A zenei hangok",
        text: "A zenei ABC hét alapvető hangja: C, D, E, F, G, A, H.",
        sections: [
            ["Oktáv", "Két azonos nevű hang közötti távolság, például C és a következő C."],
            ["Félhang", "A hagyományos nyugati hangrendszer legkisebb hangköze."],
            ["Hangjegyek", "A kottában a hangjegyek mutatják a hangok magasságát és időtartamát."]
        ]
    },
    akkordok: {
        title: "🎹 Akkordok",
        text: "Az akkord több hang egyidejű megszólalása.",
        sections: [
            ["C-dúr", "C – E – G. Ez egy dúr akkord."],
            ["C-moll", "C – Esz – G. Ez egy moll akkord."],
            ["F-dúr", "F – A – C. Egy gyakran használt dúr akkord."]
        ]
    },
    skalak: {
        title: "🎼 Skálák",
        text: "A skála meghatározott sorrendben következő hangok sorozata.",
        sections: [
            ["C-dúr", "C – D – E – F – G – A – H – C."],
            ["A-moll", "A – H – C – D – E – F – G – A."],
            ["Gyakorlás", "Játssz el egy skálát lassan, majd fokozatosan gyorsíts."]
        ]
    },
    elmelet: {
        title: "📚 Zeneelmélet",
        text: "A zeneelmélet segít megérteni a zene felépítését.",
        sections: [
            ["Ritmus", "A hangok időbeli elrendezése."],
            ["Tempó", "A zene sebessége, BPM-ben mérjük."],
            ["Dinamika", "A zene hangerejének változása."]
        ]
    }
};

document.querySelectorAll("[data-lesson]").forEach(card => {
    card.addEventListener("click", () => {
        const lesson = lessons[card.dataset.lesson];
        const detail = document.getElementById("lesson-detail");

        detail.innerHTML = `
            <button class="primary-btn" id="lesson-back">← Vissza</button>
            <h2 style="margin-top:25px">${lesson.title}</h2>
            <p>${lesson.text}</p>
            ${lesson.sections.map(section => `
                <div class="info-box">
                    <h3>${section[0]}</h3>
                    <p>${section[1]}</p>
                </div>
            `).join("")}
        `;

        detail.classList.remove("hidden");

        document.getElementById("lesson-back").onclick = () => {
            detail.classList.add("hidden");
        };

        detail.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

// VIRTUÁLIS ZONGORA

const frequencies = {
    C4: 261.63,
    Cs4: 277.18,
    D4: 293.66,
    Ds4: 311.13,
    E4: 329.63,
    F4: 349.23,
    Fs4: 369.99,
    G4: 392,
    Gs4: 415.30,
    A4: 440,
    As4: 466.16,
    H4: 493.88,
    C5: 523.25
};

let audioContext;

document.querySelectorAll(".piano button").forEach(button => {
    button.addEventListener("click", () => {
        if (!audioContext) {
            audioContext = new AudioContext();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const frequency = frequencies[button.dataset.note];

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.8
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.8);

        document.getElementById("piano-info").textContent =
            "🎵 Lejátszott hang: " + button.dataset.note;

        button.classList.add("active");

        setTimeout(() => button.classList.remove("active"), 150);
    });
});

// ZENEI KVÍZ

const questions = [
    {
        q: "Hány alapvető hang neve van a zenei ABC-ben?",
        a: ["5", "7", "12"],
        c: 1
    },
    {
        q: "Melyik hangok alkotják a C-dúr akkordot?",
        a: ["C-E-G", "C-D-F", "A-C-E"],
        c: 0
    },
    {
        q: "Mit jelent a BPM?",
        a: ["Hangmagasság", "Percenkénti ütések", "Akkord"],
        c: 1
    },
    {
        q: "Melyik a C-dúr skála első hangja?",
        a: ["A", "G", "C"],
        c: 2
    },
    {
        q: "Milyen hangszer a gitár?",
        a: ["Ütős", "Húros", "Fúvós"],
        c: 1
    }
];

let current = 0;
let score = 0;
let answered = false;

function loadQuestion() {
    const question = questions[current];

    document.getElementById("quiz-progress").textContent =
        `${current + 1} / ${questions.length} kérdés`;

    document.getElementById("question").textContent = question.q;

    document.getElementById("quiz-result").textContent = "";

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    question.a.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;

        button.onclick = () => checkAnswer(index, button);

        answers.appendChild(button);
    });

    document.getElementById("next-question").classList.add("hidden");
    answered = false;
}

function checkAnswer(index, button) {
    if (answered) return;

    answered = true;

    const correct = questions[current].c;
    const buttons = document.querySelectorAll("#answers button");

    buttons.forEach((btn, i) => {
        btn.disabled = true;

        if (i === correct) {
            btn.style.background = "#166534";
        }
    });

    if (index === correct) {
        score++;
        document.getElementById("quiz-result").textContent =
            "🎉 Helyes válasz!";
    } else {
        document.getElementById("quiz-result").textContent =
            "❌ Nem jó! A zöld válasz a helyes.";
    }

    const next = document.getElementById("next-question");
    next.textContent = current === questions.length - 1
        ? "Eredmény megtekintése"
        : "Következő kérdés →";

    next.classList.remove("hidden");
}

document.getElementById("next-question").onclick = () => {
    if (current < questions.length - 1) {
        current++;
        loadQuestion();
    } else {
        document.getElementById("quiz-content").innerHTML = `
            <h2>🏆 Kvíz befejezve!</h2>
            <p>Eredményed: ${score} / ${questions.length}</p>
            <button class="primary-btn" id="restart">Újrapróbálom!</button>
        `;

        document.getElementById("restart").onclick = () => {
            current = 0;
            score = 0;

            document.getElementById("quiz-content").innerHTML = `
                <span id="quiz-progress"></span>
                <h2 id="question"></h2>
                <div id="answers" class="answers"></div>
                <p id="quiz-result"></p>
                <button id="next-question" class="primary-btn hidden">
                    Következő →
                </button>
            `;

            document.getElementById("next-question").onclick = nextQuiz;
            loadQuestion();
        };
    }
};

function nextQuiz() {
    if (current < questions.length - 1) {
        current++;
        loadQuestion();
    }
}

loadQuestion();