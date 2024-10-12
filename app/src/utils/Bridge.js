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
export const checkBridges = (landmarks, onFeedbackUpdate, setleftHipAngle, setRepCount) => {
    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    

    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

    setleftHipAngle(leftHipAngle);

    let feedback = "Please Begin Rep!";

    if (leftKneeAngle > 90) {
        feedback = "Bring Knees In\n";
    } else{
        feedback = "Knees In Position!\n";
    }

    if ((leftHipAngle < 140 && !inBridgePosition)) {
        feedback += "Raise Hips Higher";
    } else if (leftHipAngle > 140) {
        feedback += "Excellent!"
        inBridgePosition = true;
    } else if (leftHipAngle < 130) {
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