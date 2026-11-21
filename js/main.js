const game = new Game();
const view = new View(
  document.getElementById('board-grid'),
  document.getElementById('board-tiles')
);

view.buildGrid();

view.render(game.grid);
