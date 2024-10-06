import { calculateAngle } from "./Angles";

let squatCount = 0;
let inSquatPosition = false;

export const checkSquats = (
    landmarks,
    onFeedbackUpdate,
    setLeftKneeAngle,
    setRepCount
) => {
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

    setLeftKneeAngle(leftKneeAngle);

    let feedback = "Please Begin Rep!";

    if (leftKneeAngle < 120 && leftKneeAngle > 70 && !inSquatPosition) {
        feedback = "Go Down Lower!";
    } else if (leftKneeAngle < 70) {
        feedback = "Excellent!";
        inSquatPosition = true;
    } else if (leftKneeAngle > 160) {
        if (inSquatPosition) {
            feedback = "Excellent!";
            squatCount++;
            inSquatPosition = false;
            setRepCount(squatCount);
        }
    } else {
        if (inSquatPosition) {
            feedback = "Excellent!";
        }
    }

    onFeedbackUpdate(feedback);
};
