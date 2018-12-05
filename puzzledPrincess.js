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
        if (row < 0 || row > 2 || col < 0 || col > 2 || this.board.getSquareSymbol(row, col) != this.emptySquareSymbol) {
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
        let foundMove = this.findWinningMove();
        if (!foundMove) {
            foundMove = this.findWinningMove(true);
        }
        if (!foundMove) {
            foundMove = this.findForkingMove();
        }
        if (!foundMove) {
            foundMove = this.findForkingMove(true);
        }
        if (!foundMove) {
            foundMove = this.findCenterMove();
        }
        if (!foundMove) {
            foundMove = this.findOppositeCornerMove();
        }
        if (!foundMove) {
            foundMove = this.findAnyCornerMove();
        }
        if (!foundMove) {
            foundMove = this.findAnySideMove();
        }
        if (!foundMove) {
            // Mark a random empty square. 
            let row, col;
            do {
                row = Math.round(Math.random() * (this.board.size - 1));
                col = Math.round(Math.random() * (this.board.size - 1));
            } while (this.board.dataModel[row][col] !== this.board.emptySquareSymbol);
            this.board.dataModel[row][col] = this.squareSymbol;
            this.playInSquare(row, col);
            foundMove = true;
        }
        if (!foundMove) throw new Error('Failed to find a move.');
        this.board.takeTurns();
    }
    findWinningMove(forOpponent) { return false; }
    findAnySideMove() {
        let last = this.board.size - 1;
        // Check all interior columns of first row.
        for (let col = 1; col < last; col = col + 1) {
            if (this.board.markSquare(0, col)) {
                this.playInSquare(0, col);
                return true;
            }
        }
        // Check all interior columns of third row.
        for (let col = 1; col < last; col = col + 1) {
            if (this.board.markSquare(2, col)) {
                this.playInSquare(2, col);
                return true;
            }
        }
    }
    findAnyCornerMove() {
        // Check upper right
        if (this.board.markSquare(0, 2)) {
            this.playInSquare(0, 2);
            return true;
        }
        //upper left
        if (this.board.markSquare(0, 0)) {
            this.playInSquare(0, 0);
            return true;
        }
        //lower left
        if (this.board.markSquare(2, 0)) {
            this.playInSquare(2, 0);
            return true;
        }
        //lower right
        if (this.board.markSquare(2, 2)) {
            this.playInSquare(2, 2);
            return true;
        }
        // if (this.board.markSquare(0, 0 || 0, 2 || 2, 0 || 2, 2)) {
        //     this.playInSquare(0, 0 || 0, 2 || 2, 0 || 2, 2);
        //     return true;
        // }
        return false;
    }
    findOppositeCornerMove() { // Check upper right
        if (this.board.getSquareSymbol(0, 2) != this.emptySquareSymbol &&
            this.board.getSqaureSymbol(0, 2) != this.squareSymbol && this.board.markSquare(2, 0)) {
            this.playInSquare(2, 0);
            return true;
        }
        //upper left
        if (this.board.getSquareSymbol(0, 0) != this.emptySquareSymbol &&
            this.board.getSqaureSymbol(0, 0) != this.squareSymbol && this.board.markSquare(2, 2)) {
            this.playInSquare(2, 2);
            return true;
        }
        //lower left
        if (this.board.getSquareSymbol(2, 0) != this.emptySquareSymbol &&
            this.board.getSqaureSymbol(2, 0) != this.squareSymbol && this.board.markSquare(0, 2)) {
            this.playInSquare(0, 2);
            return true;
        }
        //lower right
        if (this.board.getSquareSymbol(2, 2) != this.emptySquareSymbol &&
            this.board.getSqaureSymbol(2, 2) != this.squareSymbol && this.board.markSquare(0, 0)) {
            this.playInSquare(0, 0);
            return true;
        }
        return false;
    }
    findCenterMove() {
        let center = Math.floor(this.board.size / 2);
        console.log(center);
        if (this.board.markSquare(center, center)) {
            this.playInSquare(center, center);
            return true;
        }
        return false;
    }
    findForkingMove(forOpponent) { return false; }
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
        //3 in row horizontal 
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.dataModel[row][col] === this.emptySquareSymbol) {
                    return false;
                }
            }
        }
        return true;
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
        return false;
    }
    takeTurns() {
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
        if (!this.activeMarker) {
            if (Math.random() <= .5) {
                this.activeMarker = new PrincessMarker(this);
            }
            //if (Math.random() > .5) {
            else this.activeMarker = new StrangerMarker(this);

        }
        else if (this.activeMarker instanceof PrincessMarker) {
            // princess has moved; now it's stranger's turn
            this.activeMarker = new StrangerMarker(this);
        }
        else if (this.activeMarker instanceof StrangerMarker) {
            // stranger has moved; now it's princess's turn
            this.activeMarker = new PrincessMarker(this);
        }
    }
    debugBoard() {
        let boardString = '\n';
        let moveCount = 0;
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
    getSquareSymbol(row, col) {
        return this.dataModel[row][col];
    }
    markSquare(row, col, forOpponent) {
        let squareSymbol = this.activeMarker.squareSymbol;
        if (this.getSquareSymbol(row, col) === this.emptySquareSymbol) {
            this.dataModel[row][col] = squareSymbol;
            return true;
        }
        return false;
    }
    unmarkSquare(row, col) {
        this.dataModel[row][col] = this.emptySquareSymbol;
    }
}


let theBoard = new TicTacToe();
theBoard.takeTurns();
