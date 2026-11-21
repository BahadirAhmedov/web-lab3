const game = new Game();
const view = new View(
  document.getElementById('board-grid'),
  document.getElementById('board-tiles')
);

const KEY_DIRECTIONS = {
  ArrowLeft: 'left',
};

function update() {
  view.render(game.grid);
}

function handleMove(direction) {
  if (game.move(direction)) update();
}

document.addEventListener('keydown', (event) => {
  const direction = KEY_DIRECTIONS[event.key];
  if (!direction) return;

  event.preventDefault();
  handleMove(direction);
});

view.buildGrid();
update();
