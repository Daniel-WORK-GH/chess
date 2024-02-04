import { ChessBoard } from "./board.mjs"
import { COLORS, COLOR_TO_ID } from "./lookup.mjs"

export class ChessHelper {
    static getPieceMoves(piece, board) {
        if(piece instanceof Pawn) {
            return this.getPawnMoves(piece, board)
        }
        if(piece instanceof Knight) {
            return this.getKnightMoves(piece, board)
        }
        else if(piece instanceof Bishop) {
            return this.getBishopMoves(piece, board)
        }
        else if(piece instanceof Rook) {
            return this.getRookMoves(piece, board)
        }
        else if(piece instanceof Queen) {
            return this.getQueenMoves(piece, board)
        }
        else if(piece instanceof King) {
            return this.getKingMoves(piece, board)
        }
    }

    /**
     * @param {Pawn} pawn 
     * @param {ChessBoard} board 
     */
    static getPawnAttacks(pawn, board) {
        const [w, h] = board.getSize()
        const x = pawn.x
        const y = pawn.y

        const validMoves = [];

        let newy = pawn.color == COLORS.white ? y + 1 : y - 1;

        if(x - 1 >= 0) {
            validMoves.push([x - 1, newy])
        }

        if(x + 1 < w) {
            validMoves.push([x + 1, newy])
        }

        return validMoves;
    }

    /**
     * @param {Pawn} pawn 
     * @param {ChessBoard} board 
     */
    static getPawnMoves(pawn, board) {
        const [w, h] = board.getSize()
        const x = pawn.x
        const y = pawn.y

        const validMoves = [];

        let newy = pawn.color == COLORS.white ? y + 1 : y - 1;

        if(board.getPiece(x, newy).id == 0) {
            validMoves.push([x, newy])

            if(!pawn.moved) {     
                const newy = pawn.color == COLORS.white ? y + 2 : y - 2;

                if(board.getPiece(x, newy).id == 0) {
                    validMoves.push([x, newy])
                }
            }
        }

        if(x - 1 >= 0 && board.getPiece(x - 1, newy).id != 0) {
            validMoves.push([x - 1, newy])
        }

        if(x + 1 < w && board.getPiece(x + 1, newy).id != 0) {
            validMoves.push([x + 1, newy])
        }

        // Check for en passant
        if(x - 1 >= 0 && board.getPiece(x - 1, y) instanceof Pawn) {
            const piece = board.getPiece(x - 1, y)

            if(piece.color != pawn.color && piece.movedTwoSquares) {
                validMoves.push([x - 1,
                    pawn.color == COLORS.white ? y + 1 : y - 1])
            }
        }
        if(x + 1 < w && board.getPiece(x + 1, y) instanceof Pawn) {
            const piece = board.getPiece(x + 1, y)

            if(piece.color != pawn.color && piece.movedTwoSquares) {
                validMoves.push([x + 1,
                    pawn.color == COLORS.white ? y + 1 : y - 1])
            }
        }

        return validMoves;
    }
    
    static getKnightMoves(knight, board) {
        const x = knight.x
        const y = knight.y

        const validMoves = [];

        validMoves.push([x - 1, y - 2])
        validMoves.push([x + 1, y - 2])
        validMoves.push([x - 2, y - 1])
        validMoves.push([x + 2, y - 1])

        validMoves.push([x - 1, y + 2])
        validMoves.push([x + 1, y + 2])
        validMoves.push([x - 2, y + 1])
        validMoves.push([x + 2, y + 1])
 
        return validMoves;
    }

    static getBishopMoves(bishop, board) {
        const [w, h] = board.getSize()
        const x = bishop.x
        const y = bishop.y

        const validMoves = [];

        let tl = true;
        let tr = true;
        let bl = true;
        let br = true;

        for(let i = 1; i < 8; i++) {
            if(tl) {
                validMoves.push([x - i, y - i])
                if(y - i < 0 || x - i < 0 || board.getPiece(x - i, y - i).id != 0) {
                    tl = false;
                }
            }
            if(tr) {
                validMoves.push([x + i, y - i])
                if(x + i >= w || y - i < 0 || board.getPiece(x + i, y - i).id != 0) {
                    tr = false;
                }
            }
            if(bl) {
                validMoves.push([x - i, y + i])
                if(x - i < 0 || y + i >= h || board.getPiece(x - i, y + i).id != 0) {
                    bl = false;
                }
            }
            if(br) {
                validMoves.push([x + i, y + i])
                if(y + i >= h || x + i >= w || board.getPiece(x + i, y + i).id != 0) {
                    br = false;
                }
            }
        }
        
        return validMoves;
    }

