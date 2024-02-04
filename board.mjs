import { COLORS } from "./lookup.mjs";
import {Knight, ChessPiece, Bishop, Rook, King, Queen, Pawn } from "./pieces.mjs";
import { ChessScreen } from "./screen.mjs";

export class ChessBoard {
    #width; 
    #height;
    #board;

    /**
     * Creatae a board of certain size
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(width, height, canvas) {
        this.#width = width;
        this.#height = height;

        this.#board = new Array(height).fill(null).map(
            () => new Array(width).fill(null).map(
                () => new ChessPiece()
            )
        )
    }
    
    /**
     * Get board size
     * @returns {Number[]} [width, height]
     */
    getSize() {
        return [this.#width, this.#height]
    }

    /**
     * Get a chess piece at position
     * @param {Number} x 
     * @param {Number} y 
     * @returns {ChessPiece | undefined} undefined when position is empty
     */
    getPiece(x, y) {
        if(x < 0 || x >= this.#width || y < 0 || y > this.#height) {
            throw new Error(`Position (${x}, ${y}) is outside of the board`)
        }

        return this.#board[y][x]
    }

    /**
     * Set existing chess piece to location
     * @param {Number} x 
     * @param {Number} y 
     * @param {ChessPiece} value 
     */
    setPiece(x, y, value) {
        if(x < 0 || x >= this.#width || y < 0 || y > this.#height) {
            throw new Error(`Position (${x}, ${y}) is outside of the board`)
        }
        if(!(value.prototype instanceof ChessPiece || value instanceof ChessPiece)) {
            throw new Error(`value (${value}) isn't an instance of ChessPiece`)
        }

        this.#board[y][x] = value;
    }

    /**
     * Move pos1 to pos2
     */
    takePiece(x1, y1, x2, y2) {
        this.#board[y2][x2] = this.#board[y1][x1]
        this.#board[y1][x1] = ChessPiece.None()
    }

    /**
     * Create new chess piece at position
     * @param {Number} color
     * @param {Number} x 
     * @param {Number} y 
     * @param {typeof ChessPiece} piece Class that inherits ChessPiece
     */
    createPiece(color, x, y, piece) {
        if(x < 0 || x >= this.#width || y < 0 || y > this.#height) {
            throw new Error(`Position (${x}, ${y}) is outside of the board`)
        }
        if(!(piece.prototype instanceof ChessPiece || piece == ChessPiece)) {
            throw new Error(`value (${value}) isn't an instance of ChessPiece`)
        }

        this.#board[y][x] = new piece(color, x, y)
    }
}

/**
 * Create the default 8x8 chess board
 * @returns {ChessBoard}
 */
export function create8x8Board() {
    const board = new ChessBoard(8, 8);

    board.createPiece(COLORS.white, 0, 0, Rook)
    board.createPiece(COLORS.white, 1, 0, Knight)
    board.createPiece(COLORS.white, 2, 0, Bishop)
    board.createPiece(COLORS.white, 3, 0, King)
    board.createPiece(COLORS.white, 4, 0, Queen)
    board.createPiece(COLORS.white, 5, 0, Bishop)
    board.createPiece(COLORS.white, 6, 0, Knight)
    board.createPiece(COLORS.white, 7, 0, Rook)
    for(let i = 0; i < 8; i++) {
        board.createPiece(COLORS.white, i, 1, Pawn)
    }

    board.createPiece(COLORS.black, 0, 7, Rook)
    board.createPiece(COLORS.black, 1, 7, Knight)
    board.createPiece(COLORS.black, 2, 7, Bishop)
    board.createPiece(COLORS.black, 3, 7, King)
    board.createPiece(COLORS.black, 4, 7, Queen)
    board.createPiece(COLORS.black, 5, 7, Bishop)    
    board.createPiece(COLORS.black, 6, 7, Knight)
    board.createPiece(COLORS.black, 7, 7, Rook)
    for(let i = 0; i < 8; i++) {
        board.createPiece(COLORS.black, i, 6, Pawn)
    }
    return board;
}

console.warn('unbelievable, opening up the Console on my chess game?');
console.warn('Tbh you can probably disable the movement restrictions with some coding magic.');