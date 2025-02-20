import { genCheck } from "../GenFeedback";

export const deadBugInfo = {
    states: {
        INIT: { feedback: "Please Begin Rep!", audio: false, countRep: false, color: "yellow" },
        EXTENDING: { feedback: "Extend alternate sides!", audio: true, countRep: false, color: "yellow" },
        HOLD: { feedback: "Excellent!", audio: true, countRep: true, color: "green" },
    },

    transitions: {
        INIT: {
            extending: "EXTENDING",
        },
        EXTENDING: {
            hitTarget: "HOLD",
        },
        HOLD: {
            extending: "EXTENDING",
        }
    },

    jointInfo: {
        joints: {
            left: {
                leftShoulder: 11,
                leftElbow: 13,
                leftHip: 23,
                leftKnee: 25
            },
            right: {
                rightShoulder: 12,
                rightElbow: 14,
                rightHip: 24,
                rightKnee: 26
            }
        },
        jointAngles: {
            leftUnderarmAngle: [13, 11, 23],
            rightUnderarmAngle: [14, 12, 24],
            leftHipAngle: [11, 23, 25],
            rightHipAngle: [12, 24, 26],
        },
    },

    targets: {
        targetFlatAngle: 140,
    },

    angleSetters: ["setLeftUnderarmAngle", "setRightUnderarmAngle", "setLeftHipAngle", "setRightHipAngle"],

    title: "Dead Bug",
};

let currState;

/**
 * Determines the type of transition based on Dead Bug posture.
 *
 * @param {object} jointAngles - Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("extending", "hitTarget", "lowering") or null if no transition applies.
 */
const getTransitionType = (jointAngles, closer) => {
    const { leftUnderarmAngle, rightUnderarmAngle, leftHipAngle, rightHipAngle } = jointAngles;

    const targetFlatAngle = deadBugInfo.targets["targetFlatAngle"];

    if (
        (leftUnderarmAngle < targetFlatAngle && rightHipAngle < targetFlatAngle) ||
        (rightUnderarmAngle < targetFlatAngle && leftHipAngle < targetFlatAngle)
    ) {
        return "extending";
    }

    if (
        (leftUnderarmAngle >= targetFlatAngle && rightHipAngle >= targetFlatAngle) ||
        (rightUnderarmAngle >= targetFlatAngle && leftHipAngle >= targetFlatAngle)
    ) {
        return "hitTarget";
    }

    return null;
};

/**
 * Monitors and tracks Dead Bug repetitions by analyzing limb angles from pose landmarks.
 * Provides real-time feedback based on posture and movement.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {number} targetFlatAngle - The target angle for extension.
 * @param {Function} setLeftUnderarmAngle - Function to update the left underarm angle.
 * @param {Function} setRightUnderarmAngle - Function to update the right underarm angle.
 * @param {Function} setLeftHipAngle - Function to update the left hip angle.
 * @param {Function} setRightHipAngle - Function to update the right hip angle.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setRepCount - Function to update the repetition count.
 */
export const checkDeadBug = (
    landmarks,
    onFeedbackUpdate,
    setColor,
    setLeftUnderarmAngle,
    setRightUnderarmAngle,
    setLeftHipAngle,
    setRightHipAngle,
    setRepCount,
    targetFlatAngle,
) => {
    deadBugInfo.targets["targetFlatAngle"] = targetFlatAngle;

    currState = genCheck(
        deadBugInfo,
        getTransitionType,
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        {
            leftUnderarmAngle: setLeftUnderarmAngle,
            rightUnderarmAngle: setRightUnderarmAngle,
            leftHipAngle: setLeftHipAngle,
            rightHipAngle: setRightHipAngle,
        }
    );
};