import rep from "../../assets/correct.wav";

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
    }
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
 * Plays an audio file for correct repetition feedback, acquiring a lock.
 */
const playSoundCorrectRep = async () => {
  try {
    await navigator.locks.request("audioPlayback", async (lock) => {
      if (!unlocked) {
        console.warn("Audio not unlocked yet");
        return;
      }
      sharedAudio.currentTime = 0;
      await sharedAudio.play().catch((err) => {
        console.warn("Audio playback failed", err);
      });
      // The lock is held until this async function completes.
      // The next audio function can now acquire the lock.
    });
  } catch (error) {
    console.error("Error acquiring audio playback lock:", error);
  }
};

/**
 * Sets voiceName string to parameter name.
 */
const setVoiceName = (name) => {
  voiceName = name;
};

/**
 * Returns voiceName string value.
 */
const getVoiceName = () => {
  if (selectedVoice) return selectedVoice.name;

  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    return voices.find((voice) => voice.default)?.name || voices[0].name;
  }

  return "None";
};

/**
 * Sets text-to-speech voice to voiceName string value.
 * Only called when all available voices have been loaded.
 */
const setVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  selectedVoice = voices.find((voice) => voice.name === voiceName);
};
window.speechSynthesis.onvoiceschanged = setVoice;

/**
 * Converts the provided string to speech using the selected voice, acquiring a lock.
 * @param {string} text - The text to be converted to audio.
 */
const playText = async (text) => {
  try {
    await navigator.locks.request("audioPlayback", async (lock) => {
      if (!speechUnlocked || voiceName === "None") {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;

      // Wrap the speak call in a Promise to await its completion
      await new Promise((resolve, reject) => {
        utterance.onend = resolve;
        utterance.onerror = reject;
        window.speechSynthesis.speak(utterance);
      });
      // The lock is held until the speech finishes.
    });
  } catch (error) {
    console.error("Error acquiring audio playback lock:", error);
  }
};

export { playSoundCorrectRep, playText, setVoiceName, getVoiceName, setVoice, unlockAudio };
