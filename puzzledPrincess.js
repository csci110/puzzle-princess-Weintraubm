import { game, Sprite } from "./sgc/sgc.js";

game.setBackground("floor.png");




class Marker extends Sprite {
    constructor(board, imageFile, name) {
        super();
        this.board = board;
        this.setImage(imageFile);
        this.name = name;
        this.x = this.startX = 150;
        this.y = this.startY = 275;
    }
}

class PrincessMarker extends Marker {
    constructor(board) {
        super(board, 'annFace.png', 'ann');
        this.dragging = false;

    }
    handleMouseLeftButtonDown() {
        this.dragging = true;
    }
    handleMouseLeftButtonUp() {
        this.dragging = false;
        let row = Math.floor((this.x - this.board.x) / this.board.SquareSize);
        let col = Math.floor((this.y - this.board.y) / this.board.SquareSize);
        if ( this.row, this.col >= theBoard.size) {
            this.x = this.startX;
            this.y = this.startY;
        }
    }
    handleGameLoop() {
        if (this.dragging == true) {
            this.x = game.getMouseX() - this.width / 2;
            this.y = game.getMouseY() - this.height / 2;
        }
    }
}
class StrangerMarker extends Marker {}

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

    }
    takeTurns() {
        this.activeMarker = new PrincessMarker(this);
    }
}


let theBoard = new TicTacToe();
theBoard.takeTurns();
