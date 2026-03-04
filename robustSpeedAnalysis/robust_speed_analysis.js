const textBank = [
    "The juxtaposition of absurd realities creates a complex narrative structure.",
    "Cryptographic protocols ensure the integrity of decentralized ledger systems.",
    "Quantum entanglement suggests that particles remain connected across vast distances.",
    "Synchronizing asynchronous requests requires deep understanding of event loops.",
    "The phenomenon of photosynthesis converts solar energy into chemical bonds.",
    "Heuristic algorithms provide approximate solutions to NP-hard computational problems.",
    "Ecological biodiversity is essential for maintaining global atmospheric stability.",
    "Architectural paradigms shift rapidly in the era of cloud-native development.",
    "Subdermal implants might bridge the gap between biological and digital cognition.",
    "The quick brown fox jumps over the lazy dog while the sun sets slowly.",
    "Navigating a labyrinth requires both spatial awareness and logical deduction.",
    "Philosophical inquiries into the nature of consciousness often yield paradoxes.",
    "Microservice orchestration simplifies the deployment of massive applications.",
    "Cybernetic enhancements could redefine the boundaries of human performance.",
    "Atmospheric pressure decreases exponentially with increasing altitude levels.",
    "The intermittent nature of renewable energy sources poses storage challenges.",
    "Parallel processing architectures significantly reduce total execution time.",
    "Data encapsulation is a fundamental principle of object-oriented programming.",
    "Linguistic relativity suggests language shapes our perception of the world.",
    "The thermodynamic laws dictate the flow of energy within a closed system."
];

let timeLeft = 30;
let timer = null;
let currentSentence = "";
let totalCorrectWords = 0;
let isRunning = false;

// DOM Elements
const textDisplay = document.getElementById('textDisplay');
const userInput = document.getElementById('userInput');
const timerSpan = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');

// Time Selection
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        timeLeft = parseInt(this.dataset.time);
        timerSpan.innerText = timeLeft + "s";
    });
});

function loadNewSentence() {
    const randomIndex = Math.floor(Math.random() * textBank.length);
    currentSentence = textBank[randomIndex];
    textDisplay.innerHTML = "";
    currentSentence.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        textDisplay.appendChild(span);
    });
    userInput.value = "";
}

function startTest() {
    if (isRunning) return;
    isRunning = true;
    totalCorrectWords = 0;
    
    startBtn.disabled = true;
    userInput.disabled = false;
    userInput.focus();
    
    loadNewSentence();
    
    const initialTime = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerSpan.innerText = timeLeft + "s";
        
        if (timeLeft <= 0) {
            endTest(initialTime);
        }
    }, 1000);
}

userInput.addEventListener('input', () => {
    const charSpans = textDisplay.querySelectorAll('span');
    const inputValue = userInput.value.split('');
    
    let isAllCorrect = true;
    charSpans.forEach((span, i) => {
        const char = inputValue[i];
        if (char == null) {
            span.className = "";
            isAllCorrect = false;
        } else if (char === span.innerText) {
            span.className = "correct";
        } else {
            span.className = "incorrect";
            isAllCorrect = false;
        }
    });

    // If sentence finished correctly, add to word count and load next
    if (userInput.value === currentSentence) {
        const words = currentSentence.split(' ').length;
        totalCorrectWords += words;
        loadNewSentence();
    }
});

function endTest(totalTime) {
    clearInterval(timer);
    isRunning = false;
    userInput.disabled = true;
    
    // Final WPM Calculation: Correct Words / (Time in Minutes)
    const minutes = totalTime / 60;
    const finalWpm = Math.round(totalCorrectWords / minutes);
    
    document.getElementById('resultModal').style.display = 'flex';
    document.getElementById('finalStats').innerHTML = `
        <p style="font-size: 3rem; color: #ffff00;">${finalWpm} WPM</p>
        <p>TOTAL CORRECT WORDS: ${totalCorrectWords}</p>
    `;
}

function resetTest() {
    location.reload();
}