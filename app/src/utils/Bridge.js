import { calculateAngle } from './Angles';
import { inFrame } from './InFrame';


let BridgeCount = 0;
let inBridgePosition = false;

/**
 * Checks the limbs' angles for completion of a rep
 *
 * @param {number} kneeAngle
 * @param {number} hipAngle
 * @param {number} targetKneeAngle
 * @param {number} targetHipAngle
 * 
 * 
 * @returns {string} feedback
 * 
 */
export const checkBridgesAngles = (kneeAngle, hipAngle, targetKneeAngle, targetHipAngle) => {
    let feedback = "";
    if (kneeAngle > targetKneeAngle) {
        feedback = "Bring Feet In\n Target Knee Angle " + targetKneeAngle;
    } else{
        feedback = "Feet In Position!\n";

        if ((hipAngle < targetHipAngle && !inBridgePosition)) {
            feedback += "Raise Hips Higher";
        } else if (hipAngle > targetHipAngle) {
            feedback += "Excellent!"
            inBridgePosition = true;
        } else if (hipAngle < targetHipAngle - 20) {
            if (inBridgePosition) {
                feedback += "Excellent!"
                BridgeCount++;
                inBridgePosition = false;
            }
        } else {
            if (inBridgePosition) {
                feedback += "Excellent!"
            }
        }
    }
    return feedback;
};

/**
 * Monitors and tracks Bridge repetitions by analyzing the hip angle from pose landmarks.
 * Provides real-time feedback based on the depth of the Bridge.
 *
 * @param {Array} landmarks An array of pose landmarks containing the coordinates of different body points.
 * @param {Function} onFeedbackUpdate A callback function that receives the feedback message about the Bridge depth and form.
 * @param {Function} setleftHipAngle A function to update the current hip angle for display purposes.
 * @param {Function} setRepCount A function to update the Bridge count after a full Bridge is completed.
 */
export const checkBridges = (landmarks, onFeedbackUpdate, setHipAngle, setKneeAngle, setRepCount, targetHipAngle = 140, targetKneeAngle = 90) => {
    
    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const rightShoulder = landmarks[12];
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];
    

    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);



    let feedback = "";

    const left_in_frame = inFrame(leftShoulder, leftAnkle, undefined, undefined)
    const right_in_frame = inFrame(rightShoulder, rightAnkle, undefined, undefined)

    if(left_in_frame){
        setHipAngle(leftHipAngle);
        setKneeAngle(leftKneeAngle);
        feedback = checkBridgesAngles(leftKneeAngle, leftHipAngle, targetKneeAngle, targetHipAngle);
        setRepCount(BridgeCount);
    }
    else if(right_in_frame){
        setHipAngle(rightHipAngle);
        setKneeAngle(rightKneeAngle);
        feedback = checkBridgesAngles(rightKneeAngle, rightHipAngle, targetKneeAngle, targetHipAngle);
        setRepCount(BridgeCount);
    }
    else{
        setHipAngle(0);
        setKneeAngle(0);
        feedback += "Make sure limbs are visible"
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