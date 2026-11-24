class View {
  constructor(gridEl, tilesEl) {
    this.gridEl = gridEl;
    this.tilesEl = tilesEl;
    this.tileElements = new Map();
  }

  buildGrid() {
    this.gridEl.innerHTML = '';
    for (let i = 0; i < SIZE * SIZE; i++) {
      const cell = document.createElement('div');
      cell.className = 'board__cell';
      this.gridEl.append(cell);
    }
  }

  // animate = true — плитки плавно сдвигаются, слитые и новые появляются с анимацией;
  // animate = false — поле перерисовывается целиком (старт, отмена хода, загрузка)
  render(grid, animate = false) {
    if (!animate) {
      this.tilesEl.innerHTML = '';
      this.tileElements.clear();
    }

    const actualIds = new Set();

    grid.flat().filter(Boolean).forEach((tile) => {
      actualIds.add(tile.id);

      if (animate && tile.mergedFrom) {
        tile.mergedFrom.forEach((source) => this.removeAfterMove(source, tile));
        this.addTile(tile, 'tile--merged');
      } else if (this.tileElements.has(tile.id)) {
        this.setPosition(this.tileElements.get(tile.id), tile);
      } else {
        this.addTile(tile, animate && tile.isNew ? 'tile--new' : '');
      }
    });

    this.tileElements.forEach((el, id) => {
      if (!actualIds.has(id)) {
        el.remove();
        this.tileElements.delete(id);
      }
    });
  }

  // Слитая плитка доезжает до клетки слияния и удаляется
  removeAfterMove(source, target) {
    const el = this.tileElements.get(source.id);
    if (!el) return;

    this.tileElements.delete(source.id);
    this.setPosition(el, target);
    setTimeout(() => el.remove(), MOVE_DURATION);
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
    this.tileElements.set(tile.id, el);
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
