const menu = document.getElementById('menu');
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    const resetBtn = document.getElementById('resetBtn');
    const playerVsPlayerBtn = document.getElementById('playerVsPlayer');
    const playerVsAIBtn = document.getElementById('playerVsAI');
    const playerVsAIEasyBtn = document.getElementById('playerVsAIEasy');
    const playerVsAIHardBtn = document.getElementById('playerVsAIHard');
    const aiMenu = document.getElementById('aiMenu');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    const homeButton = document.getElementById('homeButton');
    let currentPlayer = 'O';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let gameMode = null;
    let aiDifficulty = null;

    function startGame(mode, difficulty) {
      gameMode = mode;
      aiDifficulty = difficulty;
      menu.style.display = 'none';
      aiMenu.style.display = 'none';
      board.style.display = 'grid';
      message.style.display = 'block';
      resetBtn.style.display = 'block';
      gameActive = true;
      message.textContent = `Player ${currentPlayer}'s turn`;
      homeButton.style.display = 'block';
      board.style.opacity = 1;
    }

    function handleCellClick(e) {
      if (!gameActive) return;
      const cell = e.target;
      const index = cell.dataset.index;

      if (gameBoard[index] !== '') return;

      gameBoard[index] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.classList.add(currentPlayer.toLowerCase());
      checkResult();
      if (gameActive) {
        if (gameMode === 'playerVsPlayer') {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          message.textContent = `Player ${currentPlayer}'s turn`;
        } else if (gameMode === 'playerVsAI' && gameActive) {
          currentPlayer = 'X';
          message.textContent = `Player ${currentPlayer}'s turn`;
          setTimeout(aiMove, 500);
        }
      }
    }

    function aiMove() {
      if (!gameActive) return;
      let bestMove;
      if (aiDifficulty === 'easy') {
        bestMove = findRandomMove();
      } else {
        bestMove = findBestMove();
      }
      gameBoard[bestMove] = 'X';
      const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
      cell.textContent = 'X';
      cell.classList.add('x');
      checkResult();
      if (gameActive) {
        currentPlayer = 'O';
        message.textContent = `Player ${currentPlayer}'s turn`;
      }
    }

    function findRandomMove() {
      const availableMoves = gameBoard.reduce((acc, val, index) => {
        if (val === '') acc.push(index);
        return acc;
      }, []);
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    function findBestMove() {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
          gameBoard[i] = 'X';
          let score = minimax(gameBoard, 0, false);
          gameBoard[i] = '';
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      return move;
    }

    function minimax(board, depth, isMaximizing) {
      let result = checkWinner(board);
      if (result !== null) {
        return result === 'X' ? 1 : result === 'O' ? -1 : 0;
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === '') {
            board[i] = 'X';
            let score = minimax(board, depth + 1, false);
            board[i] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, depth + 1, true);
            board[i] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    }

    function checkWinner(board) {
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];

      for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }

      if (!board.includes('')) {
        return 'draw';
      }
      return null;
    }

    function checkResult() {
      const winner = checkWinner(gameBoard);
      if (winner) {
        gameActive = false;
        popup.style.display = 'flex';
        if (winner === 'draw') {
          popupMessage.textContent = 'It\'s a draw!';
        } else {
          popupMessage.textContent = `Player ${winner} wins!`;
        }
      }
    }

    function resetGame() {
      currentPlayer = 'O';
      gameBoard = ['', '', '', '', '', '', '', '', ''];
      gameActive = true;
      message.textContent = `Player ${currentPlayer}'s turn`;
      document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
      });
    }

    function showMainMenu() {
      popup.style.display = 'none';
      menu.style.display = 'flex';
      aiMenu.style.display = 'none';
      board.style.display = 'none';
      message.style.display = 'none';
      resetBtn.style.display = 'none';
      homeButton.style.display = 'none';
      board.style.opacity = 0;
      resetGame();
    }

    playerVsPlayerBtn.addEventListener('click', () => startGame('playerVsPlayer'));
    playerVsAIBtn.addEventListener('click', () => {
      menu.style.display = 'none';
      aiMenu.style.display = 'flex';
    });
    playerVsAIEasyBtn.addEventListener('click', () => startGame('playerVsAI', 'easy'));
    playerVsAIHardBtn.addEventListener('click', () => startGame('playerVsAI', 'hard'));
    board.addEventListener('click', handleCellClick);
    resetBtn.addEventListener('click', resetGame);
    mainMenuBtn.addEventListener('click', showMainMenu);
    homeButton.addEventListener('click', showMainMenu);
