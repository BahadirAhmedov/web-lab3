class View {
  constructor(gridEl, tilesEl) {
    this.gridEl = gridEl;
    this.tilesEl = tilesEl;
  }

  buildGrid() {
    this.gridEl.innerHTML = '';
    for (let i = 0; i < SIZE * SIZE; i++) {
      const cell = document.createElement('div');
      cell.className = 'board__cell';
      this.gridEl.append(cell);
    }
  }

  render(grid) {
    this.tilesEl.innerHTML = '';
    grid.flat().filter(Boolean).forEach((tile) => this.addTile(tile));
  }

  addTile(tile, extraClass = '') {
    const el = document.createElement('div');
    el.className = `tile ${this.getValueClass(tile.value)} ${extraClass}`.trim();

    const inner = document.createElement('div');
    inner.className = 'tile__inner';
    inner.textContent = tile.value;
    el.append(inner);

    this.setPosition(el, tile);
    this.tilesEl.append(el);
    return el;
  }

  setPosition(el, tile) {
    el.style.setProperty('--row', tile.row);
    el.style.setProperty('--col', tile.col);
  }

  getValueClass(value) {
    return value > 2048 ? 'tile--super' : `tile--${value}`;
  }
}
