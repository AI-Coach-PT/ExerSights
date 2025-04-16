import rep from '../../assets/correct.wav';

let voiceName = "Google US English";
let selectedVoice = null;

let unlocked = false;
let speechUnlocked = false;
let sharedAudio = new Audio(rep);

/**
 * Unlocks audio playback (needed for mobile browsers).
 */
const unlockAudio = () => {
    if (!unlocked) {
        try {
            const context = new window.AudioContext();
            const buffer = context.createBuffer(1, 1, 22050);
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
            unlocked = true;
        } catch (err) {
            console.warn("Failed to unlock audio", err);
        };
    }

    if (!speechUnlocked) {
        const utterance = new SpeechSynthesisUtterance("unlock");
        utterance.volume = 0;
        utterance.onend = () => {
            speechUnlocked = true;
        };
        try {
            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.warn("Failed to unlock speech", err);
        }
    }
};

/**
 * Plays an audio file for correct repetition feedback.
 */
const playSoundCorrectRep = () => {
    if (!unlocked) {
        console.warn("Audio not unlocked yet");
        return;
    }
    sharedAudio.currentTime = 0;
    sharedAudio.play().catch((err) => {
        console.warn("Audio playback failed", err);
    });
};

/**
 * Sets voiceName string to parameter name.
 */
const setVoiceName = (name) => {
    voiceName = name;
}

/**
 * Returns voiceName string value.
 */
const getVoiceName = () => {
    if (selectedVoice)
        return selectedVoice.name;

    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
        return voices.find(voice => voice.default)?.name || voices[0].name;
    }

    return "None";
}

/**
 * Sets text-to-speech voice to voiceName string value.
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
    if (!speechUnlocked || voiceName === "None") {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
}

export {
    playSoundCorrectRep,
    playText,
    setVoiceName,
    getVoiceName,
    setVoice,
    unlockAudio
};