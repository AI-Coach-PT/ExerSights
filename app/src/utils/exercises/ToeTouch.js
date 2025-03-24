import { genCheck, getTransitionType } from '../GenFeedback';

export const toeTouchInfo = {
    states: {
        INIT: { feedback: "Stand Tall and Get Ready!", audio: false, countRep: false, color: "yellow" },
        FOLDING: { feedback: "Reach for Toes!", audio: true, countRep: false, color: "yellow" },
        TOUCHING: { feedback: "Excellent! Hold the Stretch!", audio: true, countRep: true, color: "green" },
        RETURNING: { feedback: "Stand Back Up Slowly!", audio: true, countRep: false, color: "yellow" },
        BREAKING: { feedback: "Keep Your Knees Straight!", audio: true, countRep: false, color: "red" },
    },

    transitions: {
        INIT: {
            folding: "FOLDING",
        },
        FOLDING: {
            hitTarget: "TOUCHING",
            breaking: "BREAKING",
        },
        TOUCHING: {
            returning: "RETURNING",
            breaking: "BREAKING",
        },
        RETURNING: {
            lockedOut: "INIT",
        },
        BREAKING: {
            unbend: "FOLDING",
        }
    },

    jointInfo: {
        joints: {
            left: {
                leftShoulder: 11,
                leftHip: 23,
                leftKnee: 25,
                leftAnkle: 27
            },
            right: {
                rightShoulder: 12,
                rightHip: 24,
                rightKnee: 26,
                rightAnkle: 28
            }
        },
        jointAngles: {
            leftHipAngle: [11, 23, 25],
            rightHipAngle: [12, 24, 26],
            leftKneeAngle: [23, 25, 27],
            rightKneeAngle: [24, 26, 28],
        }
    },

    conditions: {
        breaking: {
            states: ["FOLDING", "TOUCHING"],
            req: "kneeAngle < thresholdKneeAngle",
            ret: "breaking"
        },
        unbend: {
            states: ["BREAKING"],
            req: "kneeAngle >= thresholdKneeAngle",
            ret: "unbend"
        },
        lockedOut: {
            states: ["RETURNING"],
            req: "hipAngle >= thresholdHipAngle",
            ret: "lockedOut"
        },
        hitTarget: {
            states: ["FOLDING"],
            req: "hipAngle <= targetHipAngle",
            ret: "hitTarget"
        },
        folding: {
            states: ["INIT"],
            req: "hipAngle < thresholdHipAngle",
            ret: "folding"
        },
        returning: {
            states: ["TOUCHING"],
            req: "hipAngle > targetHipAngle",
            ret: "returning"
        }
    },

    targets: {
        targetHipAngle: 75,
        thresholdHipAngle: 160,
        thresholdKneeAngle: 160,
    },

    angleSetters: ["setHipAngle"],

    title: "Standing Toe Touch",
};

let currState;

/**
 * Checks and updates the Standing Toe Touch posture state, tracks hip hinge, knee straightness, and back position.
 * Leverages generalized feedback checking method.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setCurrHipAngle - Function to update the current hip hinge angle.
 * @param {Function} setCurrKneeAngle - Function to update knee bend.
 * @param {Function} setCurrSpineAngle - Function to track back position.
 * @param {Function} setRepCount - Function to update the repetition count.
 */
export const checkToeTouch = (landmarks, onFeedbackUpdate, setColor, setCurrHipAngle, setRepCount, targetHipAngle = 75) => {
    toeTouchInfo.targets["targetHipAngle"] = targetHipAngle;

    currState = genCheck(
        toeTouchInfo,
        (...args) => getTransitionType(...args, toeTouchInfo, currState),
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        { HipAngle: setCurrHipAngle }
    );
};
