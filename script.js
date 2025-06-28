document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const status = document.getElementById("status");
  const restartBtn = document.getElementById("restart");

  let gameBoard = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = true;

  const winningMessage = () => `Игрок ${currentPlayer} победил!`;
  const drawMessage = () => `Ничья!`;
  const currentPlayerTurn = () => `Ход игрока ${currentPlayer}`;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function initGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    status.textContent = currentPlayerTurn();

    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-index", i);
      cell.addEventListener("click", handleCellClick);
      board.appendChild(cell);
    }
  }

  function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameBoard[clickedCellIndex] !== "" || !gameActive) return;

    makeMove(clickedCell, clickedCellIndex, currentPlayer);

    if (checkResult()) return;

    if (gameActive) {
      currentPlayer = "O";
      status.textContent = "Компьютер думает...";

      setTimeout(() => {
        makeAIMove();
        checkResult();
        currentPlayer = "X";
        if (gameActive) {
          status.textContent = currentPlayerTurn();
        }
      }, 800);
    }
  }

  function makeMove(cell, index, player) {
    gameBoard[index] = player;
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
  }

  function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (gameBoard[a] === "" || gameBoard[b] === "" || gameBoard[c] === "")
        continue;

      if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      status.textContent = winningMessage();
      gameActive = false;
      return true;
    }

    if (!gameBoard.includes("")) {
      status.textContent = drawMessage();
      gameActive = false;
      return true;
    }

    return false;
  }

  function makeAIMove() {
    let move = findWinningMove("O");
    if (move !== -1) {
      const cell = document.querySelector(`[data-index="${move}"]`);
      makeMove(cell, move, "O");
      return;
    }

    move = findWinningMove("X");
    if (move !== -1) {
      const cell = document.querySelector(`[data-index="${move}"]`);
      makeMove(cell, move, "O");
      return;
    }

    if (gameBoard[4] === "") {
      const cell = document.querySelector('[data-index="4"]');
      makeMove(cell, 4, "O");
      return;
    }

    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((index) => gameBoard[index] === "");
    if (availableCorners.length > 0) {
      const randomCorner =
        availableCorners[Math.floor(Math.random() * availableCorners.length)];
      const cell = document.querySelector(`[data-index="${randomCorner}"]`);
      makeMove(cell, randomCorner, "O");
      return;
    }

    const availableCells = gameBoard
      .map((cell, index) => (cell === "" ? index : null))
      .filter((val) => val !== null);
    if (availableCells.length > 0) {
      const randomCell =
        availableCells[Math.floor(Math.random() * availableCells.length)];
      const cell = document.querySelector(`[data-index="${randomCell}"]`);
      makeMove(cell, randomCell, "O");
    }
  }

  function findWinningMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (
        gameBoard[a] === player &&
        gameBoard[b] === player &&
        gameBoard[c] === ""
      )
        return c;
      if (
        gameBoard[a] === player &&
        gameBoard[c] === player &&
        gameBoard[b] === ""
      )
        return b;
      if (
        gameBoard[b] === player &&
        gameBoard[c] === player &&
        gameBoard[a] === ""
      )
        return a;
    }
    return -1;
  }

  restartBtn.addEventListener("click", initGame);

  initGame();
});
