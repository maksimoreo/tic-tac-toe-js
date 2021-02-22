const gameCellFactory = (gameCellIndex) => {
    const _createElement = () => {
        var template = document.createElement('template');
        template.innerHTML = (`<div class="game-cell"><button class="game-cell-button"><svg viewBox="0 0 100 100" stroke-width="20" xmlns="http://www.w3.org/2000/svg"><g class="game-cross" display="none"><line y1="10" x1="10" y2="90" x2="90" /><line y1="10" x1="90" y2="90" x2="10" /></g><g class="game-circle" display="none"><circle cx="50" cy="50" r="40" fill="transparent" /></g></svg></button></div>`).trim();
        return template.content.firstChild;
    };

    const getElement = () => (gameCellDiv);

    const _updateElement = () => {
        if (value == 'x') {
            gameCrossGroup.setAttribute('display', 'inline');
            gameCircleGroup.setAttribute('display', 'none');
            gameCellButton.disabled = true;
        } else if (value == 'o') {
            gameCrossGroup.setAttribute('display', 'none');
            gameCircleGroup.setAttribute('display', 'inline');
            gameCellButton.disabled = true;
        } else if (value == '-') {
            gameCrossGroup.setAttribute('display', 'none');
            gameCircleGroup.setAttribute('display', 'none');
            gameCellButton.disabled = false;
        }
    };

    const disableButton = (value) => {
        gameCellButton.disabled = value;
    }

    const setOnClickCallback = (func) => {
        gameCellButton.onclick = () => {
            var return_value = func(index);

            if (['x', 'o', '-'].includes(return_value)) {
                setValue(return_value);
            }
        }
    }

    const setValue = (newValue) => {
        value = newValue;
        _updateElement();
    }

    const getValue = () => (value);

    // Initialize
    var value = '-';
    var index = gameCellIndex;

    var gameCellDiv = _createElement();
    var gameCrossGroup = gameCellDiv.querySelector('.game-cross');
    var gameCircleGroup = gameCellDiv.querySelector('.game-circle');
    var gameCellButton = gameCellDiv.querySelector('.game-cell-button');

    return { setValue, getValue, getElement, setOnClickCallback, disableButton };
};

const tictactoeFactory = () => {
    // Converts (i, j) to (index)
    const CellToIndex = (i, j) => i * 3 + j;

    const getAt = (index) => board[index];
    const setAt = (index, value) => { board[index] = value; };
    const getAtCell = (i, j) => getAt(CellToIndex(i, j));
    const setAtCell = (i, j, value) => { setAt(CellToIndex(i, j), value); };

    const clearBoard = () => {
        for (var i = 0; i < 9; i++) {
            board[i] = '-';
        }
    }

    const isWinFor = (sign) => {
        // Horizontal and Vertical
        for (var i = 0; i < 3; i++) {
            var sum_v = 0;
            var sum_h = 0;

            for (var j = 0; j < 3; j++) {
                sum_v += getAtCell(i, j) == sign;
                sum_h += getAtCell(j, i) == sign;
            }

            if (sum_v == 3 || sum_h == 3) {
                return true;
            }
        }

        // Diagonals
        var sum_d1 = 0;
        var sum_d2 = 0;

        for (var i = 0; i < 3; i++) {
            sum_d1 += getAtCell(i, i) == sign;
            sum_d2 += getAtCell(i, 2 - i) == sign;
        }

        if (sum_d1 == 3 || sum_d2 == 3) {
            return true;
        }

        return false;
    }

    const isFull = () => board.reduce((acc, value) => acc += value === '-', 0) == 0;

    const isTie = () => isFull() && !isWinFor('x') && !isWinFor('y');

    const getState = () => {
        if (isWinFor('x')) {
            return 'x';
        } else if (isWinFor('o')) {
            return 'o';
        } else if (isFull()) {
            return 'tie';
        } else {
            return 'in progress';
        }
    }

    const getCurrentSign = () => currentSign;
    const setCurrentSign = (newSign) => { currentSign = newSign; };
    const toggleCurrentSign = () => { currentSign = currentSign == 'x' ? 'o' : 'x'; };

    const setAtIndexCurrentSign = (index) => {
        setAt(index, currentSign);
        toggleCurrentSign();
    }
    const setAtCellCurrentSign = (i, j) => {
        setAtCell(i, j, currentSign);
        toggleCurrentSign();
    };

    const restart = () => {
        currentSign = 'x';
        clearBoard();
    }

    // Initialization
    var board = new Array(9);
    var currentSign = 'x';

    for (var i = 0; i < 9; i++) {
        board[i] = '-';
    }

    return { CellToIndex, getAtCell, setAtCell, clearBoard, getState, isWinFor, isTie, isFull, getCurrentSign, setCurrentSign, toggleCurrentSign, setAtIndexCurrentSign, setAtCellCurrentSign, restart };
};

var gameOverMenu = (function() {
    var gameOverMenuDiv = document.querySelector('#gameOverMenu');
    var playAgainButton = gameOverMenuDiv.querySelector('button');

    const showGameOverMenu = () => {
        gameOverMenuDiv.classList.remove('gameOverMenuHide');
    }

    const hideGameOverMenu = () => {
        gameOverMenuDiv.classList.add('gameOverMenuHide');
    }

    const setOnPlayAgainCallback = (func) => {
        playAgainButton.onclick = func;
    }

    return { showGameOverMenu, hideGameOverMenu, setOnPlayAgainCallback }
})();

var game = (function() {
    var gameBoardDiv = document.querySelector('#tic-tac-toe-board');
    var gameCells = new Array(9);
    var tictactoe = tictactoeFactory();

    for (var i = 0; i < 9; i++) {
        gameCells[i] = gameCellFactory(i);
        gameBoardDiv.appendChild(gameCells[i].getElement());

        gameCells[i].setOnClickCallback((index) => {
            var currentSign = tictactoe.getCurrentSign();
            tictactoe.setAtIndexCurrentSign(index);

            var gameState = tictactoe.getState();
            if (gameState != "in progress") {
                onGameEnd(gameState);
            }

            // Set button's sign
            return currentSign;
        });
    }

    const disableAllButtons = (value) => {
        for (gameCell of gameCells) {
            gameCell.disableButton(value);
        }
    }

    const onGameEnd = (state) => {
        disableAllButtons(true);
        gameOverMenu.showGameOverMenu();
    }

    gameOverMenu.setOnPlayAgainCallback(() => {
        gameOverMenu.hideGameOverMenu();
        disableAllButtons(false);
        tictactoe.restart();
        for (gameCell of gameCells) {
            gameCell.setValue('-');
        }
    });
})();
