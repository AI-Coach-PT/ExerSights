import rep from '../assets/correct.wav'

const playSoundCorrectRep = () => {
    const audio = new Audio(rep);
    audio.play();
}

let selectedVoice = null;
const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    selectedVoice = voices.find(voice => voice.name === "Google US English");
}

window.speechSynthesis.onvoiceschanged = setVoice;

const playText = (text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
}

export { playSoundCorrectRep, playText };