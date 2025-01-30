import { visibilityCheck } from './helpers/InFrame';
import { playSoundCorrectRep, playText } from './helpers/Audio';
import { calculateAngle } from './helpers/Angles';

let repCount = 0;

/**
 * Generalized method to evaluate exercise state transitions based on joint angles and visibility.
 * Updates feedback, repetition count, and allows for custom logic (e.g., updating joint angles).
 *
 * @param {Object} exerInfo - Information about the exercise, including states, transitions, and joint definitions.
 * @param {Function} getTransitionType - Function to determine the type of state transition based on joint angles.
 * @param {string} currState - The current state of the exercise.
 * @param {Object} landmarks - The landmarks of the body to calculate joint angles.
 * @param {Function} onFeedbackUpdate - Callback function to update feedback messages.
 * @param {Function} setRepCount - Callback function to update the repetition count.
 * @param {Object} [angleHandlers={}] - Optional front-end handlers to update specific angles on the front-end pages, keyed by angle name.
 * @returns {Object} - An object containing joint angles and the updated exercise state.
 */
export const genCheck = (
    exerInfo,
    getTransitionType,
    currState,
    landmarks,
    onFeedbackUpdate,
    setRepCount,
    angleHandlers = {}
) => {
    if (!landmarks) {
        if (!exerInfo.disableVisibilityCheck) {
            onFeedbackUpdate("Get in frame!");
        }
        else {
            onFeedbackUpdate("");
        }
        return;
    }

    if (currState === undefined) {
        currState = Object.keys(exerInfo.states)[0];
    }

    const jointData = {};

    // Dynamically calculate angles for all joints defined in jointInfo.jointAngles
    if (exerInfo.jointInfo.jointAngles) {
        for (const [jointName, jointIndices] of Object.entries(exerInfo.jointInfo.jointAngles)) {
            jointData[jointName] = calculateAngle(
                landmarks[jointIndices[0]],
                landmarks[jointIndices[1]],
                landmarks[jointIndices[2]]
            );
        }
    }

    // Dynamically pass positions for all joints defined in jointInfo.jointPositions
    if (exerInfo.jointInfo.jointPos) {
        for (const [jointName, jointIndex] of Object.entries(exerInfo.jointInfo.jointPos)) {
            jointData[jointName] = {
                x: landmarks[jointIndex].x,
                y: landmarks[jointIndex].y,
                z: landmarks[jointIndex].z
            };
        }
    }

    // Populate left side joints
    let leftJointLandmarks = [];
    for (const jointName in exerInfo.jointInfo.joints.left) {
        const jointIndex = exerInfo.jointInfo.joints.left[jointName];
        leftJointLandmarks.push(landmarks[jointIndex]);
    }

    // Populate right side joints
    let rightJointLandmarks = [];
    for (const jointName in exerInfo.jointInfo.joints.right) {
        const jointIndex = exerInfo.jointInfo.joints.right[jointName];
        rightJointLandmarks.push(landmarks[jointIndex]);
    }

    // Check joints/limbs visibility
    if (!exerInfo.disableVisibilityCheck && !visibilityCheck(leftJointLandmarks) && !visibilityCheck(rightJointLandmarks)) {
        let feedback = "Make sure limbs are visible";
        onFeedbackUpdate(feedback);
        return currState;
    }

    // Determine which side is closer to camera, left or right
    const closerSide = getCloserSide(leftJointLandmarks, rightJointLandmarks);

    // Determine transition
    const transitionType = getTransitionType(jointData, closerSide);

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

    // Handle angle updates for front-end
    for (const [angleName, updateFunc] of Object.entries(angleHandlers)) {
        let fullAngleName = `${closerSide}${angleName}`;

        // rare case if specific angle side is already passed
        if (angleName.includes("left") || angleName.includes("right")) {
            fullAngleName = `${angleName}`;
        }

        if (jointData[fullAngleName] !== undefined) {
            updateFunc(jointData[fullAngleName]);
        }
    }

    onFeedbackUpdate(exerInfo.states[currState].feedback);
    return currState;
};

/**
 * Determines which side (left or right) is closer to the camera based on average z-values.
 *
 * @param {Array} leftLandmarks - An array of landmarks for the left side.
 * @param {Array} rightLandmarks - An array of landmarks for the right side.
 * @returns {string} "left" if the left side is closer, "right" otherwise.
 */
function getCloserSide(leftLandmarks = [], rightLandmarks = []) {
    let leftTotalZ = 0;
    for (const landmark of leftLandmarks) {
        leftTotalZ += landmark.z;
    }

    let rightTotalZ = 0;
    for (const landmark of rightLandmarks) {
        rightTotalZ += landmark.z;
    }

    const avgLeftZ = leftTotalZ / leftLandmarks.length;
    const avgRightZ = rightTotalZ / rightLandmarks.length;

    return avgLeftZ < avgRightZ ? "left" : "right";
}

/**
 * Resets rep count to specified value.
 *
 * @param {number} val - The value to set the rep count to.
 */
export const resetRepCount = (val) => {
    repCount = val;
};