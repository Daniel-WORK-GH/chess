import { ChessBoard } from "./board.mjs";
import { COLORS, COLOR_TO_ID, IMAGES } from "./lookup.mjs";
import { Bishop, ChessPiece, Knight, Queen, Rook } from "./pieces.mjs";

const brown = '#B0926A'
const lightBrown = '#E1C78F'
const transparent_green = '#58815788'

export class ChessScreen {
    
    /**
     * @param {String} canvasId 
     * @param {ChessBoard} gameboard 
     */
    constructor(canvas, gameboard) {
        /**
         * Hold the website canvas object
         * @type {HTMLCanvasElement}
         */
        this.screen = canvas

        this.gameboard = gameboard;

        const [width, height] = this.gameboard.getSize()

        this.cellWidth = Math.floor(this.screen.width / width);
        this.cellHeight = Math.floor(this.screen.width / height);

        this.darkSquareColor = brown
        this.lightSquareColor = lightBrown

        this.isFlipped = false;

        this.picedUpPiece = {
            x: 0,
            y: 0,
            id: 0,
        }

        this.validMoves = []
        
        this.promoting = false;

        setInterval(() => {
            this.#drawBoard()
            this.#drawValidMoves()
            this.#drawPieces()
            this.#drawPiece()

            if(this.promoting) {
                this.drawPromotionScreen(this.promoting)
            }
        }, 1/60 * 1000);
    }
 
    /**
     * Set if the board is flipped.
     * The default is white at the bottom,
     * When flipped black will be at the bottom.
     * @param {Boolean} flipped 
     */
    setFlipped(flipped) {
        this.isFlipped = flipped;
    }

    /**
     * @param {Number | false} promoting 
     */
    setPromoting(promoting) {
        this.promoting = promoting;
    }

    /**
     * Fills the alternating board colors.
     * Flips the board if setFlipped is true.
     */
    #drawBoard() {
        const ctx = this.screen.getContext("2d");

        const [width, height] = this.gameboard.getSize();

        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                let light = (j + i) % 2 == 0;

                ctx.fillStyle = light != this.isFlipped ? this.lightSquareColor : this.darkSquareColor;

                ctx.fillRect(
                    this.cellWidth * j,
                    this.cellHeight * i,
                    this.cellWidth,
                    this.cellHeight)
            }
        }
    }

    /**
     * Draw piece regardless of cell position,
     * used when picked up.
     */
    #drawPiece() {
        if(!this.picedUpPiece.id) return

        const ctx = this.screen.getContext("2d");

        const image = IMAGES[this.picedUpPiece.id];
        const width = this.cellWidth * 1.3
        const height = this.cellHeight * 1.3

        const x = this.picedUpPiece.x
        const y = this.picedUpPiece.y

        if(!image) {
            throw Error(`Couldn't find the matching id image.`)
        }
        
        ctx.drawImage(image, x - width / 2, y - height / 2, width, height)
    }

    /**
     * Set the currently picked up chess piece,
     * it will be drawn at position (x, y) and all
     * of its valid moves will be highlighted
     * @param {ChessPiece} piece 
     * @param {Number} x 
     * @param {Nubmer} y 
     */
    setPickedupPiece(piece, x, y) {
        this.picedUpPiece.x = x
        this.picedUpPiece.y = y
        this.picedUpPiece.id = piece.id
        
        this.validMoves = piece.validMoves
    }

    /**
     * Draw green square at every legal move
     */
    #drawValidMoves() {
        if(this.validMoves == undefined) return;
        
        const ctx = this.screen.getContext("2d");

        const [w, h] = this.gameboard.getSize()

        for(let i = 0; i < this.validMoves.length; i++) {
            const [x, y] = this.validMoves[i]

            ctx.fillStyle = transparent_green;

            let ydraw = (this.isFlipped ? h - y - 1 : y)

            ctx.fillRect(
                this.cellWidth * x,
                this.cellHeight * ydraw,
                this.cellWidth,
                this.cellHeight)
        }
    }

    /**
     * Draw only board pieces 
     */
    #drawPieces() {
        const ctx = this.screen.getContext("2d");
        
        const [w, h] = this.gameboard.getSize()

        for(let y = 0; y < h; y++){
            for(let x = 0; x < w; x++){
                const piece = this.gameboard.getPiece(x, y)

                if(piece == undefined || piece.id == 0) continue;

                if(!piece.isDrawing) continue

                const image = IMAGES[piece.id]

                if(piece.id == 0 || image == undefined) continue;
                
                let ydraw = (this.isFlipped ? h - y - 1 : y)

                ctx.drawImage(image,
                    this.cellWidth * x,
                    this.cellHeight * ydraw,
                    this.cellWidth,
                    this.cellHeight)
            }
        }
    }
    
    drawPromotionScreen(color) {
        const [w, h] = this.gameboard.getSize()

        const centerx = w * this.cellWidth / 2;
        const centery = h * this.cellHeight / 2;

        const offsetx = 4 * this.cellWidth / 2
        const offsety = this.cellHeight / 2

        const border = 2;
                
        const ctx = this.screen.getContext("2d");
        ctx.fillStyle = 'black'

        const width = offsetx * 2 + border * 5
        const height = offsety * 2 + border * 2

        const x = centerx - width / 2 + border;
        const y = centery - height / 2 + border;

        // Draw border
        ctx.fillRect(centerx - width / 2,
            centery - height / 2,
            width,
            height)

        ctx.fillStyle = lightBrown
        
        // Draw knight
        ctx.fillRect(x, y, this.cellWidth, this.cellHeight)
        ctx.drawImage(
            IMAGES[COLOR_TO_ID[color].knight],
            x, y,
            this.cellWidth,
            this.cellHeight)

        // Draw Bishop
        ctx.fillRect(x + this.cellWidth + border,
            y, this.cellWidth, this.cellHeight)    
        ctx.drawImage(
            IMAGES[COLOR_TO_ID[color].bishop],
            x + this.cellWidth, y,
            this.cellWidth,
            this.cellHeight)

        // Draw Rook
        ctx.fillRect(x + (this.cellWidth + border) * 2,
            y, this.cellWidth, this.cellHeight)
        ctx.drawImage(
            IMAGES[COLOR_TO_ID[color].rook],
            x + (this.cellWidth + border) * 2, y,
            this.cellWidth,
            this.cellHeight)

        // Draw Queen
        ctx.fillRect(x + (this.cellWidth + border) * 3,
            y, this.cellWidth, this.cellHeight)
        ctx.drawImage(
            IMAGES[COLOR_TO_ID[color].queen],
            x + (this.cellWidth + border) * 3, y,
            this.cellWidth,
            this.cellHeight)
    }

    getPromotingPieceClicked(x, y) {
        const [w, h] = this.gameboard.getSize()

        const centerx = w * this.cellWidth / 2;
        const centery = h * this.cellHeight / 2;

        const offsetx = 4 * this.cellWidth / 2
        const offsety = this.cellHeight / 2

        const border = 2;

        const width = offsetx * 2 + border * 5
        const height = offsety * 2 + border * 2

        const posx = centerx - width / 2 + border;
        const posy = centery - height / 2 + border;

        if(y < posy || x < posx || y > posy + height || x > posx + width) {
            return undefined;
        }

        const id = Math.floor((x - posx) / (this.cellWidth + border))

        if(id == 0) {
            return Knight
        }
        else if(id == 1) {
            return Bishop
        }
        else if(id == 2) {
            return Rook
        }
        else {
            return Queen
        }
    }
}