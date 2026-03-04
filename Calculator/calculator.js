const historyDisplay = document.getElementById('history');
const currentDisplay = document.getElementById('current');
let currentExpression = '0';
let calculated = false;

// --- History State Array ---
let calculationHistory = [];
const ANIMATION_DURATION = 600; 

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
            setTimeout(() => {
                petSpan.classList.remove('pet-active');
            }, ANIMATION_DURATION);
        }
    }

    if (value === 'AC') {
        clearAll();
    } else if (value === 'DEL') {
        deleteLast();
    } else if (value === '=') {
        calculate();
    } else {
        appendInput(value);
    }
}

function appendInput(value) {
    // FIX: Overwrite text-based error states entirely instead of appending
    if (['Error', 'Infinity', 'NaN', 'undefined'].includes(currentExpression)) {
        currentExpression = value;
        calculated = false;
        historyDisplay.innerText = '';
        updateDisplay();
        return;
    }

    if (calculated) {
        if (/[0-9π(]/.test(value)) {
            currentExpression = value;
        } else {
            currentExpression += value;
        }
        calculated = false;
        historyDisplay.innerText = '';
    } else {
        if (currentExpression === '0' && !/[.÷×+−^]/.test(value)) {
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
    if (calculated) {
        historyDisplay.innerText = '';
        calculated = false;
    }

    // FIX: Reset immediately if the string is a text error state
    if (['Error', 'Infinity', 'NaN', 'undefined'].includes(currentExpression)) {
        currentExpression = '0';
        updateDisplay();
        return;
    }
    
    if (currentExpression.endsWith('sin(') || currentExpression.endsWith('cos(') || currentExpression.endsWith('tan(') || currentExpression.endsWith('log(')) {
        currentExpression = currentExpression.slice(0, -4);
    } else if (currentExpression.endsWith('ln(')) {
        currentExpression = currentExpression.slice(0, -3);
    } else if (currentExpression.endsWith('√(')) {
        currentExpression = currentExpression.slice(0, -2);
    } else {
        currentExpression = currentExpression.slice(0, -1);
    }

    if (currentExpression === '') currentExpression = '0';
    updateDisplay();
}

function calculate() {
    if (currentExpression === '0') return;

    let mathExpression = currentExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/π/g, 'Math.PI')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

    // FIX: Add implicit multiplication (e.g., 2π -> 2*Math.PI, 5(2) -> 5*(2))
    mathExpression = mathExpression
        .replace(/(\d)(Math\.|Math\.PI|\()/g, '$1*$2')
        .replace(/(Math\.PI|\))(Math\.|Math\.PI|\d|\()/g, '$1*$2');

    // FIX: Auto-close missing parentheses
    const openParenCount = (mathExpression.match(/\(/g) || []).length;
    const closeParenCount = (mathExpression.match(/\)/g) || []).length;
    
    if (openParenCount > closeParenCount) {
        const missingCount = openParenCount - closeParenCount;
        mathExpression += ')'.repeat(missingCount);
        currentExpression += ')'.repeat(missingCount); 
    }

    try {
        let result = new Function('return ' + mathExpression)();
        
        if (result % 1 !== 0 && !isNaN(result)) {
            result = parseFloat(result.toFixed(8)); 
        }

        let previousEquation = currentExpression;
        let finalResult = result.toString();

        historyDisplay.innerText = previousEquation + ' =';
        currentExpression = finalResult;
        calculated = true;

        addToHistory(previousEquation, finalResult);

    } catch (error) {
        historyDisplay.innerText = currentExpression;
        currentExpression = 'Error';
        calculated = true;
    }
    updateDisplay();
}

// =========================================
// --- HISTORY LOGIC FUNCTIONS ---
// =========================================

function addToHistory(equation, result) {
    calculationHistory.unshift({ eq: equation, res: result });
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = ''; 

    if (calculationHistory.length === 0) {
        list.innerHTML = '<p style="color: rgba(255,255,255,0.4); text-align: center; margin-top: 20px;">No history yet</p>';
        return;
    }

    calculationHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-record';
        div.onclick = () => loadFromHistory(item.res);
        div.innerHTML = `
            <div class="eq">${item.eq} =</div>
            <div class="res">${item.res}</div>
        `;
        list.appendChild(div);
    });
}

function toggleHistory() {
    const panel = document.getElementById('history-panel');
    panel.classList.toggle('show');
    if(panel.classList.contains('show')) {
        renderHistory();
    }
}

function clearHistory() {
    calculationHistory = [];
    renderHistory();
}

function loadFromHistory(resultValue) {
    currentExpression = resultValue;
    calculated = true; 
    historyDisplay.innerText = 'Loaded from history';
    updateDisplay();
    toggleHistory(); 
}

// =========================================
// --- KEYBOARD SUPPORT ---
// =========================================
const keyMap = {
    '0': 'num0', '1': 'num1', '2': 'num2', '3': 'num3', '4': 'num4',
    '5': 'num5', '6': 'num6', '7': 'num7', '8': 'num8', '9': 'num9',
    '.': 'dot', '+': 'add', '-': 'sub', '*': 'mul', '/': 'div',
    '^': 'pow', '(': 'lpar', ')': 'rpar',
    'Enter': 'eq', '=': 'eq',
    'Backspace': 'del', 'Escape': 'ac',
    'p': 'pi', 's': 'sin', 'c': 'cos', 't': 'tan',
    'l': 'log', 'n': 'ln', 'r': 'sqrt',
    'h': 'history-toggle' 
};

const mathValueMap = {
    '*': '×', '/': '÷', '-': '−'
};

document.addEventListener('keydown', (event) => {
    const key = event.key;
    const lowerKey = key.toLowerCase();

    // FIX: Guard logic is now case-insensitive
    if (document.getElementById('history-panel').classList.contains('show') && key !== 'Escape' && lowerKey !== 'h') {
        return; 
    }

    // FIX: Map check defaults to lowercase fallback
    const buttonId = keyMap[key] || keyMap[lowerKey];

    if (lowerKey === 'h') {
        toggleHistory();
        return;
    }

    if (key === 'Escape' && document.getElementById('history-panel').classList.contains('show')) {
        toggleHistory();
        return;
    }

    if (buttonId) {
        event.preventDefault(); 
        const targetButton = document.getElementById(buttonId);
        
        let mathVal = mathValueMap[key] || key;

        if (key === 'Enter') mathVal = '=';
        if (key === 'Escape') mathVal = 'AC';
        if (key === 'Backspace') mathVal = 'DEL';
        
        // FIX: Replaced to match lowercase variants
        if (lowerKey === 'p') mathVal = 'π';
        if (lowerKey === 's') mathVal = 'sin(';
        if (lowerKey === 'c') mathVal = 'cos(';
        if (lowerKey === 't') mathVal = 'tan(';
        if (lowerKey === 'l') mathVal = 'log(';
        if (lowerKey === 'n') mathVal = 'ln(';
        if (lowerKey === 'r') mathVal = '√(';

        if (targetButton) {
            handleInput(targetButton, mathVal);
        }
    }
});

// Initialize empty history text on load
renderHistory();
