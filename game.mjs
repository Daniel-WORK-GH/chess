import { ChessBoard, create8x8Board } from "./board.mjs";
import { COLORS } from "./lookup.mjs";
import { ChessHelper, ChessPiece, Pawn } from "./pieces.mjs";
import { ChessHumanPlayer } from "./player.mjs";
import { ChessScreen } from "./screen.mjs";
import { ChessSounds, SOUNDS } from "./sounds.mjs";

export class ChessGame {
    #board;
    #screen;
    #players;

    #turn;
    #turnIndex;

    constructor() {
        const canvas = document.getElementById('screen');

        this.#board = create8x8Board()

        this.#screen = new ChessScreen(canvas, this.#board)

        this.#players = [
            new ChessHumanPlayer(COLORS.white),
            new ChessHumanPlayer(COLORS.black),
        ]

        this.#turn = this.#players[0];
        this.#turnIndex = 0;

        this.promoting = false;

        canvas.addEventListener('mousedown',  (ev) => { this.#onMouseDown(ev) })
        canvas.addEventListener('mousemove',  (ev) => { this.#onMouseMove(ev) })
        canvas.addEventListener('mouseup',  (ev) => { this.#onMouseUp(ev) })
    
        this.#updateAttacks();

        this.#screen.setFlipped(false)
    }

    /**
     * Pass the turn to the next player in the list,
     * call after a move has been played
     */
    #gotoNextTurn() {
        this.#turnIndex = (this.#turnIndex + 1) % this.#players.length;
        this.#turn = this.#players[this.#turnIndex]

        this.#turn.isChecked = ChessHelper.isInCheck(
            this.#board,
            this.#turn.color
        )   

        const [width, height] = this.#board.getSize()
        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                const piece = this.#board.getPiece(j, i)

                if(piece instanceof Pawn) {
                    if(!piece.movedLastTurn) {
                        piece.movedTwoSquares = false;
                    }

                    piece.movedLastTurn = false;
                }
            }
        }
    }

    /**
     * Update each chess piece to store all
     * the position it attacks
     */
    #updateAttacks() {
        const [width, height] = this.#board.getSize()
        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                const piece = this.#board.getPiece(j, i)

                if(piece.id != 0) {
                    piece.updateAttackMoves(this.#board)
                }
            }
        }
    }

    /**
     * Get local mouse position
     */
    #getLocalMouse(event) {
        const rect = event.target.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const selectedy = this.#screen.isFlipped ? 
         rect.height - (event.clientY - rect.top) :
         event.clientY - rect.top;

        const cellx = Math.floor(x / this.#screen.cellWidth)
        const celly = Math.floor(selectedy / this.#screen.cellHeight)

        return [x, y, cellx, celly]
    }

    /**
     * @param {ChessGame} parent
     * @param {MouseEvent} event 
     */
    #onMouseDown(event) {
        const turn = this.#turn;
        const color = turn.color;
        const [x, y, cellx, celly] = this.#getLocalMouse(event)

        // Block all other input while promoting 
        if(this.promoting) {
            const constructor = this.#screen.getPromotingPieceClicked(x, y)

            if(constructor) {
                const x = this.promoting.x
                const y = this.promoting.y

                this.#board.createPiece(this.promoting.color, 
                    x, y, constructor)

                this.#screen.setPromoting(false)
                this.promoting = undefined;
            }
            return;
        }

        // Play as human
        if(turn instanceof ChessHumanPlayer) {

            if(turn.selectedPiece != undefined  && turn.selectedPiece.id != 0) return;

            // Check if the correct color piece was clicked
            const piece = this.#board.getPiece(cellx, celly)

            if(piece == undefined || piece.id == 0) return;
            if(piece.color != color) return;

            // Handle pick up
            turn.pickup(piece)
            piece.onPickup(this.#board)
            this.#screen.setPickedupPiece(turn.selectedPiece, x, y)
        }
    }

    /**
     * @param {MouseEvent} event 
     */
    #onMouseMove(event) {
        const turn = this.#turn;
        const color = turn.color;
        const [x, y, cellx, celly] = this.#getLocalMouse(event)

        // Play as human
        if(turn instanceof ChessHumanPlayer) {
            if(turn.selectedPiece != undefined && turn.selectedPiece.id != 0) {
                this.#screen.setPickedupPiece(turn.selectedPiece, x, y)
            }
        }
    }

    /**
     * @param {MouseEvent} event 
     */
    #onMouseUp(event) {
        const turn = this.#turn;
        const color = turn.color;
        const [x, y, cellx, celly] = this.#getLocalMouse(event)

        // Play as human
        if(turn instanceof ChessHumanPlayer) {
            if(turn.selectedPiece != undefined && turn.selectedPiece.id != 0) {
                const piece = turn.release()
                piece.startDrawing()
                this.#screen.setPickedupPiece(ChessPiece.None(), x, y)
                
                for(let i = 0; i < piece.validMoves.length; i++) {
                    const [x, y] = piece.validMoves[i];

                    if(x == cellx && y == celly) {
                        this.#board.takePiece(piece.x, piece.y, cellx, celly)
                        piece.onRelease(x, y, this.#board);
                        this.#updateAttacks();
                        this.#gotoNextTurn();

                        ChessSounds.playSound(SOUNDS.MOVE)

                        // Check if promotion
                        if(piece instanceof Pawn) {
                            if(piece.needsPromotion) {
                                this.promoting = piece;
                                this.#screen.setPromoting(piece.color)
                            }
                        }

                        // Check if game over
                        const checkmate = ChessHelper.isCheckmate(
                            this.#board,
                            this.#turn.color
                        )

                        if(checkmate) {
                            alert(`Checkmate, game over`)

                            location.reload();
                        }

                        break;
                    }
                }
            }
        }
    }
}