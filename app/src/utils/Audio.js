import rep from '../assets/correct.wav'

const playSoundCorrectRep = () => {
    const audio = new Audio(rep);
    audio.play();
}

const playText = () => {
    const audio = new Audio(rep);
    audio.play();
}

export { playSoundCorrectRep, playText };