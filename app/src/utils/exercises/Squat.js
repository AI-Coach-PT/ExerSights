import { genCheck } from '../GenFeedback';

/** 
 * FSM list of 4 states, 3 types of transitions, joint information, target value information
 * States = Standing, descending, squatting, finished
 * Transitions = descending, hitTarget, finishing
 * Accesses leftKneeAngle and rightKneeAngle
 */
export const squatInfo = {
    states: {
        STANDING: { feedback: "Please Begin Rep!", audio: false, countRep: false, color: "yellow" },
        DESCENDING: { feedback: "Go Down Lower!", audio: true, countRep: false, color: "yellow" },
        SQUATTING: { feedback: "Excellent!", audio: true, countRep: false, color: "green" },
        FINISHED: { feedback: "Excellent!", audio: false, countRep: true, color: "green" }
    },

    transitions: {
        STANDING: {
            descending: "DESCENDING",
        },
        DESCENDING: {
            hitTarget: "SQUATTING",
            finishing: "STANDING",
        },
        SQUATTING: {
            finishing: "FINISHED",
        },
        FINISHED: {
            descending: "DESCENDING",
        }
    },

    jointInfo: {
        joints: {
            left: {
                leftHip: 23,
                leftKnee: 25,
                leftAnkle: 27
            },
            right: {
                rightHip: 24,
                rightKnee: 26,
                rightAnkle: 28
            }
        },
        jointAngles: {
            leftKneeAngle: [23, 25, 27],
            rightKneeAngle: [24, 26, 28]
        }
    },

    targets: {
        thresholdKneeAngle: 160,
        targetKneeAngle: 90,
    },

    angleSetters: ["setKneeAngle"],

    title: "Squat",
}

/**
 * Determines the type of transition based on squat depth (knee angles).
 *
 * @param {object} jointAngles Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointAngles, closerSide) => {
    const { leftKneeAngle, rightKneeAngle } = jointAngles;

    const targetKneeAngle = squatInfo.targets["targetKneeAngle"];
    const thresholdAngle = squatInfo.targets["thresholdKneeAngle"];

    if (leftKneeAngle < targetKneeAngle || rightKneeAngle < targetKneeAngle)
        return "hitTarget";
    if (leftKneeAngle < thresholdAngle || rightKneeAngle < thresholdAngle)
        return "descending";
    if (leftKneeAngle > thresholdAngle || rightKneeAngle > thresholdAngle)
        return "finishing";
    return null;
};

let currState;

/**
 * Checks and updates the squat posture state, tracks knee angle, and counts repetitions.
 * Leverages generalized feedback checking method.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setCurrKneeAngle - Function to update the current knee angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetKneeAngle=90] - The target knee angle to be used for evaluation.
 */
export const checkSquat = (landmarks, onFeedbackUpdate, setColor, setCurrKneeAngle, setRepCount, targetKneeAngle = 90) => {
    squatInfo.targets["targetKneeAngle"] = targetKneeAngle;

    currState = genCheck(
        squatInfo,
        getTransitionType,
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        { KneeAngle: setCurrKneeAngle }
    );

};

/** 
 * FSM for checking if chest is upright during squat
 * States: UPRIGHT, LEANING_FORWARD
 * Transitions: upright, leaningTooFar
 * Accesses leftHipAngle and rightHipAngle
 */
const chestInfo = {
    states: {
        UPRIGHT: { feedback: "", audio: false, countRep: false, color: "" },
        LEANING_FORWARD: { feedback: "Chest up!", audio: false, countRep: false, color: "" }
    },

    transitions: {
        UPRIGHT: {
            leaningTooFar: "LEANING_FORWARD",
        },
        LEANING_FORWARD: {
            upright: "UPRIGHT",
        }
    },

    jointInfo: {
        joints: {
            leftShoulder: 11,
            leftHip: 23,
            leftKnee: 25,
            rightShoulder: 12,
            rightHip: 24,
            rightKnee: 26
        },
        jointAngles: {
            leftHipAngle: [11, 23, 25],
            rightHipAngle: [12, 24, 26]
        }
    },

    targets: {
        targetHipAngle: 45
    },

    disableVisibilityCheck: true
};

/**
 * Determines the type of transition based on chest posture (hip angles).
 *
 * @param {object} jointAngles Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("leaningTooFar", "upright") or null if no transition applies.
 */
const getTransitionTypeChest = (jointAngles, closerSide) => {
    const leftHipAngle = jointAngles["leftHipAngle"];
    const rightHipAngle = jointAngles["rightHipAngle"];
    const targetHipAngle = chestInfo.targets["targetHipAngle"];

    if (leftHipAngle < targetHipAngle || rightHipAngle < targetHipAngle)
        return "leaningTooFar";
    return "upright";
};

let currStateChest;

/**
 * Checks and updates the chest posture state based on the provided landmarks and target hip angle.
 * Leverages generalized feedback checking method.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {number} [targetHipAngle=45] - The target hip angle to be used for evaluation.
 */
export const checkChestUp = (landmarks, onFeedbackUpdate, setColor, targetHipAngle = 45) => {
    chestInfo.targets["targetHipAngle"] = targetHipAngle;

    currStateChest = genCheck(
        chestInfo,
        getTransitionTypeChest,
        currStateChest,
        landmarks,
        onFeedbackUpdate,
        setColor,
        () => { },
    );
};