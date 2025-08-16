(() => {
  const baseInput = document.getElementById('baseInput');

  const baseNumber = document.getElementById('baseNumber');
  const decimalNumber = document.getElementById('decimalNumber');
  const incBtn = document.getElementById('increment');
  const decBtn = document.getElementById('decrement');
  const resetBtn = document.getElementById('reset');

  let current = 0;
  let base = parseInt(baseInput.value, 10);

  function updateDisplay() {
    baseNumber.textContent = current.toString(base).toUpperCase();
    decimalNumber.textContent = current.toString(10);
  }

  baseInput.addEventListener('change', () => {
    let value = parseInt(baseInput.value, 10);
    if (isNaN(value)) value = 10;
    base = Math.min(30, Math.max(2, value));
    baseInput.value = base;
    updateDisplay();
  });

  incBtn.addEventListener('click', () => {
    current += 1;
    updateDisplay();
  });

  decBtn.addEventListener('click', () => {
    current -= 1;
    updateDisplay();
  });

  resetBtn.addEventListener('click', () => {
    base = 10;
    current = 0;
    baseInput.value = base;
    updateDisplay();
  });

  updateDisplay();
})();
