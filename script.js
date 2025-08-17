(() => {
  const baseSlider = document.getElementById('baseSlider');
  const baseValue = document.getElementById('baseValue');
  const baseNumber = document.getElementById('baseNumber');
  const decimalNumber = document.getElementById('decimalNumber');
  const incBtn = document.getElementById('increment');
  const decBtn = document.getElementById('decrement');
  const resetBtn = document.getElementById('reset');

  let current = 0;
  let previous = 0;
  let base = parseInt(baseSlider.value, 10);
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
    return new Promise(resolve => {
      elem.innerHTML = `<span class="old">${from}</span><span class="new">${to}</span>`;
      const [oldSpan, newSpan] = elem.children;
      if (direction === 'up') {
        newSpan.style.transform = 'translateY(100%)';
      } else {
        newSpan.style.transform = 'translateY(-100%)';
      }
      void newSpan.offsetHeight; // force reflow
      if (direction === 'up') {
        oldSpan.style.transform = 'translateY(-100%)';
        newSpan.style.transform = 'translateY(0)';
      } else {
        oldSpan.style.transform = 'translateY(100%)';
        newSpan.style.transform = 'translateY(0)';
      }
      oldSpan.addEventListener('transitionend', () => {
        elem.textContent = to;
        resolve();
      }, { once: true });
    });
  }

  async function updateDigits(prev, next) {
    const prevStr = prev.toString(base).toUpperCase();
    const nextStr = next.toString(base).toUpperCase();
    const maxLen = Math.max(prevStr.length, nextStr.length);

    ensureDigits(maxLen);

    const paddedPrev = prevStr.padStart(maxLen, '0');
    const paddedNext = nextStr.padStart(maxLen, '0');
    const direction = next >= prev ? 'up' : 'down';

    const changed = [];
    for (let i = maxLen - 1; i >= 0; i--) {
      if (paddedPrev[i] !== paddedNext[i]) {
        changed.push(i);
      } else {
        digits[i].textContent = paddedNext[i];
      }
    }

    for (const i of changed) {
      await animateDigit(digits[i], paddedPrev[i], paddedNext[i], direction);
    }
  }

  async function updateDisplay() {
    await updateDigits(previous, current);
    decimalNumber.textContent = current.toString(10);
    baseValue.textContent = base;
    previous = current;
  }

  baseSlider.addEventListener('input', () => {
    base = parseInt(baseSlider.value, 10);
    updateDisplay();
    baseNumber.classList.add('highlight');
    setTimeout(() => baseNumber.classList.remove('highlight'), 300);
  });

  function inc() {
    previous = current;
    current += 1;
    updateDisplay();
  }

  function dec() {
    if (current > 0) {
      previous = current;
      current -= 1;
      updateDisplay();
    }
  }

  function autoRepeat(btn, handler) {
    let interval;
    const start = () => {
      handler();
      interval = setInterval(handler, 150);
    };
    const clear = () => interval && clearInterval(interval);
    btn.addEventListener('mousedown', start);
    btn.addEventListener('touchstart', start);
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev =>
      btn.addEventListener(ev, clear));
    btn.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handler();
      }
    });
  }

  autoRepeat(incBtn, inc);
  autoRepeat(decBtn, dec);

  resetBtn.addEventListener('click', () => {
    base = 10;
    current = 0;
    previous = 0;
    baseSlider.value = base;
    updateDisplay();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      inc();
    } else if (e.key === 'ArrowDown') {
      dec();
    }
  });

  updateDisplay();
})();
