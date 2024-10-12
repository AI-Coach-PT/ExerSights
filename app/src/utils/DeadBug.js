import { calculateAngle } from "./Angles";

let deadBugCount = 0;
let inDeadBugPosition = false;

export const checkDeadBug = (
    landmarks,
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
    // const leftAnkle = landmarks[27];
    // const rightAnkle = landmarks[28];

    const leftUnderarmAngle = calculateAngle(leftElbow, leftShoulder, leftHip);
    const rightUnderarmAngle = calculateAngle(rightElbow, rightShoulder, rightHip);
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    setLeftUnderarmAngle(leftUnderarmAngle);
    setRightUnderarmAngle(rightUnderarmAngle);
    setLeftHipAngle(leftHipAngle);
    setRightHipAngle(rightHipAngle);

    let feedback = "Extend alternate sides!";

    if (leftUnderarmAngle < 140 && rightHipAngle < 140 && !inDeadBugPosition) {
        feedback = "Extend alternate sides!";
    } else if (leftUnderarmAngle >= 140 && rightHipAngle >= 140) {
        feedback = "Excellent!";
        inDeadBugPosition = true;
    } else if (leftUnderarmAngle < 140 && rightHipAngle < 140) {
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

export const setDeadBugCount = (val) => {
    deadBugCount = val;
    inDeadBugPosition = false;
};
