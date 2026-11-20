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
}