    static getRookMoves(rook, board) {
        const [w, h] = board.getSize()
        const x = rook.x
        const y = rook.y

        const validMoves = []

        let t = true;
        let l = true;
        let r = true;
        let b = true;

        for(let i = 1; i < 8; i++) {
            if(t) {
                validMoves.push([x, y - i])
                if(y - i < 0 || board.getPiece(x, y - i).id != 0) t = false;
            }
            if(l) {
                validMoves.push([x - i, y])
                if(x - i < 0 || board.getPiece(x - i, y).id != 0) l = false;
            }
            if(r) {
                validMoves.push([x + i, y])
                if(x + i>= w || board.getPiece(x + i, y).id != 0) r = false;
            }
            if(b) {
                validMoves.push([x, y + i])
                if(y + i>= h || board.getPiece(x, y + i).id != 0) b = false;
            }
        }

        return validMoves;
    }

    static getQueenMoves(queen, board) {
        const rookMoves = this.getRookMoves(queen, board);
        const bishopMoves = this.getBishopMoves(queen, board);

        return rookMoves.concat(bishopMoves)
    }

    /**
     * @param {King} king 
     * @param {ChessBoard} board 
     * @returns 
     */
    static getKingMoves(king, board) {
        king.castleOptions = [];

        const x = king.x
        const y = king.y

        const [w, h] = board.getSize();

        const validMoves = []

        validMoves.push([x - 1, y - 1])
        validMoves.push([x, y - 1])
        validMoves.push([x + 1, y - 1])
        validMoves.push([x - 1, y])
        validMoves.push([x + 1, y])
        validMoves.push([x - 1, y + 1])
        validMoves.push([x, y + 1])
        validMoves.push([x + 1, y + 1])

        let checkright = true;
        let checkleft = true;

        // Check for castle
        if(!king.moved) {
            // Find rook in the same row
            for(let i = 1; i < w; i++) {
                if(checkleft){
                    if(x - i < 0) {
                        checkleft = false;
                        continue;
                    }

                    const pieceleft = board.getPiece(x - i, y)
                    if(pieceleft instanceof Rook && pieceleft.color == king.color) {
                        if(!pieceleft.moved) {
                            validMoves.push([x - 2, y])
                            
                            king.castleOptions.push({
                                kingx: x - 2,
                                kingy: y,
                                rookx: x - 1,
                                rooky: y,
                                rook: pieceleft
                            })

                            checkleft = false;
                        }
                    } else if(pieceleft.id != 0) {
                        checkleft = false;
                    }
                }

                if(checkright){
                    if(x + i >= w) {
                        checkright = false;
                        continue;
                    }

                    const pieceright = board.getPiece(x + i, y)
                    if(pieceright instanceof Rook && pieceright.color == king.color) {
                        if(!pieceright.moved) {
                            validMoves.push([x + 2, y])
                            
                            king.castleOptions.push({
                                kingx: x + 2,
                                kingy: y,
                                rookx: x + 1,
                                rooky: y,
                                rook: pieceright
                            })

                            checkright = false;
                        }
                    } else if(pieceright.id != 0) {
                        checkright = false;
                    }
                }
            }
        }
        return validMoves;
    }

