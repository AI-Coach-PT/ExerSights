import { genCheck } from '../GenFeedback';

export const bridgeInfo = {
    states: {
        ADJUST_FEET: { feedback: "Bend Knees", audio: true, countRep: false, color: "yellow" },
        RAISING_HIPS: { feedback: "Raise Hips", audio: true, countRep: false, color: "yellow" },
        FINISHED: { feedback: "Excellent!", audio: false, countRep: true, color: "green" },
    },

    transitions: {
        ADJUST_FEET: {
            hipsRaising: "RAISING_HIPS",
        },
        RAISING_HIPS: {
            hitTarget: "FINISHED",
            adjusting: "ADJUST_FEET",
        },
        FINISHED: {
            hipsRaising: "RAISING_HIPS",
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
            leftKneeAngle: [23, 25, 27],
            rightHipAngle: [12, 24, 26],
            rightKneeAngle: [24, 26, 28],
        },
    },

    targets: {
        targetHipAngle: 140,
        targetKneeAngle: 90,
    },

    angleSetters: ["setHipAngle", "setKneeAngle"],

    title: "Bridge",
};

let currState;

/**
 * Determines the type of transition based on bridge posture.
 *
 * @param {object} jointAngles Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("adjusting", "hipsRaising", "hitTarget", "loweringHips") or null if no transition applies.
 */
const getTransitionType = (jointAngles, closerSide) => {
    const { leftHipAngle, leftKneeAngle, rightHipAngle, rightKneeAngle } = jointAngles;

    const targetHipAngle = bridgeInfo.targets["targetHipAngle"];
    const targetKneeAngle = bridgeInfo.targets["targetKneeAngle"];

    const kneeAngle = closerSide === "left" ? leftKneeAngle : rightKneeAngle;
    const hipAngle = closerSide === "left" ? leftHipAngle : rightHipAngle;

    if (kneeAngle > targetKneeAngle) return "adjusting";
    if (hipAngle < targetHipAngle) return "hipsRaising";
    if (hipAngle >= targetHipAngle) return "hitTarget";

    return null;
};

/**
 * Monitors and tracks Bridge repetitions by analyzing the hip and knee angles from pose landmarks.
 * Provides real-time feedback based on the Bridge posture.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setHipAngle - Function to update the current hip angle.
 * @param {Function} setKneeAngle - Function to update the current knee angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetHipAngle=140] - The target hip angle to be used for evaluation.
 * @param {number} [targetKneeAngle=90] - The target knee angle to be used for evaluation.
 */
export const checkBridge = (
    landmarks,
    onFeedbackUpdate,
    setColor,
    setHipAngle,
    setKneeAngle,
    setRepCount,
    targetHipAngle = 140,
    targetKneeAngle = 90
) => {
    bridgeInfo.targets["targetHipAngle"] = targetHipAngle;
    bridgeInfo.targets["targetKneeAngle"] = targetKneeAngle;

    currState = genCheck(
        bridgeInfo,
        getTransitionType,
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        {
            HipAngle: setHipAngle,
            KneeAngle: setKneeAngle,
        }
    );
};