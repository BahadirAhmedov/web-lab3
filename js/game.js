function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Сдвигает плитки ряда к началу и сливает одинаковые соседние значения,
// пока слияния возможны: [4, 4, 4, 4] -> [16], [16, 16, 2, 2] -> [32, 4]
function mergeLine(tiles) {
  let items = tiles.filter(Boolean).map((tile) => ({ value: tile.value, sources: [tile] }));
  let points = 0;
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
        points += last.value * 2;
        lastMerged = true;
        merged = true;
      } else {
        result.push(item);
        lastMerged = false;
      }
    }

    items = result;
  }

  return { items, points };
}

class Game {
  constructor() {
    this.nextId = 1;
    this.reset();
  }

  reset() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.over = false;
    this.recordSaved = false;
    this.history = [];
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
      const reversed = direction === 'right' || direction === 'down';
      const position = reversed ? SIZE - 1 - i : i;
      if (direction === 'up' || direction === 'down') {
        cells.push({ row: position, col: index });
      } else {
        cells.push({ row: index, col: position });
      }
    }
    return cells;
  }

  move(direction) {
    if (this.over) return false;

    const snapshot = this.getSnapshot();
    const newGrid = this.createEmptyGrid();
    let moved = false;
    let points = 0;

    for (let index = 0; index < SIZE; index++) {
      const cells = this.getLineCells(direction, index);
      const line = mergeLine(cells.map(({ row, col }) => this.grid[row][col]));
      points += line.points;

      line.items.forEach((item, i) => {
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
    this.score += points;
    this.history.push(snapshot);
    this.addRandomTiles(randomInt(1, 2));
    this.over = !this.canMove();
    return true;
  }

  // Ход возможен, если есть пустая клетка или соседние плитки с одинаковым значением
  canMove() {
    if (this.getEmptyCells().length) return true;

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const value = this.grid[row][col].value;
        if (col + 1 < SIZE && this.grid[row][col + 1].value === value) return true;
        if (row + 1 < SIZE && this.grid[row + 1][col].value === value) return true;
      }
    }
    return false;
  }

  getSnapshot() {
    return {
      cells: this.grid.map((row) => row.map((tile) => (tile ? tile.value : 0))),
      score: this.score,
    };
  }

  applySnapshot(snapshot) {
    this.grid = snapshot.cells.map((row, r) =>
      row.map((value, c) => (value ? this.createTile(value, r, c) : null))
    );
    this.score = snapshot.score;
  }

  // После окончания игры отменить ход нельзя
  canUndo() {
    return !this.over && this.history.length > 0;
  }

  undo() {
    if (!this.canUndo()) return false;
    this.applySnapshot(this.history.pop());
    return true;
  }
}
