/*
    REFS:
    https://www.geeksforgeeks.org/sorting-algorithms/
*/
// 1. Prerequisites
const ALGS = {
    1: new BubbleSort(),
    2: new QuickSort(),
    3: new HeapSort(),
};

// Toolbar controls
const ARRAY_LEN_INPUT = document.getElementById('array_len_input');
const ARRAY_LEN_RANGE = document.getElementById('array_len_range');
const GENERATE_BTN = document.getElementById('generate_btn');
const ALG_SELECTOR = document.getElementById('alg_select');
const START_BTN = document.getElementById('start_btn');

// Array
const ARRAY_CONTAINER = document.getElementById('array_container');

const STATE = {
    minLength: 5,
    maxLength: 100,
    arrayLength: 100,
    sortInProgress: false,
    array: [],
    minValue: 0,
    maxValue: 100,
};

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

// 2. Initialization

// Array length
ARRAY_LEN_INPUT.setAttribute('min', STATE.minLength);
ARRAY_LEN_INPUT.setAttribute('max', STATE.maxLength);

ARRAY_LEN_RANGE.setAttribute('min', STATE.minLength);
ARRAY_LEN_RANGE.setAttribute('max', STATE.maxLength);

ARRAY_LEN_INPUT.value = STATE.arrayLength;
ARRAY_LEN_RANGE.value = STATE.arrayLength;

ARRAY_LEN_INPUT.addEventListener('input', e => {
    ARRAY_LEN_RANGE.value = e.target.value;
    STATE.arrayLength = e.target.value;
    generateArray();
})

ARRAY_LEN_RANGE.addEventListener('input', e => {
    ARRAY_LEN_INPUT.value = e.target.value;
    STATE.arrayLength = e.target.value;
    generateArray();
})

// Generate Array button
GENERATE_BTN.addEventListener('click', () => generateArray());

function generateArray(length = STATE.arrayLength) {
    if (STATE.array.length) {
        ARRAY_CONTAINER.innerHTML = '';
        STATE.array = [];
    }

    for (let i = 0; i < length; ++i) {
        const value = rnd(STATE.minValue, STATE.maxValue);

        STATE.array.push(new ArrayItem({
            value,
            container: ARRAY_CONTAINER,
            h: value * 97 / STATE.maxValue + 3,
            w: 100 / STATE.arrayLength,
        }));
    }
}

// Algorithm select
Object.keys(ALGS).forEach((key) => {
    const algorithm = ALGS[key];

    const option = document.createElement('option')
    option.value = key;
    option.innerText = algorithm.name;

    ALG_SELECTOR.appendChild(option);
});

// Start button
START_BTN.addEventListener('click', () => {
    start();
});

function start() {
    STATE.sortInProgress = true;

    const algId = ALG_SELECTOR.value;
    const alg = ALGS[algId];

    alg.sort(STATE.array, { interval: 0 });
}

function pause() {
    STATE.sortInProgress = false;
    // TODO...
}

// ===
// ===
// BEGIN
// ===
// ===

generateArray();
