import { ChessPiece } from "./pieces.mjs";

export class ChessHumanPlayer {
    /**
     * Human chess player
     * @param {Number} color 
     * @param {HTMLElement} canvas 
     */
    constructor(color) {
        this.color = color;

        this.selectedPiece;

        this.isChecked = false;
    }

    /**
     * Call when a player selected a piece
     * @param {ChessPiece} piece 
     */
    pickup(piece) {
        this.selectedPiece = piece
    }

    /**
     * Call when the player releases the piece
     */
    release() {
        const temp = this.selectedPiece
        this.selectedPiece = ChessPiece.None()
        return temp
    }
}