    /**
     * Get all the square that can capture this player
     * @param {Number} color 
     */
    static getAttackedSquares(board, color) {
        const attacked = []
        const [w, h] = board.getSize()
        
        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                const piece = board.getPiece(j, i)

                if(piece.id != 0 && piece.color != color) {
                    for(let k = 0; k < piece.attacking.length; k++) {
                        attacked.push(piece.attacking[k])
                    }
                }
            }
        }

        return attacked;
    }

    static #findKing(board, color) {         
        const [w, h] = board.getSize()

        // Find king
        for(let y = 0; y < h; y++) {
            for(let x = 0; x < w; x++) {
                const piece = board.getPiece(x, y)

                if(piece instanceof King && piece.color == color) {
                    return [x, y]
                }
            }
        }
    }

    /**
     * Check if a player of {color} is in check
     * @param {Number[][]} checkedList list of (x, y) positions on board
     * @param {ChessBoard} board
     * @param {Number} color
     */
    static isInCheck(board, color) {
        const checkedList = this.getAttackedSquares(board, color)

        const [kingx, kingy] = this.#findKing(board, color)

        for(let i = 0; i < checkedList.length; i++) {
            const [x, y] = checkedList[i]

            if(kingx == x && kingy == y) {
                return true
            }
        }

        return false;
    }

    /**
     * Checek if moving a chess piece from (x1, y1) to
     *  (x2, y2) will resolve the check
     * @param {Number} x1 
     * @param {Number} y1 
     * @param {Number} x2 
     * @param {Number} y2 
     * @param {ChessBoard} board
     * @param {Number} color
     */
    static willResolveCheck(x1, y1, x2, y2, board, color) {   
        const [w, h] = board.getSize()
        
        const start = board.getPiece(x1, y1)
        const end = board.getPiece(x2, y2)

        board.takePiece(x1, y1, x2, y2)

        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                const piece = board.getPiece(j, i)

                if(piece.id == 0) continue;

                piece.updateAttackMoves(board)
            }
        }

        const resolved = this.isInCheck(board, color)
        
        board.setPiece(x1, y1, start)
        board.setPiece(x2, y2, end)

        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                const piece = board.getPiece(j, i)

                if(piece.id == 0) continue;

                piece.updateAttackMoves(board)
            }
        }

        return !resolved;
    }

    /**
     * Check if a color lost the game
     * @param {ChessBoard} board
     * @param {Number} color
     */
    static isCheckmate(board, color) {        
        const [w, h] = board.getSize()

        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                const piece = board.getPiece(j, i)

                if(piece.id == 0 || piece.color != color) continue;

                const moves = piece.getValidMoves(board)

                if(moves.length != 0) {
                    return false
                }
            }
        }

        return true;
    }
}

export class ChessPiece {
    static #none;

    static {
        this.#none = new ChessPiece();
    }

    constructor(color, x, y, id = 0) {
        this.id = id
        this.color = color
        this.x = x
        this.y = y

        this.validMoves = [];

        /**
         * List of all positions that are 
         * defended by this piece
         */
        this.attacking = [];

        this.isDrawing = true;

        this.moved = false;
    }

    static None() {
        return this.#none;
    }

    /**
     * Set the current position of the chess piece
     * @param {Number} x 
     * @param {Number} y 
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Stop drawing piece on chess board
     */
    stopDrawing() {
        this.isDrawing = false;
    }

    /**
     * Start drawing piece on chess board
     */
    startDrawing() {
        this.isDrawing = true;
    }

    /**
     * Get a list of all valid moves
     * @returns {Number[][]}
     */
    getValidMoves(board) {
        this.#clearValidMoves();
        this.#getAllMoves(board);
        this.#filterValidMoves(board)
        return this.validMoves;
    }

    /**
     * Update the attacking squares of the chess piece
     * based on its type and current location
     * @param {ChessBoard} board
     */
    updateAttackMoves(board) {
        this.attacking = ChessHelper.getPieceMoves(this, board)
        this.#filterAttackMoves(board)
    }

    /**
     * The default pickup behaviour,
     * Call for every chess piece
     * @param {ChessBoard} board
     */
    onPickup(board) { 
        this.#clearValidMoves();
        this.stopDrawing()

        this.#getAllMoves(board);
        this.#filterValidMoves(board)
    }

    /**
     * The default move behaviour,
     * Call for every chess piece
     * @param {ChessBoard} board
     */
    onMove(board) { 
        // Nothing to do
    }

    /**
     * The default release behaviour,
     * Call for every chess piece
     * @param {Number} x new x value
     * @param {Number} y new y value
     * @param {ChessBoard} board
     */
    onRelease(x, y, board) { 
        if(this.x != x || this.y != y) {
            this.moved = true;
        }

        this.#clearValidMoves()

        this.x = x;
        this.y = y;

        this.startDrawing();
    }

    /**
     * Get all the available moves the current
     * piece make, based on its child class
     * @param {ChessBoard} board 
     */
    #getAllMoves(board) {
        const moves = ChessHelper.getPieceMoves(this, board);
            
