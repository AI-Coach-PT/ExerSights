import { calculateAngle } from './Angles';

let pushUpCount = 0;
let inPushUpPosition = false;

export const checkPushup = (landmarks, onFeedbackUpdate, setCurrElbowAngle, setRepCount, targetElbowAngle = 65) => {
    const thresholdAngle = 170;

    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftHand = landmarks[15];

    // const rightShoulder = landmarks[12];
    // const rightElbow = landmarks[14];
    // const rightHand = landmarks[16];

    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftHand);
    //const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightHand);

    setCurrElbowAngle(leftElbowAngle);

    let feedback = "Please Begin Rep!";

    if (//(
        ((leftElbowAngle < thresholdAngle && leftElbowAngle > targetElbowAngle))){ //||
            //(rightKneeAngle < thresholdAngle && rightKneeAngle > targetKneeAngle)) &&
        //!inPushUpPosition)) {
        feedback = "Go Down Lower!";
    } else if (leftElbowAngle < targetElbowAngle ){//|| rightKneeAngle < targetKneeAngle) {
        feedback = "Excellent!"
        //inPushUpPosition = true;
    } else if (leftElbowAngle > thresholdAngle){// || rightKneeAngle > thresholdAngle) {
        if (inPushUpPosition) {
            feedback = "Excellent!"
            pushUpCount++;
            //inPushUpPosition = false;
            setRepCount(pushUpCount);
        }
    } else {
        if (inPushUpPosition) {
            feedback = "Excellent!"
        }
    }

    onFeedbackUpdate(feedback);
};

/**
 * Resets squat count to specified value and resets squat position state.
 *
 * @param {number} val - The value to set the squat count to.
 */
export const setPushUpCount = (val) => {
    pushUpCount = val;
    inPushUpPosition = false;
};