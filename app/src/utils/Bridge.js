import { calculateAngle } from './Angles';

let BridgeCount = 0;
let inBridgePosition = false;

/**
 * Monitors and tracks Bridge repetitions by analyzing the hip angle from pose landmarks.
 * Provides real-time feedback based on the depth of the Bridge.
 *
 * @param {Array} landmarks An array of pose landmarks containing the coordinates of different body points.
 * @param {Function} onFeedbackUpdate A callback function that receives the feedback message about the Bridge depth and form.
 * @param {Function} setleftHipAngle A function to update the current hip angle for display purposes.
 * @param {Function} setRepCount A function to update the Bridge count after a full Bridge is completed.
 */
export const checkBridges = (landmarks, onFeedbackUpdate, setLeftHipAngle, setLeftKneeAngle, setRepCount, targetHipAngle = 140, targetKneeAngle = 90) => {
    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    

    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

    setLeftHipAngle(leftHipAngle);
    setLeftKneeAngle(leftKneeAngle);

    let feedback = "";

    if (leftKneeAngle > targetKneeAngle) {
        feedback = "Bring Feet In\n Target Knee Angle " + targetKneeAngle;
    } else{
        feedback = "Feet In Position!\n";

        if ((leftHipAngle < targetHipAngle && !inBridgePosition)) {
            feedback += "Raise Hips Higher";
        } else if (leftHipAngle > targetHipAngle) {
            feedback += "Excellent!"
            inBridgePosition = true;
        } else if (leftHipAngle < targetHipAngle - 20) {
            if (inBridgePosition) {
                feedback += "Excellent!"
                BridgeCount++;
                inBridgePosition = false;
                setRepCount(BridgeCount);
            }
        } else {
            if (inBridgePosition) {
                feedback += "Excellent!"
            }
        }
    }

    onFeedbackUpdate(feedback);
};

/**
 * Resets Bridge count to specified value and resets Bridge position state.
 *
 * @param {number} val - The value to set the Bridge count to.
 */
export const setBridgeCount = (val) => {
    BridgeCount = val;
    inBridgePosition = false;
};