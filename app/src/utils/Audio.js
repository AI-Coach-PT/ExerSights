import rep from '../assets/correct.wav'

const voiceName = "Google US English";
let selectedVoice = null;

/**
 * Plays an audio file for correct repetition feedback.
 */
const playSoundCorrectRep = () => {
    const audio = new Audio(rep);
    audio.play();
}

/**
 * Sets text-to-speech voice to "Google US English".
 * Only called when all available voices have been loaded.
 */
const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    selectedVoice = voices.find(voice => voice.name === voiceName);
}
window.speechSynthesis.onvoiceschanged = setVoice;

/**
 * Converts the provided string to speech using the selected voice.
 * @param {string} text - The text to be converted to audio.
 */
const playText = (text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
}

export { playSoundCorrectRep, playText };