import { game, Sprite } from "./sgc/sgc.js";

game.setBackground("floor.png");

class Marker extends Sprite {
    constructor(board, imageFile, name) {
        super();
        this.board = board;
        this.setImage(imageFile);
        this.name = name;
        this.squareSymbol = this.name.substring(0, 1);
        this.x = this.startX = 150;
        this.y = this.startY = 275;
        this.inBoard = false;
    }
    playInSquare(row, col) {
        this.x = this.board.x + col * 150 + 50;
        this.y = this.board.y + row * 150 + 50;
        this.board.dataModel[row][col] = this.squareSymbol;
        this.board.debugBoard();
        this.inBoard = true;
    }
}

class PrincessMarker extends Marker {
    constructor(board) {
        super(board, 'annFace.png', 'Princess');
        this.dragging = false;

    }
    handleMouseLeftButtonDown() {
        if (this.inBoard) {
            return;
        }
        this.dragging = true;
    }
    handleMouseLeftButtonUp() {
        if (this.inBoard) {
            return;
        }
        this.dragging = false;
        let row = Math.floor((this.y - this.board.y) / this.board.SquareSize);
        let col = Math.floor((this.x - this.board.x) / this.board.SquareSize);
        if (row < 0 || row > 2 || row != this.emptySquareSymbol) {
            this.x = this.startX;
            this.y = this.startY;
        }
        if (col < 0 || col > 2 || col != this.emptySquareSymbol) {
            this.x = this.startX;
            this.y = this.startY;
        }
        this.playInSquare(row, col);
        this.board.takeTurns();
    }

    handleGameLoop() {
        if (this.dragging == true) {
            this.x = game.getMouseX() - this.width / 2;
            this.y = game.getMouseY() - this.height / 2;
        }
    }
}
class StrangerMarker extends Marker {
    constructor(board) {
        super(board, 'strangerFace.png', 'Stranger');
        this.squareSymbol = this.name.substring(0, 1);
    }
    handleGameLoop() {
        if (this.inBoard) {
            return;
        }
        // Mark a random empty square.

        let row, col;
        do {
            row = Math.round(Math.random() * (this.board.size - 1));
            col = Math.round(Math.random() * (this.board.size - 1));
        } while (this.board.dataModel[row][col] !== this.board.emptySquareSymbol);
        this.board.dataModel[row][col] = this.squareSymbol;
        this.playInSquare(row, col);
        this.board.takeTurns();
    }
}

class TicTacToe extends Sprite {
    constructor() {
        super();
        this.name = "board";
        this.setImage("board.png");
        this.x = 300;
        this.y = 85;
        this.SquareSize = 150;
        this.size = 3;
        this.activeMarker; // variable exists, but value is undefined 
        this.emptySquareSymbol = '-';
        this.dataModel = [];
        for (let row = 0; row < this.size; row = row + 1) {
            this.dataModel[row] = [];
            for (let col = 0; col < this.size; col = col + 1) {
                this.dataModel[row][col] = this.emptySquareSymbol;

            }
        }
    }
    gameIsDrawn() {
        
    }
    gameIsWon() {
        if (this.dataModel[0][0] === this.dataModel[1][1] &&
            this.dataModel[1][1] === this.dataModel[2][2] &&
            this.dataModel[2][2] !== this.emptySquareSymbol
        ) {
            return true;
        }
        if (this.dataModel[0][2] === this.dataModel[1][1] &&
            this.dataModel[1][1] === this.dataModel[2][2] &&
            this.dataModel[2][0] !== this.emptySquareSymbol
        ) {
            return true;
        } //3 in row horizontal 
        for (let row = 0; row < 3; row++) {
            if (this.dataModel[row][0] === this.dataModel[row][1] &&
                this.dataModel[row][1] === this.dataModel[row][2] &&
                this.dataModel[row][2] !== this.emptySquareSymbol
            ) {
                return true;
            }
        }
        //3 vertically 
        for (let col = 0; col < 3; col++) {
            if (this.dataModel[0][col] === this.dataModel[1][col] &&
                this.dataModel[1][col] === this.dataModel[2][col] &&
                this.dataModel[2][col] !== this.emptySquareSymbol
            ) {
                return true;
            }

        }
    }
    takeTurns() {
        if (!this.activeMarker) {
            if (Math.random() < .5) {
                this.activeMarker = new PrincessMarker(this);
            }
            if (Math.random() > .5) {
                this.activeMarker = new StrangerMarker(this);
            }
        }
        else if (this.activeMarker instanceof PrincessMarker) {
            // princess has moved; now it's stranger's turn
            this.activeMarker = new StrangerMarker(this);
        }
        else if (this.activeMarker instanceof StrangerMarker) {
            // stranger has moved; now it's princess's turn
            this.activeMarker = new PrincessMarker(this);
        }
        if (this.gameIsWon()) {
            let message = '        Game Over.\n        ';
            if (this.activeMarker instanceof PrincessMarker) {
                message = message + 'The Princess wins.';
            }
            else if (this.activeMarker instanceof StrangerMarker) {
                message = message + 'The Stranger wins.';
            }
            game.end(message);
            return;
        }
        if (this.gameIsDrawn()) {
            game.end('        Game Over.\n        The game ends in a draw.');
            return;
        }
    }
    debugBoard() {
        let boardString = '\n';
        for (let row = 0; row < this.size; row = row + 1) {
            for (let col = 0; col < this.size; col = col + 1) {
                boardString = boardString + this.dataModel[row][col] + ' ';
                if (this.dataModel[row][col] != this.emptySquareSymbol) {
                    moveCount++;
                }
            }
            boardString = boardString + '\n';
        }

        console.log('The data model after ' + moveCount + ' move(s):' + boardString);
    }
}
let moveCount = 0;

let theBoard = new TicTacToe();
theBoard.takeTurns();
