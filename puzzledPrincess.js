import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("floor.png");



class Marker extends Sprite {   }

class PrincessMarker extends Marker {   }

class StrangerMarker extends Marker {   }

class TicTacToe  extends Sprite {   }



let theBoard = new TicTacToe();

theBoard.takeTurns();
