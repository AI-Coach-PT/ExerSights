import { calculateAngle } from './Angles';

let squatCount = 0;
let inSquatPosition = false;

export const checkSquats = (landmarks, onFeedbackUpdate, setLeftKneeAngle, setRepCount) => {
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

    setLeftKneeAngle(leftKneeAngle);

    let feedback = "";

    if ((leftKneeAngle < 100 && leftKneeAngle > 70 && !inSquatPosition)) {
        feedback = "Go Down Lower!";
    } else if (leftKneeAngle < 70) {
        inSquatPosition = true;
    } else if (leftKneeAngle > 160) {
        if (inSquatPosition) {
            squatCount++;
            inSquatPosition = false;
            setRepCount(squatCount);
        }
    }

    onFeedbackUpdate(feedback);
};
