(() => {
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const bitmapInput = document.getElementById('bitmap');
  const renderBtn = document.getElementById('render');
  const grid = document.getElementById('grid');
  const error = document.getElementById('error');
  const modeSelect = document.getElementById('mode');

  function render() {
    const w = Math.min(Math.max(parseInt(widthInput.value, 10) || 1, 1), 256);
    const h = Math.min(Math.max(parseInt(heightInput.value, 10) || 1, 1), 256);
    const bits = bitmapInput.value.replace(/[^01]/g, '');
    const pixels = w * h;
    const mode = modeSelect.value;
    const bitsNeeded = mode === 'rgb' ? pixels * 24 : pixels;

    if (bits.length < bitsNeeded) {
      error.textContent = `Provided ${bits.length} bits, but ${bitsNeeded} required. Missing bits are assumed 0.`;
    } else if (bits.length > bitsNeeded) {
      error.textContent = `Provided ${bits.length} bits, but ${bitsNeeded} required. Extra bits will be ignored.`;
    } else {
      error.textContent = '';
    }

    const normalized = bits.padEnd(bitsNeeded, '0').slice(0, bitsNeeded);
    grid.innerHTML = '';

    const cellSize = Math.floor(512 / Math.max(w, h));
    grid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${h}, 1fr)`;
    grid.style.width = `${cellSize * w}px`;
    grid.style.height = `${cellSize * h}px`;

    for (let i = 0; i < pixels; i++) {
      const cell = document.createElement('div');
      cell.className = 'pixel';
      if (mode === 'rgb') {
        const offset = i * 24;
        const r = parseInt(normalized.slice(offset, offset + 8), 2);
        const g = parseInt(normalized.slice(offset + 8, offset + 16), 2);
        const b = parseInt(normalized.slice(offset + 16, offset + 24), 2);
        cell.style.background = `rgb(${r}, ${g}, ${b})`;
      } else {
        cell.style.background = normalized[i] === '1' ? '#fff' : '#000';
      }
      grid.appendChild(cell);
    }
  }

  renderBtn.addEventListener('click', render);
})();
