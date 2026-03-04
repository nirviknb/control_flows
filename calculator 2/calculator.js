const historyDisplay = document.getElementById('history');
const currentDisplay = document.getElementById('current');
const angleModeDisplay = document.getElementById('angle-mode');

let currentExpression = '0';
let calculated = false;
let isDegrees = false;
let lastAnswer = 0; 

let calculationHistory = [];
const ANIMATION_DURATION = 600; 

function toggleAngleMode() {
    isDegrees = !isDegrees;
    angleModeDisplay.innerText = isDegrees ? 'DEG' : 'RAD';
}

function updateDisplay() {
    currentDisplay.innerText = currentExpression;
    currentDisplay.scrollLeft = currentDisplay.scrollWidth;
}

function handleInput(buttonElement, value) {
    if (buttonElement) {
        buttonElement.classList.add('btn-active');
        setTimeout(() => buttonElement.classList.remove('btn-active'), 100);
        const petSpan = buttonElement.querySelector('.pet');
        if (petSpan) {
            petSpan.classList.add('pet-active');
            setTimeout(() => petSpan.classList.remove('pet-active'), ANIMATION_DURATION);
        }
    }

    if (value === 'AC') clearAll();
    else if (value === 'DEL') deleteLast();
    else if (value === '=') calculate();
    else appendInput(value);
}

