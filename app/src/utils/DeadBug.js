import { calculateAngle } from "./Angles";
import { inFrame } from './InFrame';

let deadBugCount = 0;
let inDeadBugPosition = false;

/**
 * Checks the user's position for the Dead Bug exercise and updates the state accordingly.
 *
 * @param {Array} landmarks - The body landmarks detected by the pose estimation model.
 * @param {number} targetFlatAngle - The target angle for considering a limb as extended.
 * @param {function} setLeftUnderarmAngle - Function to update the left underarm angle.
 * @param {function} setRightUnderarmAngle - Function to update the right underarm angle.
 * @param {function} setLeftHipAngle - Function to update the left hip angle.
 * @param {function} setRightHipAngle - Function to update the right hip angle.
 * @param {function} setFeedback - Function to update the feedback message.
 * @param {function} setRepCount - Function to update the repetition count.
 */
export const checkDeadBug = (
    landmarks,
    targetFlatAngle,
    setLeftUnderarmAngle,
    setRightUnderarmAngle,
    setLeftHipAngle,
    setRightHipAngle,
    setFeedback,
    setRepCount
) => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    const leftUnderarmAngle = calculateAngle(leftElbow, leftShoulder, leftHip);
    const rightUnderarmAngle = calculateAngle(rightElbow, rightShoulder, rightHip);
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    setLeftUnderarmAngle(leftUnderarmAngle);
    setRightUnderarmAngle(rightUnderarmAngle);
    setLeftHipAngle(leftHipAngle);
    setRightHipAngle(rightHipAngle);

    let feedback = "Extend alternate sides!";

    const left_in_frame = inFrame(leftShoulder, leftKnee, undefined, undefined)
    const right_in_frame = inFrame(rightShoulder, rightKnee, undefined, undefined)

    if (!left_in_frame && !right_in_frame) {
        feedback = "Make sure limbs are visible";
        setFeedback(feedback);
        return;
    }

    if (
        ((leftUnderarmAngle < targetFlatAngle && rightHipAngle < targetFlatAngle) ||
            (rightUnderarmAngle < targetFlatAngle && leftHipAngle < targetFlatAngle)) &&
        !inDeadBugPosition
    ) {
        feedback = "Extend alternate sides!";
    } else if (
        (leftUnderarmAngle >= targetFlatAngle && rightHipAngle >= targetFlatAngle) ||
        (rightUnderarmAngle >= targetFlatAngle && leftHipAngle >= targetFlatAngle)
    ) {
        feedback = "Excellent!";
        inDeadBugPosition = true;
    } else if (
        (leftUnderarmAngle < targetFlatAngle && rightHipAngle < targetFlatAngle) ||
        (rightUnderarmAngle < targetFlatAngle && leftHipAngle < targetFlatAngle)
    ) {
        if (inDeadBugPosition) {
            feedback = "Excellent!";
            deadBugCount++;
            inDeadBugPosition = false;
            setRepCount(deadBugCount);
        }
    } else {
        if (inDeadBugPosition) {
            feedback = "Excellent!";
        }
    }

    setFeedback(feedback);
};

/**
 * Resets the Dead Bug exercise count and position state.
 *
 * @param {number} val - The value to set the deadBugCount to (typically 0 for reset).
 */
export const setDeadBugCount = (val) => {
    deadBugCount = val;
    inDeadBugPosition = false;
};
