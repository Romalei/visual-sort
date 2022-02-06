/*
    REFS:
    https://www.geeksforgeeks.org/sorting-algorithms/
*/
// 1. Prerequisites
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $id = document.getElementById.bind(document);

const ALGS = {
  1: new BubbleSort(),
  //   2: new QuickSort(),
  //   3: new HeapSort(),
};

// Toolbar controls
const ARRAY_LEN_INPUT = $id('array_len_input');
const ARRAY_LEN_RANGE = $id('array_len_range');
const GENERATE_BTN = $id('generate_btn');
const ALG_SELECTOR = $id('alg_select');
const SPEED_RANGE = $id('speed_range');
const START_BTN = $id('start_btn');
const STOP_BTN = $id('stop_btn');

// Array
const ARRAY_CONTAINER = $id('array_container');

const STATE = {
  minLength: 5,
  maxLength: 100,
  arrayLength: 50,
  sortInProgress: false,
  array: [],
  minValue: 0,
  maxValue: 100,
  paused: false,
  freshArray: false,
  speed: {
    value: 250,
    min: 1,
    max: 500,
    step: 1,
  },
};

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// 2. Initialization

// Array length
ARRAY_LEN_INPUT.setAttribute('min', STATE.minLength);
ARRAY_LEN_INPUT.setAttribute('max', STATE.maxLength);

ARRAY_LEN_RANGE.setAttribute('min', STATE.minLength);
ARRAY_LEN_RANGE.setAttribute('max', STATE.maxLength);

ARRAY_LEN_INPUT.value = STATE.arrayLength;
ARRAY_LEN_RANGE.value = STATE.arrayLength;

ARRAY_LEN_INPUT.addEventListener('input', (e) => {
  ARRAY_LEN_RANGE.value = e.target.valueAsNumber;
  STATE.arrayLength = e.target.valueAsNumber;
  generateArray();
});

ARRAY_LEN_RANGE.addEventListener('input', (e) => {
  ARRAY_LEN_INPUT.value = e.target.valueAsNumber;
  STATE.arrayLength = e.target.valueAsNumber;
  generateArray();
});

// Generate Array button
GENERATE_BTN.addEventListener('click', () => generateArray());

function generateArray(length = STATE.arrayLength) {
  if (STATE.array.length) {
    ARRAY_CONTAINER.innerHTML = '';
    STATE.array = [];
  }

  for (let i = 0; i < length; ++i) {
    const value = rnd(STATE.minValue, STATE.maxValue);

    STATE.array.push(
      new ArrayItem({
        value,
        container: ARRAY_CONTAINER,
        h: (value * 95) / STATE.maxValue + 5,
        w: 100 / STATE.arrayLength,
      })
    );
  }

  STATE.freshArray = true;
}

// Algorithm select
Object.keys(ALGS).forEach((key) => {
  const algorithm = ALGS[key];

  const option = document.createElement('option');
  option.value = key;
  option.innerText = algorithm.name;

  ALG_SELECTOR.appendChild(option);
});

// Start button
START_BTN.addEventListener('click', () => {
  if (!STATE.sortInProgress) {
    start();

    return;
  }

  if (STATE.paused) {
    unpause();

    return;
  }

  pause();
});

// Stop button
STOP_BTN.addEventListener('click', async () => {
  stop();
  generateArray();
});

// Speed range
SPEED_RANGE.setAttribute('min', STATE.speed.min);
SPEED_RANGE.setAttribute('max', STATE.speed.max);
SPEED_RANGE.setAttribute('step', STATE.speed.step);
SPEED_RANGE.setAttribute('value', STATE.speed.value);

SPEED_RANGE.addEventListener('input', (e) => {
  STATE.speed.value = e.target.valueAsNumber;
});

// Event handlers
async function start() {
  if (!STATE.freshArray) {
    generateArray();
  }

  STATE.freshArray = false;

  const elementsToDisable = $$('[data-disable-while-sorting]');
  const elementsToEnable = $$('[data-enable-while-sorting]');

  elementsToDisable.forEach((element) => {
    element.toggleAttribute('disabled', true);
  });

  elementsToEnable.forEach((element) => {
    element.removeAttribute('disabled');
  });

  START_BTN.textContent = 'Pause';

  STATE.sortInProgress = true;

  const algId = ALG_SELECTOR.value;
  const alg = ALGS[algId];

  await alg.sort(STATE.array, {
    interval: () => 1000 / STATE.speed.value,
    pauseWhen: () => STATE.paused,
    breakWhen: () => !STATE.sortInProgress,
  });

  stop();
}

function pause() {
  STATE.paused = true;
  START_BTN.textContent = 'Continue';
}

function unpause() {
  STATE.paused = false;
  START_BTN.textContent = 'Pause';
}

function stop() {
  const elementsToDisable = $$('[data-disable-while-sorting]');
  const elementsToEnable = $$('[data-enable-while-sorting]');

  STATE.paused = false;
  STATE.sortInProgress = false;

  START_BTN.textContent = 'Start';

  elementsToDisable.forEach((element) => {
    element.removeAttribute('disabled');
  });

  elementsToEnable.forEach((element) => {
    element.toggleAttribute('disabled', true);
  });
}

// ===
// ===
// BEGIN
// ===
// ===

generateArray();
