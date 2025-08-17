(() => {
  const baseInput = document.getElementById('baseInput');

  const baseNumber = document.getElementById('baseNumber');
  const decimalNumber = document.getElementById('decimalNumber');
  const incBtn = document.getElementById('increment');
  const decBtn = document.getElementById('decrement');
  const resetBtn = document.getElementById('reset');

  let current = 0;
  let previous = 0;
  let base = parseInt(baseInput.value, 10);
  const digits = [];

  function createDigit(value) {
    const digit = document.createElement('div');
    digit.className = 'digit';
    digit.textContent = value;
    return digit;
  }

  function ensureDigits(length) {
    while (digits.length < length) {
      const d = createDigit('0');
      baseNumber.prepend(d);
      digits.unshift(d);
    }
    while (digits.length > length) {
      const d = digits.shift();
      baseNumber.removeChild(d);
    }
  }

  function animateDigit(elem, from, to, direction) {
    elem.innerHTML = `<span class="old">${from}</span><span class="new">${to}</span>`;
    const [oldSpan, newSpan] = elem.children;
    if (direction === 'up') {
      newSpan.style.transform = 'translateY(100%)';
    } else {
      newSpan.style.transform = 'translateY(-100%)';
    }
    // force reflow
    void newSpan.offsetHeight;
    if (direction === 'up') {
      oldSpan.style.transform = 'translateY(-100%)';
      newSpan.style.transform = 'translateY(0)';
    } else {
      oldSpan.style.transform = 'translateY(100%)';
      newSpan.style.transform = 'translateY(0)';
    }
    oldSpan.addEventListener('transitionend', () => {
      elem.textContent = to;
    }, { once: true });
  }

  function updateDigits(prev, next) {
    const prevStr = prev.toString(base).toUpperCase();
    const nextStr = next.toString(base).toUpperCase();
    const maxLen = Math.max(prevStr.length, nextStr.length);

    ensureDigits(maxLen);

    const paddedPrev = prevStr.padStart(maxLen, '0');
    const paddedNext = nextStr.padStart(maxLen, '0');
    const direction = next >= prev ? 'up' : 'down';

    for (let i = 0; i < maxLen; i++) {
      if (paddedPrev[i] !== paddedNext[i]) {
        animateDigit(digits[i], paddedPrev[i], paddedNext[i], direction);
      } else {
        digits[i].textContent = paddedNext[i];
      }
    }
  }

  function updateDisplay() {
    updateDigits(previous, current);
    decimalNumber.textContent = current.toString(10);
    previous = current;
  }

  baseInput.addEventListener('change', () => {
    let value = parseInt(baseInput.value, 10);
    if (isNaN(value)) value = 10;
    base = Math.min(30, Math.max(2, value));
    baseInput.value = base;
    updateDisplay();
  });

  incBtn.addEventListener('click', () => {
    previous = current;
    current += 1;
    updateDisplay();
  });

  decBtn.addEventListener('click', () => {
    if (current > 0) {
      previous = current;
      current -= 1;
      updateDisplay();
    }
  });

  resetBtn.addEventListener('click', () => {
    base = 10;
    current = 0;
    previous = 0;
    baseInput.value = base;
    updateDisplay();
  });

  updateDisplay();
})();