        for(let i = 0; i < moves.length; i++) {
            const move = moves[i]
            this.validMoves.push(move)
        }

        this.#filterValidMoves(board)
    }

    /**
     * Remove all the moves that are outside of the board 
     *  + all the positions that are taked by a same color piece
     * @param {ChessBoard} board
     */
    #filterValidMoves(board) {
        const [w, h] = board.getSize()

        this.validMoves = this.validMoves.filter(
            (value) => {
                const [x, y] = value;

                if(x < 0 || y < 0 || x >= w || y >= h) {
                    return false;
                }
                
                if(board.getPiece(x, y).color == this.color) {
                    return false;
                }

                if(!ChessHelper.willResolveCheck(this.x,
                    this.y, x, y, board, this.color)) {
                    return false;
                }

                return true;
            }
        )
    }
    
    /**
     * Remove all the moves that are outside of the board
     * @param {ChessBoard} board 
     */
    #filterAttackMoves(board) {
        const [w, h] = board.getSize()
        
        this.attacking = this.attacking.filter(
            (value) => {
                const [x, y] = value;

                if(x < 0 || y < 0 || x >= w || y >= h) {
                    return false;
                }

                return true;
            }
        )
    }

    /**
     * Clear all the available moves
     */
    #clearValidMoves() {
        while(this.validMoves.length > 0) {
            this.validMoves.pop();
        }
    }
}

export class Pawn extends ChessPiece {
    constructor(color, x, y) {
        super(color, x, y, COLOR_TO_ID[color].pawn)

        this.moved = false;

        this.movedTwoSquares = false;

        this.movedLastTurn = false;

        this.needsPromotion = false;
    }

    updateAttackMoves(board) {
        const [w, h] = board.getSize();

        this.attacking = ChessHelper.getPawnAttacks(this, board).filter(
            (value) => {
                const [x, y] = value;

                if(x < 0 || y < 0 || x >= w || y >= h) {
                    return false;
                }

                return true;
            }
        )
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {ChessBoard} board 
     */
    onRelease(x, y, board) {
        const dist = (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y)
        if(dist >= 4) {
            // Moved twice
            this.movedTwoSquares = true;

            this.movedLastTurn = true;
        }
        else if(dist >= 2) {
            const prevy = this.y;
            
            board.setPiece(x, prevy, ChessPiece.None()
            
            )
        }
        else {
            this.movedTwoSquares = false;

            this.movedLastTurn = false;
        }

        let movedThisTurn = false;

        if(this.x != x || this.y != y) {
            movedThisTurn = true;
        }

        super.onRelease(x, y, board)

        // Check for promotion
        if(movedThisTurn) {
            const [w, h] = board.getSize()

            if(this.color == COLORS.white) {
                if(y == h - 1) { // Promote white
                    this.needsPromotion = true;
                }
            }
            else if(this.color == COLORS.black) {
                if(y == 0) { // Promote black
                    this.needsPromotion = true;
                }
            }
        }
    }
}

export class Knight extends ChessPiece {
    constructor(color, x, y) {
        super(color, x, y, COLOR_TO_ID[color].knight)
    }
}

export class Bishop extends ChessPiece {
    constructor(color, x, y) {
        super(color, x, y, COLOR_TO_ID[color].bishop)
    }
}

export class Rook extends ChessPiece {
    constructor(color, x, y) {
        super(color, x, y, COLOR_TO_ID[color].rook)
    }
}

export class Queen extends ChessPiece {
    constructor(color, x, y) {
        super(color, x, y, COLOR_TO_ID[color].queen)
    }
}

export class King extends ChessPiece {
    constructor(color, x, y) {
        super(color, x, y, COLOR_TO_ID[color].king)

        /**
         * Stores a list of all castleing options
         */
        this.castleOptions = []
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {ChessBoard} board 
     */
    onRelease(x, y, board) {
        if((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y) >= 4) {
            // Castled
            for (let i = 0; i < this.castleOptions.length; i++) {
                const op = this.castleOptions[i];
                
                if(op.kingx == x && op.kingy == y) {
                    const rook = op.rook

                    board.takePiece(rook.x, rook.y,
                        op.rookx, op.rooky)
                    
                    rook.onRelease(op.rookx, op.rooky, board)
                }
            }   
        }

        super.onRelease(x, y, board)
    }
}