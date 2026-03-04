const textBanks = {
    easy: [
        "The cat sat on the mat.",
        "I like to eat apples.",
        "She runs very fast.",
        "The sun is bright.",
        "I love to read books.",
        "The dog plays in the park.",
        "Birds sing in the morning.",
        "He drives a blue car.",
        "The sky is blue today.",
        "I drink coffee every day."
    ],
    medium: [
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
    ],
    hard: [
        "Metamorphic transformations in crystalline lattice structures exhibit nonlinear thermodynamic behavior.",
        "Superconductivity emerges through quantum statistical mechanics governing fermionic systems.",
        "Polychromatic aberrations in telescopic instrumentation necessitate sophisticated computational algorithms.",
        "Paleontological stratigraphic analysis elucidates macroevolutionary mechanisms across geological epochs.",
        "Neurotransmitter dysregulation precipitates pathophysiological cascades manifesting as psychiatric pathologies.",
        "Geopolitical hegemonic structures fundamentally constrain macroeconomic policy implementations.",
        "Photoluminescent nanoparticles enable unprecedented biomedical diagnostic methodologies.",
        "Epistemological frameworks necessitate rigorous interdisciplinary phenomenological investigations.",
        "Syntactic ambiguities in natural language processing present intractable computational challenges.",
        "Seismological analysis of tectonic plate interactions predicts catastrophic geological phenomena."
    ]
};

let timeLeft = 30;
let timer = null;
let currentSentence = "";
let totalCorrectWords = 0;
let totalTypedChars = 0;
let totalCorrectChars = 0;
let isRunning = false;
let isPaused = false;
let startTime = 0;
let selectedDifficulty = "medium";
let testStartTime = 0;

const textDisplay = document.getElementById('textDisplay');
const userInput = document.getElementById('userInput');
const timerSpan = document.getElementById('timer');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const historyList = document.getElementById('historyList');

// Time Selection Logic
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (isRunning) return;
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        timeLeft = parseInt(this.dataset.time);
        timerSpan.innerText = timeLeft + "s";
    });
});

// Difficulty Selection Logic
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (isRunning) return;
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedDifficulty = this.dataset.difficulty;
    });
});

function loadNewSentence() {
    const currentTextBank = textBanks[selectedDifficulty];
    const randomIndex = Math.floor(Math.random() * currentTextBank.length);
    currentSentence = currentTextBank[randomIndex];
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
    isPaused = false;
    totalCorrectWords = 0;
    totalTypedChars = 0;
    totalCorrectChars = 0;
    const initialTime = timeLeft;
    testStartTime = Date.now();
    
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    pauseBtn.innerText = 'PAUSE';
    userInput.disabled = false;
    userInput.focus();
    
    // Disable difficulty and time selectors
    document.querySelectorAll('.mode-btn, .difficulty-btn').forEach(btn => btn.disabled = true);
    
    loadNewSentence();
    
    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerSpan.innerText = timeLeft + "s";
            
            // Real-time WPM Calculation
            let timeElapsed = (initialTime - timeLeft) / 60;
            if (timeElapsed > 0) {
                wpmSpan.innerText = Math.round(totalCorrectWords / timeElapsed);
            }

            if (timeLeft <= 0) {
                endTest(initialTime);
            }
        }
    }, 1000);
}

function togglePause() {
    if (!isRunning) return;
    
    isPaused = !isPaused;
    userInput.disabled = isPaused;
    pauseBtn.innerText = isPaused ? 'RESUME' : 'PAUSE';
    
    if (!isPaused) {
        userInput.focus();
    }
}

userInput.addEventListener('input', () => {
    const charSpans = textDisplay.querySelectorAll('span');
    const inputValue = userInput.value.split('');
    
    totalTypedChars = inputValue.length;
    totalCorrectChars = 0;
    
    charSpans.forEach((span, i) => {
        const char = inputValue[i];
        if (char == null) {
            span.className = "";
        } else if (char === span.innerText) {
            span.className = "correct";
            totalCorrectChars++;
        } else {
            span.className = "incorrect";
        }
    });

    // Update accuracy display
    let accuracy = totalTypedChars > 0 ? Math.round((totalCorrectChars / totalTypedChars) * 100) : 100;
    accuracySpan.innerText = accuracy + "%";

    // DEBUGGED: Check if sentence is finished (using trim to handle trailing spaces)
    if (userInput.value.trim() === currentSentence) {
        const words = currentSentence.split(' ').length;
        totalCorrectWords += words;
        loadNewSentence();
    }
});

function endTest(totalTime) {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    userInput.disabled = true;
    pauseBtn.style.display = 'none';
    startBtn.style.display = 'inline-block';
    
    // Re-enable selectors
    document.querySelectorAll('.mode-btn, .difficulty-btn').forEach(btn => btn.disabled = false);
    
    const minutes = totalTime / 60;
    const finalWpm = Math.round(totalCorrectWords / minutes);
    const finalAccuracy = totalTypedChars > 0 ? Math.round((totalCorrectChars / totalTypedChars) * 100) : 100;
    
    // Save test result to localStorage
    saveTestResult({
        wpm: finalWpm,
        accuracy: finalAccuracy,
        words: totalCorrectWords,
        difficulty: selectedDifficulty,
        time: totalTime,
        timestamp: new Date().toLocaleString()
    });
    
    // Display results
    document.getElementById('resultModal').style.display = 'flex';
    document.getElementById('finalStats').innerHTML = `
        <div class="stat-circle">${finalWpm}<span>WPM</span></div>
        <p>Accuracy: ${finalAccuracy}%</p>
        <p>Correct Words: ${totalCorrectWords}</p>
        <p>Difficulty: ${selectedDifficulty.toUpperCase()}</p>
    `;
    
    // Refresh history display
    displayTestHistory();
}

function resetTest() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    timeLeft = 30;
    totalCorrectWords = 0;
    totalTypedChars = 0;
    totalCorrectChars = 0;
    
    // Reset UI
    userInput.value = "";
    userInput.disabled = true;
    timerSpan.innerText = "30s";
    wpmSpan.innerText = "0";
    accuracySpan.innerText = "100%";
    textDisplay.innerText = "Select time and press Start to begin...";
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    
    document.getElementById('resultModal').style.display = 'none';
    document.querySelectorAll('.mode-btn, .difficulty-btn').forEach(btn => btn.disabled = false);
}

// localStorage Functions
function saveTestResult(result) {
    let history = JSON.parse(localStorage.getItem('typingTestHistory')) || [];
    history.unshift(result); // Add to beginning
    history = history.slice(0, 10); // Keep only last 10 tests
    localStorage.setItem('typingTestHistory', JSON.stringify(history));
}

function displayTestHistory() {
    const history = JSON.parse(localStorage.getItem('typingTestHistory')) || [];
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="no-history">No tests yet. Start typing!</p>';
        document.getElementById('clearHistoryBtn').style.display = 'none';
        return;
    }
    
    document.getElementById('clearHistoryBtn').style.display = 'inline-block';
    
    historyList.innerHTML = history.map((test, index) => `
        <div class="history-item">
            <div class="history-rank">#${index + 1}</div>
            <div class="history-details">
                <span class="history-wpm">${test.wpm} WPM</span>
                <span class="history-acc">${test.accuracy}% ACC</span>
                <span class="history-difficulty">${test.difficulty.toUpperCase()}</span>
                <span class="history-time">${test.timestamp}</span>
            </div>
        </div>
    `).join('');
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all test history?')) {
        localStorage.removeItem('typingTestHistory');
        displayTestHistory();
    }
}

// Load history on page load
window.addEventListener('load', displayTestHistory);
