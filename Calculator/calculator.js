const historyDisplay = document.getElementById('history');
const currentDisplay = document.getElementById('current');
let currentExpression = '0';
let calculated = false;

// Time in ms for the animation/flash state
const ANIMATION_DURATION = 600; // matching CSS animation-duration

function updateDisplay() {
    currentDisplay.innerText = currentExpression;
    // Auto-scroll long equations to the right
    currentDisplay.scrollLeft = currentDisplay.scrollWidth;
}

// --- Combined Input Handler for Visuals & Math ---
// buttonElement: the 'this' object from HTML, representing the DOM element
// value: the mathematical value to process
function handleInput(buttonElement, value) {
    // 1. Trigger Visuals (Animation + subtle state flash)
    if (buttonElement) {
        // Trigger the flash state temporarily
        buttonElement.classList.add('btn-active');
        setTimeout(() => buttonElement.classList.remove('btn-active'), 100);

        // Find the specific pet <span> inside this button
        const petSpan = buttonElement.querySelector('.pet');
        if (petSpan) {
            // Add the animation class
            petSpan.classList.add('pet-active');
            // Remove it after the animation completes so it can be re-triggered
            setTimeout(() => {
                petSpan.classList.remove('pet-active');
            }, ANIMATION_DURATION);
        }
    }

    // 2. Trigger Math Logic based on value type
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

// Original Math Functions (minor tweaks to manage internal state)
function appendInput(value) {
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

    try {
        let result = new Function('return ' + mathExpression)();
        
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(8)); 
        }

        historyDisplay.innerText = currentExpression + ' =';
        currentExpression = result.toString();
        calculated = true;
    } catch (error) {
        historyDisplay.innerText = currentExpression;
        currentExpression = 'Error';
        calculated = true;
    }
    updateDisplay();
}

// --- Updated Keyboard Support to pass button DOM elements ---
// Map keyboard keys to the IDs defined in the HTML
const keyMap = {
    '0': 'num0', '1': 'num1', '2': 'num2', '3': 'num3', '4': 'num4',
    '5': 'num5', '6': 'num6', '7': 'num7', '8': 'num8', '9': 'num9',
    '.': 'dot', '+': 'add', '-': 'sub', '*': 'mul', '/': 'div',
    '^': 'pow', '(': 'lpar', ')': 'rpar',
    'Enter': 'eq', '=': 'eq',
    'Backspace': 'del', 'Escape': 'ac',
    // Shortcut keys for sci functions
    'p': 'pi', 's': 'sin', 'c': 'cos', 't': 'tan',
    'l': 'log', 'n': 'ln', 'r': 'sqrt'
};

// Map mathematical input value associated with the key (if different from visual button value)
const mathValueMap = {
    '*': '×', '/': '÷', '-': '−'
};

document.addEventListener('keydown', (event) => {
    const key = event.key;
    const buttonId = keyMap[key];

    // Check if the pressed key is mapped to an on-screen button
    if (buttonId) {
        event.preventDefault(); // Stop scrolling/back browser actions
        const targetButton = document.getElementById(buttonId);
        
        // Find the math value to pass to handleInput.
        // It's usually the key itself, but we need the translated symbols for operators.
        let mathVal = mathValueMap[key] || key;

        // Special case logic for shortcut keys, map them back to standard input
        if (key === 'Enter') mathVal = '=';
        if (key === 'Escape') mathVal = 'AC';
        if (key === 'Backspace') mathVal = 'DEL';
        if (key.toLowerCase() === 'p') mathVal = 'π';
        if (key.toLowerCase() === 's') mathVal = 'sin(';
        if (key.toLowerCase() === 'c') mathVal = 'cos(';
        if (key.toLowerCase() === 't') mathVal = 'tan(';
        if (key.toLowerCase() === 'l') mathVal = 'log(';
        if (key.toLowerCase() === 'n') mathVal = 'ln(';
        if (key.toLowerCase() === 'r') mathVal = '√(';

        if (targetButton) {
            // Trigger both the visuals and the math logic
            handleInput(targetButton, mathVal);
        }
    }
});