function appendInput(value) {
    if (['Error', 'Infinity', 'NaN', 'undefined'].includes(currentExpression)) {
        currentExpression = value;
        calculated = false;
        historyDisplay.innerText = '';
        updateDisplay();
        return;
    }

    if (calculated) {
        if (/[0-9πe(]/.test(value) || value === 'ANS') {
            currentExpression = value;
        } else {
            currentExpression += value;
        }
        calculated = false;
        historyDisplay.innerText = '';
    } else {
        if (currentExpression === '0' && !/[.÷×+−^!CP]/.test(value)) {
            currentExpression = value;
        } else {
            currentExpression += value;
        }
    }
    updateDisplay();
}

function clearAll() {
    currentExpression = '0';
    historyDisplay.innerText = '';
    calculated = false;
    updateDisplay();
}

function deleteLast() {
    if (calculated) { historyDisplay.innerText = ''; calculated = false; }
    if (['Error', 'Infinity', 'NaN', 'undefined'].includes(currentExpression)) {
        currentExpression = '0'; updateDisplay(); return;
    }
    
    const removals = ['asin(', 'acos(', 'atan(', 'sin(', 'cos(', 'tan(', 'log(', 'ln(', 'ANS'];
    let removed = false;
    for (let str of removals) {
        if (currentExpression.endsWith(str)) {
            currentExpression = currentExpression.slice(0, -str.length);
            removed = true; break;
        }
    }
    if (!removed && currentExpression.endsWith('√(')) currentExpression = currentExpression.slice(0, -2);
    else if (!removed) currentExpression = currentExpression.slice(0, -1);

    if (currentExpression === '') currentExpression = '0';
    updateDisplay();
}

// --- Custom Math Functions exposed for 'eval' ---
window.customSin = (val) => isDegrees ? Math.sin(val * Math.PI / 180) : Math.sin(val);
window.customCos = (val) => isDegrees ? Math.cos(val * Math.PI / 180) : Math.cos(val);
window.customTan = (val) => isDegrees ? Math.tan(val * Math.PI / 180) : Math.tan(val);
window.customAsin = (val) => isDegrees ? Math.asin(val) * 180 / Math.PI : Math.asin(val);
window.customAcos = (val) => isDegrees ? Math.acos(val) * 180 / Math.PI : Math.acos(val);
window.customAtan = (val) => isDegrees ? Math.atan(val) * 180 / Math.PI : Math.atan(val);

window.factorial = (n) => {
    if (n < 0 || n % 1 !== 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1; for(let i = 2; i <= n; i++) res *= i;
    return res;
};
window.nCr = (n, r) => window.factorial(n) / (window.factorial(r) * window.factorial(n - r));
window.nPr = (n, r) => window.factorial(n) / window.factorial(n - r);


function calculate() {
    if (currentExpression === '0') return;

    let mathExpression = currentExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/ANS/g, lastAnswer)
        .replace(/E/g, '*10**')
        .replace(/asin\(/g, 'window.customAsin(')
        .replace(/acos\(/g, 'window.customAcos(')
        .replace(/atan\(/g, 'window.customAtan(')
        .replace(/sin\(/g, 'window.customSin(')
        .replace(/cos\(/g, 'window.customCos(')
        .replace(/tan\(/g, 'window.customTan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

    // Parse Combinations & Permutations (e.g. 5C2, 5P2)
    mathExpression = mathExpression.replace(/(\d+)C(\d+)/g, 'window.nCr($1, $2)');
    mathExpression = mathExpression.replace(/(\d+)P(\d+)/g, 'window.nPr($1, $2)');

    // Parse simple number factorials (e.g. 5!)
    mathExpression = mathExpression.replace(/(\d+)!/g, 'window.factorial($1)');

    // Implicit multiplication
    mathExpression = mathExpression
        .replace(/(\d)(Math\.|window\.|Math\.PI|Math\.E|\()/g, '$1*$2')
        .replace(/(Math\.PI|Math\.E|\))(window\.|Math\.|Math\.PI|Math\.E|\d|\()/g, '$1*$2');

    // Auto-close missing parentheses
    const openParenCount = (mathExpression.match(/\(/g) || []).length;
    const closeParenCount = (mathExpression.match(/\)/g) || []).length;
    if (openParenCount > closeParenCount) {
        const missingCount = openParenCount - closeParenCount;
        mathExpression += ')'.repeat(missingCount);
        currentExpression += ')'.repeat(missingCount); 
    }

    try {
        let result = new Function('return ' + mathExpression)();
        if (result % 1 !== 0 && !isNaN(result)) result = parseFloat(result.toFixed(10)); 

        let previousEquation = currentExpression;
        let finalResult = result.toString();

        historyDisplay.innerText = previousEquation + ' =';
        currentExpression = finalResult;
        lastAnswer = finalResult; // Save to ANS state
        calculated = true;

        addToHistory(previousEquation, finalResult);
    } catch (error) {
        historyDisplay.innerText = currentExpression;
        currentExpression = 'Error';
        calculated = true;
    }
    updateDisplay();
}

// History Functions remain identical
function addToHistory(equation, result) { calculationHistory.unshift({ eq: equation, res: result }); renderHistory(); }
function renderHistory() {
    const list = document.getElementById('history-list'); list.innerHTML = ''; 
    if (calculationHistory.length === 0) { list.innerHTML = '<p style="color: rgba(255,255,255,0.4); text-align: center; margin-top: 20px;">No history yet</p>'; return; }
    calculationHistory.forEach(item => {
        const div = document.createElement('div'); div.className = 'history-record';
        div.onclick = () => loadFromHistory(item.res);
        div.innerHTML = `<div class="eq">${item.eq} =</div><div class="res">${item.res}</div>`;
        list.appendChild(div);
    });
}
function toggleHistory() {
    const panel = document.getElementById('history-panel'); panel.classList.toggle('show');
    if(panel.classList.contains('show')) renderHistory();
}
function clearHistory() { calculationHistory = []; renderHistory(); }
function loadFromHistory(resultValue) {
    currentExpression = resultValue; calculated = true; 
    historyDisplay.innerText = 'Loaded from history'; updateDisplay(); toggleHistory(); 
}

// Keyboard mapping
const keyMap = {
    '0': 'num0', '1': 'num1', '2': 'num2', '3': 'num3', '4': 'num4', '5': 'num5', '6': 'num6', '7': 'num7', '8': 'num8', '9': 'num9',
    '.': 'dot', '+': 'add', '-': 'sub', '*': 'mul', '/': 'div', '^': 'pow', '(': 'lpar', ')': 'rpar',
    'Enter': 'eq', '=': 'eq', 'Backspace': 'del', 'Escape': 'ac', 'h': 'history-toggle' 
};

document.addEventListener('keydown', (event) => {
    const key = event.key; const lowerKey = key.toLowerCase();
    if (document.getElementById('history-panel').classList.contains('show') && key !== 'Escape' && lowerKey !== 'h') return; 
    const buttonId = keyMap[key] || keyMap[lowerKey];
    if (lowerKey === 'h') { toggleHistory(); return; }
    if (key === 'Escape' && document.getElementById('history-panel').classList.contains('show')) { toggleHistory(); return; }

    if (buttonId) {
        event.preventDefault(); const targetButton = document.getElementById(buttonId);
        let mathVal = {'*': '×', '/': '÷', '-': '−'}[key] || key;
        if (key === 'Enter') mathVal = '='; if (key === 'Escape') mathVal = 'AC'; if (key === 'Backspace') mathVal = 'DEL';
        if (targetButton) handleInput(targetButton, mathVal);
    }
});

renderHistory();