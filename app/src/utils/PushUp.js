import { genCheck } from './GenFeedback';

const pushUpInfo = {
    states: {
        INIT: { feedback: "Please Begin Rep!", audio: false, countRep: false },
        DESCENDING: { feedback: "Go Down Lower!", audio: true, countRep: false },
        HOLD: { feedback: "Excellent!", audio: true, countRep: false },
        FINISHED: { feedback: "Excellent!", audio: false, countRep: true },
    },

    transitions: {
        INIT: {
            descending: "DESCENDING",
        },
        DESCENDING: {
            hitTarget: "HOLD",
            finishing: "INIT",
        },
        HOLD: {
            finishing: "FINISHED",
        },
        FINISHED: {
            descending: "DESCENDING",
        },
    },

    jointInfo: {
        joints: {
            left: {
                leftShoulder: 11,
                leftElbow: 13,
                leftHand: 15
            },
            right: {
                rightShoulder: 12,
                rightElbow: 14,
                rightHand: 16
            }
        },
        jointAngles: {
            leftElbowAngle: [11, 13, 15],
            rightElbowAngle: [12, 14, 16],
        },
    },

    targets: {
        thresholdElbowAngle: 150,
        targetElbowAngle: 65,
    },
};

let currState;
let closerArm;

/**
 * Determines the type of transition based on push-up posture and arm movement.
 *
 * @param {object} jointAngles Object containing calculated angles for relevant joints.
 * @param {object} landmarks The body landmarks for determining the closer arm.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointAngles, landmarks) => {
    const { leftElbowAngle, rightElbowAngle } = jointAngles;

    const targetElbowAngle = pushUpInfo.targets["targetElbowAngle"];
    const thresholdElbowAngle = pushUpInfo.targets["thresholdElbowAngle"];

    if (!closerArm) {
        closerArm = getCloserArm(landmarks);
    }

    const currentAngle = closerArm === "Left Arm" ? leftElbowAngle : rightElbowAngle;

    if (currentAngle < targetElbowAngle) return "hitTarget";
    if (currentAngle < thresholdElbowAngle) return "descending";
    if (currentAngle > thresholdElbowAngle) return "finishing";

    return null;
};

/**
 * Checks and updates the push-up posture state, tracks elbow angle, and counts repetitions.
 * Leverages generalized feedback checking method.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setCurrElbowAngle - Function to update the current elbow angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetElbowAngle=65] - The target elbow angle to be used for evaluation.
 */
export const checkPushup = (landmarks, onFeedbackUpdate, setCurrElbowAngle, setRepCount, targetElbowAngle = 65) => {
    pushUpInfo.targets["targetElbowAngle"] = targetElbowAngle;

    const angleHandlers = closerArm === "Left Arm"
        ? { leftElbowAngle: setCurrElbowAngle }
        : { rightElbowAngle: setCurrElbowAngle };

    currState = genCheck(
        pushUpInfo,
        (angles) => getTransitionType(angles, landmarks),
        currState,
        landmarks,
        onFeedbackUpdate,
        setRepCount,
        angleHandlers
    );
};

/**
 * Identifies which arm is closer based on the z-values of the landmarks.
 *
 * @param {object} landmarks The body landmarks containing 3D positional data.
 * @returns {string} The closer arm ("Left Arm" or "Right Arm").
 */
function getCloserArm(landmarks) {
    if (!landmarks) return null;

    // Extract z-values for left arm landmarks
    const leftWristZ = landmarks[15].z;
    const leftElbowZ = landmarks[13].z;
    const leftShoulderZ = landmarks[11].z;
    const leftArmAvgZ = (leftWristZ + leftElbowZ + leftShoulderZ) / 3;

    // Extract z-values for right arm landmarks
    const rightWristZ = landmarks[16].z;
    const rightElbowZ = landmarks[14].z;
    const rightShoulderZ = landmarks[12].z;
    const rightArmAvgZ = (rightWristZ + rightElbowZ + rightShoulderZ) / 3;

    // Determine which arm is closer based on average z-value
    return leftArmAvgZ < rightArmAvgZ ? "Left Arm" : "Right Arm";
}