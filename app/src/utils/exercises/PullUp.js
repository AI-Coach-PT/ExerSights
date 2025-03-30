import { genCheck, getTransitionType } from '../GenFeedback';

export const pullUpInfo = {
    states: {
        INIT: { feedback: "Get in Pull Up Position!", audio: false, countRep: false, color: "yellow" },
        ASCENDING: { feedback: "Pull Chin Above Bar!", audio: true, countRep: false, color: "yellow" },
        UP: { feedback: "Excellent!", audio: true, countRep: true, color: "green" },
        DESCENDING: { feedback: "Fully lock out arms!", audio: true, countRep: false, color: "yellow" },
        KIP: { feedback: "Don't use legs!", audio: true, countRep: false, color: "yellow" },
    },

    transitions: {
        INIT: {
            chinBelow: "ASCENDING"
        },
        ASCENDING: {
            chinAbove: "UP",
            kneeBend: "KIP"
        },
        UP: {
            chinBelow: "DESCENDING"
        },
        DESCENDING: {
            lockedOut: "ASCENDING"
        },
        KIP: {
            kneeBend: "KIP",
            lockedOut: "INIT"
        }
    },

    jointInfo: {
        joints: {
            left: {
                leftShoulder: 11,
                leftElbow: 13,
                leftWrist: 15,
                leftMouth: 9
            },
            right: {
                rightShoulder: 12,
                rightElbow: 14,
                rightWrist: 16,
                rightMouth: 10
            }
        },
        jointAngles: {
            leftElbowAngle: [11, 13, 15],
            rightElbowAngle: [12, 14, 16],
            leftKneeAngle: [23, 25, 27],
            rightKneeAngle: [24, 26, 28]
        },
        jointPos: {
            leftWristPos: 15,
            rightWristPos: 16,
            leftMouthPos: 9,
            rightMouthPos: 10
        }
    },

    targets: {
        targetElbowLockOutAngle: 150,
        thresholdKneeAngle: 120
    },

    conditions: {
        kneeBend: {
            states: ["ASCENDING", "KIP"],
            req: "kneeAngle < thresholdKneeAngle",
            ret: "kneeBend"
        },
        lockedOut: {
            states: ["DESCENDING", "KIP"],
            req: "elbowAngle > targetElbowLockOutAngle",
            ret: "lockedOut"
        },
        chinAbove: {
            states: ["ASCENDING"],
            req: "mouthPos.y < wristPos.y",
            ret: "chinAbove"
        },
        chinBelow: {
            states: ["INIT", "UP"],
            req: "mouthPos.y >= wristPos.y",
            ret: "chinBelow"
        }
    },

    angleSetters: ["setElbowAngle"],

    title: "Pull-up",
};

let currState;

/**
 * Checks and updates the pull-up posture state, tracks elbow angle, and counts repetitions.
 * Leverages generalized feedback checking method.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setCurrElbowAngle - Function to update the current elbow angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetElbowLockOutAngle=150] - The target elbow angle to be used for evaluation.
 */
export const checkPullUp = (landmarks, onFeedbackUpdate, setColor, setCurrElbowAngle, setRepCount, targetElbowLockOutAngle = 150) => {
    pullUpInfo.targets["targetElbowLockOutAngle"] = targetElbowLockOutAngle;

    currState = genCheck(
        pullUpInfo,
        (...args) => getTransitionType(...args, pullUpInfo, currState),
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        { ElbowAngle: setCurrElbowAngle }
    );
};