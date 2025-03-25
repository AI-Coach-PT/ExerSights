import { genCheck, getTransitionType } from '../GenFeedback';

export const shoulderPressInfo = {
    states: {
        INIT: { feedback: "Start with elbows tucked at 45°!", audio: false, countRep: false, color: "yellow" },
        PRESSING: { feedback: "Press Overhead!", audio: true, countRep: false, color: "yellow" },
        LOCKED_OUT: { feedback: "Excellent!", audio: true, countRep: true, color: "green" },
        LOWERING: { feedback: "Lower down to initial position!", audio: false, countRep: false, color: "yellow" },
        FLARED: { feedback: "Don't flare elbows too wide!", audio: true, countRep: false, color: "red" },
        OVERLOCKED: { feedback: "Don't lock out elbows!", audio: true, countRep: false, color: "red" },
    },

    transitions: {
        INIT: {
            pressing: "PRESSING",
            flared: "FLARED"
        },
        PRESSING: {
            lockedOut: "LOCKED_OUT",
            overLocked: "OVERLOCKED",
            flared: "FLARED"
        },
        LOCKED_OUT: {
            lowering: "LOWERING",
            overLocked: "OVERLOCKED"
        },
        LOWERING: {
            resetStart: "INIT"
        },
        FLARED: {
            unflared: "INIT"
        },
        OVERLOCKED: {
            lowering: "LOWERING"
        }
    },

    jointInfo: {
        joints: {
            left: {
                leftShoulder: 11,
                leftElbow: 13,
                leftWrist: 15
            },
            right: {
                rightShoulder: 12,
                rightElbow: 14,
                rightWrist: 16
            }
        },
        jointAngles: {
            leftShoulderAngle: [13, 11, 23],
            rightShoulderAngle: [14, 12, 24],
            leftElbowAngle: [11, 13, 15],
            rightElbowAngle: [12, 14, 16]
        }
    },

    targets: {
        startShoulderAngle: 60,
        targetShoulderAngle: 160,
        flareShoulderAngle: 80,
        maxElbowAngle: 175
    },

    conditions: {
        pressing: {
            states: ["INIT"],
            req: "shoulderAngle > startShoulderAngle",
            ret: "pressing"
        },
        lockedOut: {
            states: ["PRESSING"],
            req: "shoulderAngle >= targetShoulderAngle",
            ret: "lockedOut"
        },
        overLocked: {
            states: ["PRESSING", "LOCKED_OUT"],
            req: "elbowAngle >= maxElbowAngle",
            ret: "overLocked"
        },
        lowering: {
            states: ["LOCKED_OUT", "OVERLOCKED"],
            req: "shoulderAngle < targetShoulderAngle - 10",
            ret: "lowering"
        },
        resetStart: {
            states: ["LOWERING"],
            req: "shoulderAngle <= startShoulderAngle",
            ret: "resetStart"
        },
        flared: {
            states: [],
            req: "shoulderAngle > flareShoulderAngle && elbowAngle < 95",
            ret: "flared"
        },
        unflared: {
            states: [],
            req: "shoulderAngle <= flareShoulderAngle || elbowAngle >= 95",
            ret: "unflared"
        }
    },

    angleSetters: ["setShoulderAngle", "setElbowAngle"],

    title: "Shoulder Press"
};

let currState;

/**
 * Checks and updates the Shoulder Press posture state, tracks shoulder and elbow angles,
 * counts reps, and detects form issues like flaring or overextension.
 *
 * @param {Object} landmarks - The body landmarks to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback to handle feedback.
 * @param {Function} setColor - Function to set display color based on state.
 * @param {Function} setCurrShoulderAngle - Updates current shoulder angle.
 * @param {Function} setCurrElbowAngle - Updates current elbow angle.
 * @param {Function} setRepCount - Updates rep count.
 */
export const checkShoulderPress = (landmarks, onFeedbackUpdate, setColor, setCurrShoulderAngle, setCurrElbowAngle, setRepCount, targetShoulderAngle = 160) => {
    shoulderPressInfo.targets["targetShoulderAngle"] = targetShoulderAngle;

    currState = genCheck(
        shoulderPressInfo,
        (...args) => getTransitionType(...args, shoulderPressInfo, currState),
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        {
            ShoulderAngle: setCurrShoulderAngle,
            ElbowAngle: setCurrElbowAngle
        }
    );
};
