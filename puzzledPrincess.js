import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("floor.png");



class Marker extends Sprite {   }

class PrincessMarker extends Marker {   }

class StrangerMarker extends Marker {   }

class TicTacToe  extends Sprite {   }



let theBoard = new TicTacToe();

theBoard.takeTurns();

class TicTacToe extends Sprite {
    constructor(){
    super();
    this.name =
    this.setImage();
    this.x = 300;
    this.y = 85;
    this.SquareSize =150;
    this.size = 3;
    this.activeMarker; // variable exists, but value is undefined 
    
}
}