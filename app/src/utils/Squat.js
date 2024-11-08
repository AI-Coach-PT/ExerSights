import { calculateAngle } from './Angles';
import { playSoundCorrectRep, playText } from './Audio';
import { inFrame } from './InFrame';

let squatCount = 0;
let inSquatPosition = false;
let lastFeedback = "";

/**
 * Monitors and tracks squat repetitions by analyzing the knee angle from pose landmarks.
 * Provides real-time feedback based on the depth of the squat.
 *
 * @param {Array} landmarks An array of pose landmarks containing the coordinates of different body points.
 * @param {Function} onFeedbackUpdate A callback function that receives the feedback message about the squat depth and form.
 * @param {Function} setLeftKneeAngle A function to update the current knee angle for display purposes.
 * @param {Function} setRepCount A function to update the squat count after a full squat is completed.
 * @param {number} targetKneeAngle The angle (in degrees) a user's knee must break (go below) to count as proper repetition.
 */
export const checkSquats = (landmarks, onFeedbackUpdate, setCurrKneeAngle, setRepCount, targetKneeAngle = 90) => {
    const thresholdAngle = 160;

    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    setCurrKneeAngle(leftKneeAngle);

    let feedback = "Please Begin Rep!";

    const left_in_frame = inFrame(leftHip, leftAnkle, undefined, undefined)
    const right_in_frame = inFrame(rightHip, rightAnkle, undefined, undefined)

    if (!left_in_frame && !right_in_frame) {
        feedback = "Make sure limbs are visible";
        lastFeedback = feedback;
        onFeedbackUpdate(feedback);
        return;
    }

    if (((leftKneeAngle < thresholdAngle && leftKneeAngle > targetKneeAngle) ||
        (rightKneeAngle < thresholdAngle && rightKneeAngle > targetKneeAngle)) &&
        !inSquatPosition) {
        feedback = "Go Down Lower!";
    } else if (leftKneeAngle < targetKneeAngle || rightKneeAngle < targetKneeAngle) {
        feedback = "Excellent!"
        inSquatPosition = true;
    } else if (leftKneeAngle > thresholdAngle && rightKneeAngle > thresholdAngle) {
        if (inSquatPosition) {
            feedback = "Excellent!"
            squatCount++;
            inSquatPosition = false;
            playSoundCorrectRep();
            setRepCount(squatCount);
        }
    } else {
        if (inSquatPosition) {
            feedback = "Excellent!"
        }
    }

    // only play feedback audio from begin -> go down lower and from lower -> excellent
    if ((feedback === "Go Down Lower!" && lastFeedback === "Please Begin Rep!")
        || (feedback === "Excellent!" && lastFeedback === "Go Down Lower!")) {
        playText(feedback);
    }

    lastFeedback = feedback;
    onFeedbackUpdate(feedback);
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
    inSquatPosition = false;
};