const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let current = '0';
let previous = null;
let operator = null;
let shouldReset = false;

function render() {
  display.textContent = current;

  document.querySelectorAll('[data-operator]').forEach(button => {
    button.classList.toggle(
      'selected',
      button.dataset.operator === operator && shouldReset
    );
  });
}

function enterDigit(digit) {
  if (current === 'Error' || shouldReset) {
    current = digit === '00' ? '0' : digit;
    shouldReset = false;
  } else if (current === '0') {
    current = digit === '00' ? '0' : digit;
  } else if (current.replace(/[^0-9]/g, '').length < 12) {
    current += digit;
  }

  render();
}

function enterDecimal() {
  if (current === 'Error' || shouldReset) {
    current = '0';
    shouldReset = false;
  }

  if (!current.includes('.')) {
    current += '.';
  }

  render();
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function formatResult(result) {
  if (!Number.isFinite(result)) return 'Error';
  return String(Number(result.toPrecision(11)));
}

function selectOperator(nextOperator) {
  if (current === 'Error') return;

  const value = Number(current);

  if (operator !== null && !shouldReset) {
    current = formatResult(
      calculate(previous, value, operator)
    );

    if (current === 'Error') {
      previous = null;
      operator = null;
      render();
      return;
    }
  }

  previous = Number(current);
  operator = nextOperator;
  shouldReset = true;

  render();
}

function equals() {
  if (operator === null || previous === null || current === 'Error') {
    return;
  }

  current = formatResult(
    calculate(previous, Number(current), operator)
  );

  previous = null;
  operator = null;
  shouldReset = true;

  render();
}

function clear() {
  current = '0';
  previous = null;
  operator = null;
  shouldReset = false;
  render();
}

function percent() {
  if (current === 'Error') return;

  current = formatResult(Number(current) / 100);
  render();
}

function handleAction(button) {
  if (button.dataset.digit !== undefined) {
    enterDigit(button.dataset.digit);
  } else if (button.dataset.operator) {
    selectOperator(button.dataset.operator);
  } else if (button.dataset.action === 'double-zero') {
    enterDigit('00');
  } else if (button.dataset.action === 'decimal') {
    enterDecimal();
  } else if (button.dataset.action === 'equals') {
    equals();
  } else if (button.dataset.action === 'clear') {
    clear();
  } else if (button.dataset.action === 'percent') {
    percent();
  }
}

keys.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button) handleAction(button);
});

document.addEventListener('keydown', event => {
  if (/^[0-9]$/.test(event.key)) {
    enterDigit(event.key);
  } else if (event.key === '.') {
    enterDecimal();
  } else if (['+', '-', '*', '/'].includes(event.key)) {
    event.preventDefault();
    selectOperator(event.key);
  } else if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    equals();
  } else if (event.key === 'Escape') {
    clear();
  } else if (event.key === '%') {
    percent();
  } else if (event.key === 'Backspace') {
    if (shouldReset || current === 'Error' || current.length <= 1) {
      current = '0';
    } else {
      current = current.slice(0, -1);
    }

    shouldReset = false;
    render();
  }
});

render();
