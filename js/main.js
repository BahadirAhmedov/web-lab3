const game = new Game();
const view = new View(
  document.getElementById('board-grid'),
  document.getElementById('board-tiles')
);

const scoreEl = document.getElementById('score');

const KEY_DIRECTIONS = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

function update() {
  view.render(game.grid);
  scoreEl.textContent = game.score;
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
