import { calculateAngle } from "./Angles";

let squatCount = 0;
let inSquatPosition = false;

export const checkSquats = (
    landmarks,
    onFeedbackUpdate,
    setLeftKneeAngle,
    setRepCount
) => {
    console.log(landmarks);
    if (landmarks[0]) {
        const leftHip = landmarks[0][23];
        const leftKnee = landmarks[0][25];
        const leftAnkle = landmarks[0][27];
        if (leftHip && leftKnee && leftAnkle) {
            const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
            console.log("left knee angle");
            console.log(leftKneeAngle);

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
        }
    }
};
