// =========================================================================
// LÓGICA INTERACTIVA DEL ROBOT NUTRIBOT (BASADA EN EL MANUAL Y MAKECODE)
// =========================================================================

const nutritiveList = [
    'lechuga',
    'tomate',
    'carne al horno',
    'pollo al horno',
    'manzana',
    'pera',
    'naranja',
    'banana',
    'choclo',
    'agua'
];

const nonNutritiveList = [
    'milanesa',
    'grasa',
    'gaseosa',
    'papas fritas',
    'golosinas',
    'hamburguesa',
    'caramelo',
    'alfajor'
];

let typedBuffer = 'tomate';

const lcdLine1 = document.getElementById('lcdLine1');
const lcdLine2 = document.getElementById('lcdLine2');
const ledGreen = document.getElementById('ledGreen');
const ledRed = document.getElementById('ledRed');
const ledYellow = document.getElementById('ledYellow');

// Evalúa el alimento ingresado y enciende P0 (Verde), P1 (Rojo) o P2 (Amarillo)
function evaluateFoodItem(foodText) {
    const clean = foodText.toLowerCase().trim();
    typedBuffer = clean;
    lcdLine1.textContent = '>> ' + (clean || '_');

    ledGreen.classList.remove('active');
    ledRed.classList.remove('active');
    ledYellow.classList.remove('active');

    if (!clean) {
        lcdLine2.textContent = 'INGRESE ALIMENTO';
        lcdLine2.style.color = '#4eff56';
        return;
    }

    if (nutritiveList.includes(clean)) {
        ledGreen.classList.add('active');
        lcdLine2.textContent = 'NUTRITIVO';
        lcdLine2.style.color = '#4eff56';
    } else if (nonNutritiveList.includes(clean)) {
        ledRed.classList.add('active');
        lcdLine2.textContent = 'NO NUTRITIVO';
        lcdLine2.style.color = '#ff6b6b';
    } else {
        ledYellow.classList.add('active');
        lcdLine2.textContent = 'desconocido';
        lcdLine2.style.color = '#fde047';
    }
}

function updateTypingPreview() {
    lcdLine1.textContent = '>> ' + (typedBuffer || '_');
    lcdLine2.textContent = 'PULSA ENTER...';
    lcdLine2.style.color = '#86efac';
    ledGreen.classList.remove('active');
    ledRed.classList.remove('active');
    ledYellow.classList.remove('active');
}

function handleRobotKey(key) {
    if (key === 'ENTER') {
        evaluateFoodItem(typedBuffer);
    } else if (key === 'BACK') {
        typedBuffer = typedBuffer.slice(0, -1);
        updateTypingPreview();
    } else {
        if (typedBuffer.length < 16) {
            typedBuffer += key.toLowerCase();
            updateTypingPreview();
        }
    }
}

function quickTestFood(foodName) {
    evaluateFoodItem(foodName);
}

document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelectorAll('.kb-key');
    keys.forEach(btn => {
        btn.addEventListener('click', () => {
            const keyVal = btn.getAttribute('data-key');
            if (lcdLine2.textContent !== 'PULSA ENTER...' && keyVal !== 'ENTER' && keyVal !== 'BACK') {
                typedBuffer = '';
            }
            handleRobotKey(keyVal);
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            handleRobotKey('ENTER');
        } else if (e.key === 'Backspace') {
            handleRobotKey('BACK');
        } else if (e.key === ' ') {
            e.preventDefault();
            handleRobotKey(' ');
        } else if (e.key.length === 1 && /[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(e.key)) {
            if (lcdLine2.textContent !== 'PULSA ENTER...') {
                typedBuffer = '';
            }
            handleRobotKey(e.key.toUpperCase());
        }
    });

    const btnMicroA = document.getElementById('btnMicroA');
    const btnMicroB = document.getElementById('btnMicroB');

    if (btnMicroA) {
        btnMicroA.addEventListener('click', () => evaluateFoodItem('lechuga'));
    }

    if (btnMicroB) {
        btnMicroB.addEventListener('click', () => evaluateFoodItem('gaseosa'));
    }

    const sensorTrigger = () => {
        typedBuffer = '';
        lcdLine1.textContent = '>> PLATO CERCA';
        lcdLine2.textContent = 'ESCRIBA COMIDA';
        lcdLine2.style.color = '#38bdf8';
        ledGreen.classList.remove('active');
        ledRed.classList.remove('active');
        ledYellow.classList.remove('active');
    };

    const btnSensorSim = document.getElementById('btnSensorSim');
    const ultrasonicHead = document.getElementById('ultrasonicSensor');
    if (btnSensorSim) btnSensorSim.addEventListener('click', sensorTrigger);
    if (ultrasonicHead) ultrasonicHead.addEventListener('click', sensorTrigger);
});