import { calculateAngle } from './Angles';
import { playSoundCorrectRep, playText } from './Audio';

let pushUpCount = 0;
let inPushUpPosition = false;
let closerArm = null;
let lastFeedback = "";

export const checkPushup = (landmarks, onFeedbackUpdate, setCurrElbowAngle, setRepCount, targetElbowAngle = 65) => {
    const thresholdAngle = 150;
    var currentAngle = 150;

    if (!closerArm || !inPushUpPosition) {
        closerArm = getCloserArm(landmarks);
    }


    //left arm
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftHand = landmarks[15];

    //right arm
    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightHand = landmarks[16];


    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftHand);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightHand);


    let feedback = "Please Begin Rep!";

    if (closerArm === "Left Arm") {
        currentAngle = leftElbowAngle;
    } else {
        currentAngle = rightElbowAngle;
    }

    setCurrElbowAngle(currentAngle);

    if (currentAngle < thresholdAngle && currentAngle > targetElbowAngle && !inPushUpPosition) {
        feedback = "Go Down Lower!";
    } else if (currentAngle < targetElbowAngle) {
        feedback = "Excellent!"
        inPushUpPosition = true;
    } else if (currentAngle > thresholdAngle) {
        if (inPushUpPosition) {
            feedback = "Excellent!"
            pushUpCount++;
            inPushUpPosition = false;
            playSoundCorrectRep();
            setRepCount(pushUpCount);
        }
    } else {
        if (inPushUpPosition) {
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
 * Resets PushUp count to specified value and resets PushUp position state.
 *
 * @param {number} val - The value to set the squat count to.
 */
export const setPushUpCount = (val) => {
    pushUpCount = val;
    inPushUpPosition = false;
};

function getCloserArm(landmarks) {
    if (!landmarks) return null;

    // Extract z-values for left arm landmarks
    const leftWristZ = landmarks[11].z;
    const leftElbowZ = landmarks[13].z;
    const leftShoulderZ = landmarks[15].z;
    const leftArmAvgZ = (leftWristZ + leftElbowZ + leftShoulderZ) / 3;

    // Extract z-values for right arm landmarks
    const rightWristZ = landmarks[12].z;
    const rightElbowZ = landmarks[14].z;
    const rightShoulderZ = landmarks[16].z;
    const rightArmAvgZ = (rightWristZ + rightElbowZ + rightShoulderZ) / 3;

    // Determine which arm is closer based on average z-value
    return leftArmAvgZ < rightArmAvgZ ? "Left Arm" : "Right Arm";
}