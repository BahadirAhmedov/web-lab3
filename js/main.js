const game = new Game();
const view = new View(
  document.getElementById('board-grid'),
  document.getElementById('board-tiles')
);

const scoreEl = document.getElementById('score');
const undoBtn = document.getElementById('undo-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverModal = document.getElementById('game-over-modal');
const gameOverMessage = document.getElementById('game-over-message');
const saveForm = document.getElementById('save-form');
const playerNameInput = document.getElementById('player-name');
const modalRestartBtn = document.getElementById('modal-restart-btn');
const leadersBtn = document.getElementById('leaders-btn');
const leadersModal = document.getElementById('leaders-modal');
const leadersBody = document.getElementById('leaders-body');
const leadersEmpty = document.getElementById('leaders-empty');
const leadersCloseBtn = document.getElementById('leaders-close-btn');

const KEY_DIRECTIONS = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

function isModalOpen() {
  return !gameOverModal.hidden || !leadersModal.hidden;
}

function openModal(modal) {
  modal.hidden = false;
  document.body.classList.add('modal-open');
}

function closeModal(modal) {
  modal.hidden = true;
  if (!isModalOpen()) document.body.classList.remove('modal-open');
}

function update() {
  view.render(game.grid);
  scoreEl.textContent = game.score;
  undoBtn.disabled = !game.canUndo();
  GameStorage.saveGame(game.serialize());
  if (game.over) showGameOver();
}

function showGameOver() {
  if (game.recordSaved) {
    gameOverMessage.textContent = 'Ваш рекорд сохранен';
    saveForm.hidden = true;
  } else {
    gameOverMessage.textContent = `Ходов больше нет. Ваш счёт: ${game.score}`;
    saveForm.hidden = false;
    playerNameInput.value = '';
  }
  openModal(gameOverModal);
}

function handleMove(direction) {
  if (isModalOpen()) return;
  if (game.move(direction)) update();
}

function restart() {
  game.reset();
  closeModal(gameOverModal);
  update();
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderLeaders() {
  const leaders = GameStorage.getLeaders();
  leadersBody.innerHTML = '';

  leaders.forEach(({ name, score, date }) => {
    const row = document.createElement('tr');
    [name, score, formatDate(date)].forEach((text) => {
      const cell = document.createElement('td');
      cell.textContent = text;
      row.append(cell);
    });
    leadersBody.append(row);
  });

  leadersEmpty.hidden = leaders.length > 0;
}

document.addEventListener('keydown', (event) => {
  const direction = KEY_DIRECTIONS[event.key];
  if (!direction || isModalOpen()) return;

  event.preventDefault();
  handleMove(direction);
});

undoBtn.addEventListener('click', () => {
  if (game.undo()) update();
});

restartBtn.addEventListener('click', restart);
modalRestartBtn.addEventListener('click', restart);

saveForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = playerNameInput.value.trim();
  if (!name) return;

  GameStorage.addLeader({ name, score: game.score, date: new Date().toISOString() });
  game.recordSaved = true;
  GameStorage.saveGame(game.serialize());
  saveForm.hidden = true;
  gameOverMessage.textContent = 'Ваш рекорд сохранен';
});

leadersBtn.addEventListener('click', () => {
  renderLeaders();
  openModal(leadersModal);
});

leadersCloseBtn.addEventListener('click', () => closeModal(leadersModal));

view.buildGrid();
game.load(GameStorage.loadGame());
update();
