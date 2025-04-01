import { genCheck } from '../GenFeedback';

export const pushUpInfo = {
    states: {
        INIT: { feedback: "Please Begin Rep!", audio: false, countRep: false, color: "yellow" },
        DESCENDING: { feedback: "Go Down Lower!", audio: true, countRep: false, color: "yellow" },
        HOLD: { feedback: "Excellent!", audio: true, countRep: false, color: "green" },
        FINISHED: { feedback: "Excellent!", audio: false, countRep: true, color: "green" },
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
        targetElbowAngle: 90,
    },

    angleSetters: ["setElbowAngle"],

    title: "Push-up",
};

let currState;

/**
 * Determines the type of transition based on push-up posture and arm movement.
 *
 * @param {object} jointAngles Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointAngles, closerSide) => {
    const { leftElbowAngle, rightElbowAngle } = jointAngles;

    const targetElbowAngle = pushUpInfo.targets["targetElbowAngle"];
    const thresholdElbowAngle = pushUpInfo.targets["thresholdElbowAngle"];

    const currentAngle = closerSide === "left" ? leftElbowAngle : rightElbowAngle;

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
 * @param {number} [targetElbowAngle=90] - The target elbow angle to be used for evaluation.
 */
export const checkPushUp = (landmarks, onFeedbackUpdate, setColor, setCurrElbowAngle, setRepCount, targetElbowAngle = 65) => {
    pushUpInfo.targets["targetElbowAngle"] = targetElbowAngle;

    currState = genCheck(
        pushUpInfo,
        getTransitionType,
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        { ElbowAngle: setCurrElbowAngle }
    );
};