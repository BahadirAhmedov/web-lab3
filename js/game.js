function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Сдвигает плитки ряда к началу и сливает одинаковые соседние значения,
// пока слияния возможны: [4, 4, 4, 4] -> [16], [16, 16, 2, 2] -> [32, 4]
function mergeLine(tiles) {
  let items = tiles.filter(Boolean).map((tile) => ({ value: tile.value, sources: [tile] }));
  let merged = true;

  while (merged) {
    merged = false;
    const result = [];
    let lastMerged = false;

    for (const item of items) {
      const last = result[result.length - 1];
      if (last && !lastMerged && last.value === item.value) {
        result[result.length - 1] = {
          value: last.value * 2,
          sources: last.sources.concat(item.sources),
        };
        lastMerged = true;
        merged = true;
      } else {
        result.push(item);
        lastMerged = false;
      }
    }

    items = result;
  }

  return { items };
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

  // Клетки ряда в порядке от края, к которому двигаются плитки
  getLineCells(direction, index) {
    const cells = [];
    for (let i = 0; i < SIZE; i++) {
      const col = direction === 'right' ? SIZE - 1 - i : i;
      cells.push({ row: index, col });
    }
    return cells;
  }

  move(direction) {
    const newGrid = this.createEmptyGrid();
    let moved = false;

    for (let index = 0; index < SIZE; index++) {
      const cells = this.getLineCells(direction, index);
      const { items } = mergeLine(cells.map(({ row, col }) => this.grid[row][col]));

      items.forEach((item, i) => {
        const { row, col } = cells[i];
        let tile;

        if (item.sources.length === 1) {
          tile = item.sources[0];
          if (tile.row !== row || tile.col !== col) moved = true;
          tile.mergedFrom = null;
          tile.isNew = false;
        } else {
          moved = true;
          tile = this.createTile(item.value, row, col);
          tile.mergedFrom = item.sources;
          item.sources.forEach((source) => {
            source.row = row;
            source.col = col;
          });
        }

        tile.row = row;
        tile.col = col;
        newGrid[row][col] = tile;
      });
    }

    if (!moved) return false;

    this.grid = newGrid;
    return true;
  }
}
