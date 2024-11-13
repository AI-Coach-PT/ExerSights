import { visibilityCheck } from './InFrame';
import { playSoundCorrectRep, playText } from './Audio';
import { calculateAngle } from './Angles';

let repCount = 0;

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
 * Resets squat count to specified value and resets squat position state.
 *
 * @param {number} val - The value to set the squat count to.
 */
export const resetRepCount = (val) => {
    repCount = val;
};