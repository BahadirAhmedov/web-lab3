function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Game {
  constructor() {
    this.nextId = 1;
    this.reset();
  }

  reset() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.addRandomTiles(randomInt(1, 3));
  }

  createEmptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  }

  createTile(value, row, col) {
    return { id: this.nextId++, value, row, col, mergedFrom: null, isNew: false };
  }

  getEmptyCells() {
    const cells = [];
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (!this.grid[row][col]) cells.push({ row, col });
      }
    }
    return cells;
  }

  addRandomTiles(count) {
    for (let i = 0; i < count; i++) {
      const cells = this.getEmptyCells();
      if (!cells.length) return;

      const { row, col } = cells[Math.floor(Math.random() * cells.length)];
      const tile = this.createTile(Math.random() < 0.9 ? 2 : 4, row, col);
      tile.isNew = true;
      this.grid[row][col] = tile;
    }
  }
}
