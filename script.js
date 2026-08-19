/ ==========================
// Quiz Data (10 Questions)
// ==========================
const quizData = [{
        question: "What does HTML stand for?",
        options: [
            "Hyper Trainer Marking Language",
            "Hyper Text Markup Language",
            "Hyper Text Marketing Language",
            "Hyper Text Markup Leveler"
        ],
        answer: 1
    },
    {
        question: "Which CSS property is used to change the text color?",
        options: ["font-color", "text-color", "color", "foreground-color"],
        answer: 2
    },
    {
        question: "Which of the following is not a JavaScript data type?",
        options: ["Number", "Boolean", "Character", "Undefined"],
        answer: 2
    },
    {
        question: "Which HTML tag is used to link an external CSS file?",
        options: ["<style>", "<css>", "<link>", "<script>"],
        answer: 2
    },
    {
        question: "Which method is used to add an element at the end of an array in JavaScript?",
        options: ["push()", "append()", "addToEnd()", "insert()"],
        answer: 0
    },
    {
        question: "Which CSS layout module is used for building responsive grids easily?",
        options: ["Flexbox only", "CSS Grid", "Float", "Table"],
        answer: 1
    },
    {
        question: "What is the correct syntax for a JavaScript arrow function?",
        options: [
            "function => (x) { return x }",
            "(x) => { return x }",
            "x -> { return x }",
            "arrow (x) { return x }"
        ],
        answer: 1
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        options: ["class", "font", "style", "styles"],
        answer: 2
    },
    {
        question: "Which JavaScript keyword declares a variable that cannot be reassigned?",
        options: ["var", "let", "const", "static"],
        answer: 2
    },
    {
        question: "Which CSS property controls the spacing between lines of text?",
        options: ["line-height", "text-spacing", "letter-spacing", "word-spacing"],
        answer: 0
    }
];

// ==========================
// State
// ==========================
let currentIndex = 0;
let userAnswers = new Array(quizData.length).fill(null); // null = unattempted, "skipped" = skipped, or option index

// ==========================
// DOM References
// ==========================
const questionCounter = document.getElementById("question-counter");
const scoreLive = document.getElementById("score-live");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const submitBtn = document.getElementById("submit-btn");

const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const resultEmoji = document.getElementById("result-emoji");
const performanceMessage = document.getElementById("performance-message");
const totalScoreEl = document.getElementById("total-score");
const percentageScoreEl = document.getElementById("percentage-score");
const correctCountEl = document.getElementById("correct-count");
const wrongCountEl = document.getElementById("wrong-count");
const skippedCountEl = document.getElementById("skipped-count");
const restartBtn = document.getElementById("restart-btn");

// ==========================
// Render Question
// ==========================
function loadQuestion() {
    const currentQuestion = quizData[currentIndex];
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((optionText, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = optionText;

        // Highlight if this question was already answered
        const userAnswer = userAnswers[currentIndex];
        if (userAnswer === index) {
            btn.classList.add("selected");
        }

        btn.addEventListener("click", () => selectAnswer(index));
        optionsContainer.appendChild(btn);
    });

    updateCounter();
    updateProgressBar();
    updateLiveScore();
    updateNavButtons();
}

// ==========================
// Select Answer
// ==========================
function selectAnswer(optionIndex) {
    userAnswers[currentIndex] = optionIndex;
    loadQuestion();
}

// ==========================
// Navigation
// ==========================
function goNext() {
    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        loadQuestion();
    }
}

function goPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion();
    }
}

function skipQuestion() {
    if (userAnswers[currentIndex] === null) {
        userAnswers[currentIndex] = "skipped";
    }
    goNext();
}

function updateNavButtons() {
    prevBtn.disabled = currentIndex === 0;

    const isLastQuestion = currentIndex === quizData.length - 1;
    nextBtn.classList.toggle("hidden", isLastQuestion);
    submitBtn.classList.toggle("hidden", !isLastQuestion);
    skipBtn.classList.toggle("hidden", isLastQuestion && userAnswers[currentIndex] !== null);
}

// ==========================
// Progress + Counters
// ==========================
function updateCounter() {
    questionCounter.textContent = `Question ${currentIndex + 1} of ${quizData.length}`;
}

function updateProgressBar() {
    const progress = ((currentIndex + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateLiveScore() {
    let score = 0;
    userAnswers.forEach((ans, i) => {
        if (typeof ans === "number" && ans === quizData[i].answer) {
            score++;
        }
    });
    scoreLive.textContent = `Score: ${score}`;
}

// ==========================
// Submit Quiz
// ==========================
submitBtn.addEventListener("click", () => {
    showResults();
});

function showResults() {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    userAnswers.forEach((ans, i) => {
        if (ans === "skipped" || ans === null) {
            skipped++;
        } else if (ans === quizData[i].answer) {
            correct++;
        } else {
            wrong++;
        }
    });

    const total = quizData.length;
    const percentage = Math.round((correct / total) * 100);

    totalScoreEl.textContent = `${correct}/${total}`;
    percentageScoreEl.textContent = `${percentage}%`;
    correctCountEl.textContent = correct;
    wrongCountEl.textContent = wrong;
    skippedCountEl.textContent = skipped;

    // Performance message + emoji
    let message = "";
    let emoji = "";

    if (percentage === 100) {
        message = "Perfect score! You're a genius!";
        emoji = "🏆";
    } else if (percentage >= 80) {
        message = "Excellent work! You really know your stuff!";
        emoji = "🎉";
    } else if (percentage >= 60) {
        message = "Good job! Solid performance!";
        emoji = "👍";
    } else if (percentage >= 40) {
        message = "Not bad, but there's room for improvement.";
        emoji = "🙂";
    } else if (percentage >= 20) {
        message = "Keep practicing, you'll get better!";
        emoji = "💪";
    } else {
        message = "Don't give up! Try again to improve your score.";
        emoji = "😅";
    }

    performanceMessage.textContent = message;
    resultEmoji.textContent = emoji;

    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
}

// ==========================
// Restart Quiz
// ==========================
function restartQuiz() {
    currentIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    loadQuestion();
}

// ==========================
// Event Listeners
// ==========================
nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);
skipBtn.addEventListener("click", skipQuestion);
restartBtn.addEventListener("click", restartQuiz);

// ==========================
// Init
// ==========================
loadQuestion();