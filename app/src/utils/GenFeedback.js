import { visibilityCheck } from './InFrame';
import { playSoundCorrectRep, playText } from './Audio';
import { calculateAngle } from './Angles';

let repCount = 0;

/**
 * Generalized method to evaluate exercise state transitions based on joint angles and visibility.
 * Updates feedback and repetition count.
 *
 * @param {Object} exerInfo - Information about the exercise, including states, transitions, and joint definitions.
 * @param {Function} getTransitionType - Function to determine the type of state transition based on joint angles.
 * @param {string} currState - The current state of the exercise.
 * @param {Object} landmarks - The landmarks of the body to calculate joint angles.
 * @param {Function} onFeedbackUpdate - Callback function to update feedback messages.
 * @param {Function} setRepCount - Callback function to update the repetition count.
 * @returns {Object} - An object containing joint angles and the updated exercise state.
 */
export const genCheck = (exerInfo, getTransitionType, currState, landmarks, onFeedbackUpdate, setRepCount) => {
    if (currState === undefined) {
        currState = Object.keys(exerInfo.states)[0];
    }

    const jointAngles = {};

    // Dynamically calculate angles for all joints defined in jointInfo.jointAngles
    for (const [jointName, jointIndices] of Object.entries(exerInfo.jointInfo.jointAngles)) {
        jointAngles[jointName] = calculateAngle(
            landmarks[jointIndices[0]],
            landmarks[jointIndices[1]],
            landmarks[jointIndices[2]]
        );
    }

    // Check joints/limbs visibility
    let jointLandmarks = [];
    for (const jointName in exerInfo.jointInfo["joints"]) {
        const jointIndex = exerInfo.jointInfo["joints"][jointName];
        jointLandmarks.push(landmarks[jointIndex]);
    }

    if (!exerInfo.disableVisibilityCheck && !visibilityCheck(jointLandmarks)) {
        let feedback = "Make sure limbs are visible";
        onFeedbackUpdate(feedback);
        return { jointAngles, currState };
    }

    // Determine transition
    const transitionType = getTransitionType(jointAngles);

    // Perform the state transition if applicable
    if (transitionType && exerInfo.transitions[currState] && exerInfo.transitions[currState][transitionType]) {
        currState = exerInfo.transitions[currState][transitionType];

        if (exerInfo.states[currState].countRep) {
            repCount++;
            setRepCount(repCount);
            playSoundCorrectRep();
        }

        if (exerInfo.states[currState].audio) {
            playText(exerInfo.states[currState].feedback);
        }
    }

    onFeedbackUpdate(exerInfo.states[currState].feedback);
    return { jointAngles, currState };
};

/**
 * Resets rep count to specified value.
 *
 * @param {number} val - The value to set the rep count to.
 */
export const resetRepCount = (val) => {
    repCount = val;
};