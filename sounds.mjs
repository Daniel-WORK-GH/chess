var move = new Audio('Assets/sounds.mp3');

export const SOUNDS = {
    MOVE: move,
    CAPTURE: move,
    CHECK: move,
    MATE: move,
}

export class ChessSounds {
    /**
     * @param {HTMLAudioElement} sound 
     */
    static playSound(sound) {
        sound.play()
    }
}