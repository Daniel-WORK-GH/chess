/// ---- COLORS AND PIECES IDS ----

/**
 * ---- PLAYER COLORS LOOK UP----
 */
export const COLORS = {
    white : 1,
    black : 2
}

/**
 * ---- PIECES ID LOOK UP ----
 */
export const COLOR_TO_ID = {
    [COLORS.white] : {
        pawn : 1,
        knight : 2,
        bishop : 3,
        rook : 4,
        queen : 5, 
        king : 6
    },
    [COLORS.black] : {
        pawn : 11,
        knight : 12,
        bishop : 13,
        rook : 14,
        queen : 15, 
        king : 16
    }
}

/// ---- IMAGES ----

function loadPieceImage(id, path) {
    const img = new Image();
    img.addEventListener("load", () => {
        IMAGES[id] = img
      },false,
    );
    img.src = path; 
    return img
}

const pawn_black = loadPieceImage(COLOR_TO_ID[COLORS.black].pawn, 'Assets/pawn_black.png')
const pawn_white = loadPieceImage(COLOR_TO_ID[COLORS.white].pawn, 'Assets/pawn_white.png')

const bishop_black = loadPieceImage(COLOR_TO_ID[COLORS.black].bishop, 'Assets/bishop_black.png')
const bishop_white = loadPieceImage(COLOR_TO_ID[COLORS.white].bishop, 'Assets/bishop_white.png')

const knight_black = loadPieceImage(COLOR_TO_ID[COLORS.black].knight, 'Assets/knight_black.png')
const knight_white = loadPieceImage(COLOR_TO_ID[COLORS.white].knight, 'Assets/knight_white.png')

const rook_black = loadPieceImage(COLOR_TO_ID[COLORS.black].rook, 'Assets/rook_black.png')
const rook_white = loadPieceImage(COLOR_TO_ID[COLORS.white].rook, 'Assets/rook_white.png')

const queen_black = loadPieceImage(COLOR_TO_ID[COLORS.black].queen, 'Assets/queen_black.png')
const queen_white = loadPieceImage(COLOR_TO_ID[COLORS.white].queen, 'Assets/queen_white.png')

const king_black = loadPieceImage(COLOR_TO_ID[COLORS.black].king, 'Assets/king_black.png')
const king_white = loadPieceImage(COLOR_TO_ID[COLORS.white].king, 'Assets/king_white.png')

/**
 * Convert piece id to its image
 */
export const IMAGES = {
    1: undefined,
}