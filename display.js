(() => {
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const bitmapInput = document.getElementById('bitmap');
  const renderBtn = document.getElementById('render');
  const grid = document.getElementById('grid');
  const error = document.getElementById('error');

  function render() {
    const w = Math.min(Math.max(parseInt(widthInput.value, 10) || 1, 1), 256);
    const h = Math.min(Math.max(parseInt(heightInput.value, 10) || 1, 1), 256);
    const bits = bitmapInput.value.replace(/[^01]/g, '');
    const needed = w * h;

    if (bits.length < needed) {
      error.textContent = `Provided ${bits.length} bits, but ${needed} required. Missing bits are assumed 0.`;
    } else if (bits.length > needed) {
      error.textContent = `Provided ${bits.length} bits, but ${needed} required. Extra bits will be ignored.`;
    } else {
      error.textContent = '';
    }

    const normalized = bits.padEnd(needed, '0').slice(0, needed);
    grid.innerHTML = '';

    const cellSize = Math.floor(512 / Math.max(w, h));
    grid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${h}, 1fr)`;
    grid.style.width = `${cellSize * w}px`;
    grid.style.height = `${cellSize * h}px`;

    for (let i = 0; i < needed; i++) {
      const cell = document.createElement('div');
      cell.className = 'pixel';
      cell.style.background = normalized[i] === '1' ? '#000' : '#fff';
      grid.appendChild(cell);
    }
  }

  renderBtn.addEventListener('click', render);
})();
