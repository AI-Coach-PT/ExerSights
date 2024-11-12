import { calculateAngle } from './Angles';
import { playSoundCorrectRep, playText } from './Audio';
import { visibilityCheck } from './InFrame';

/** FSM list of 4 states and 3 types of transitions
 * States = Standing, descending, squatting, finished
 * Transitions = descending, hitTarget, finishing
 */
const squatStates = Object.freeze({
    STANDING: { feedback: "Please Begin Rep!", audio: false, countRep: false },
    DESCENDING: { feedback: "Go Down Lower!", audio: true, countRep: false },
    SQUATTING: { feedback: "Excellent!", audio: true, countRep: false },
    FINISHED: { feedback: "Excellent!", audio: false, countRep: true },
})

const transitions = {
    STANDING: {
        descending: "DESCENDING",
    },
    DESCENDING: {
        hitTarget: "SQUATTING",
        finishing: "STANDING",
    },
    SQUATTING: {
        finishing: "FINISHED",
    },
    FINISHED: {
        descending: "DESCENDING",
    },
};

const jointInfo = {
    joints: {
        leftHip: 23,
        leftKnee: 25,
        leftAnkle: 27,
        rightHip: 24,
        rightKnee: 26,
        rightAnkle: 28
    },
    jointAngles: {
        leftKneeAngle: [23, 25, 27],
        rightKneeAngle: [24, 26, 28]
    }
}

const thresholdAngle = 160;
let squatCount = 0;
let currState = "STANDING";

/**
 * Determines the type of transition based on knee angle.
 *
 * @param {number} leftKneeAngle The current left knee angle.
 * @param {number} rightKneeAngle The current right knee angle.
 * @param {number} targetKneeAngle The target knee angle for a squat.
 * @param {number} thresholdAngle The threshold knee angle for standing.
 * @returns {string|null} The type of transition ("descending", "hitTarget", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointAngles, targetKneeAngle, thresholdAngle) => {
    const leftKneeAngle = jointAngles["leftKneeAngle"];
    const rightKneeAngle = jointAngles["rightKneeAngle"];

    if (leftKneeAngle < targetKneeAngle && rightKneeAngle < targetKneeAngle)
        return "hitTarget";
    if (leftKneeAngle < thresholdAngle && rightKneeAngle < thresholdAngle)
        return "descending";
    if (leftKneeAngle > thresholdAngle || rightKneeAngle > thresholdAngle)
        return "finishing";
    return null;
};

/**
 * Monitors and tracks squat repetitions by analyzing the knee angle from pose landmarks.
 * Provides real-time feedback based on the depth of the squat.
 *
 * @param {Array} landmarks An array of pose landmarks containing the coordinates of different body points.
 * @param {Function} onFeedbackUpdate A callback function that receives the feedback message about the squat depth and form.
 * @param {Function} setCurrKneeAngle A function to update the current knee angle for display purposes.
 * @param {Function} setRepCount A function to update the squat count after a full squat is completed.
 * @param {number} targetKneeAngle The angle (in degrees) a user's knee must break (go below) to count as proper repetition.
 */
export const checkSquats = (landmarks, onFeedbackUpdate, setCurrKneeAngle, setRepCount, targetKneeAngle = 90) => {
    const jointAngles = {};

    // Dynamically calculate angles for all joints defined in jointInfo.jointAngles
    for (const [jointName, jointIndices] of Object.entries(jointInfo.jointAngles)) {
        jointAngles[jointName] = calculateAngle(
            landmarks[jointIndices[0]],
            landmarks[jointIndices[1]],
            landmarks[jointIndices[2]]
        );
    }

    setCurrKneeAngle(jointAngles["leftKneeAngle"]);

    // Check joints/limbs visibility
    let jointLandmarks = [];
    for (const jointName in jointInfo["joints"]) {
        const jointIndex = jointInfo["joints"][jointName];
        jointLandmarks.push(landmarks[jointIndex]);
    }

    if (!visibilityCheck(jointLandmarks)) {
        let feedback = "Make sure limbs are visible";
        onFeedbackUpdate(feedback);
        return;
    }

    // Determine transition
    const transitionType = getTransitionType(jointAngles, targetKneeAngle, thresholdAngle);

    // Perform the state transition if applicable
    if (transitionType && transitions[currState] && transitions[currState][transitionType]) {
        currState = transitions[currState][transitionType];

        if (squatStates[currState].countRep) {
            squatCount++;
            setRepCount(squatCount);
            playSoundCorrectRep();
        }

        if (squatStates[currState].audio) {
            playText(squatStates[currState].feedback);
        }
    }

    onFeedbackUpdate(squatStates[currState].feedback);
};

/**
 * Monitors and provides feedback to ensure the user is keeping their chest up during the squat.
 * Compares the angle formed by the shoulder, hip, and knee to determine if the chest is sagging.
 *
 * @param {Array} landmarks An array of pose landmarks containing the coordinates of different body points.
 * @param {Function} onFeedbackUpdate A callback function that receives the feedback message about chest posture.
 * @param {number} targetHipAngle The minimum hip angle (in degrees) for proper chest position (with slight forward lean).
 * Chest should not drop below this angle.
 */
export const checkChestUp = (landmarks, onFeedbackUpdate, targetHipAngle = 45) => {
    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];

    const rightShoulder = landmarks[12];
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];

    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    let feedback = "";

    if (leftHipAngle < targetHipAngle || rightHipAngle < targetHipAngle) {
        feedback = "Chest up!";
    }

    onFeedbackUpdate(feedback);
};

/**
 * Resets squat count to specified value and resets squat position state.
 *
 * @param {number} val - The value to set the squat count to.
 */
export const setSquatCount = (val) => {
    squatCount = val;
};