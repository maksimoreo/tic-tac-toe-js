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

    const setOnClickCallback = (func) => {
        gameCellButton.onclick = () => {
            func(index);
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

    return { setValue, getValue, getElement, setOnClickCallback };
};

const gameBoard = (function() {
    const gameCellCallback = (index) => {
        console.log("Pressed button: " + index);
        board[index].setValue('x');
    };

    const setCell = (index, value) => {
        board[index].setValue(value);
    };

    const clearBoard = () => {
        for (var i = 0; i < 9; i++) {
            board[i].setValue('-');
        }
    }

    // Initialization
    var board = new Array(9);
    var gameBoardDiv = document.querySelector('#game-board');

    for (var i = 0; i < 9; i++) {
        board[i] = gameCellFactory(i);
        gameBoardDiv.appendChild(board[i].getElement());

        board[i].setOnClickCallback(gameCellCallback);
    }

    board[4].setValue('x');
    board[5].setValue('o');

    return { setCell, clearBoard, board };
})();
