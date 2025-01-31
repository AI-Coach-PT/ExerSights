import { genCheck, getTransitionType } from '../GenFeedback';

const muscleUpInfo = {
    states: {
        INIT: { feedback: "Get in position!", audio: false, countRep: false, color: "yellow" },
        PULLUP: { feedback: "Pull chin above bar!", audio: true, countRep: false, color: "yellow" },
        TRANSITION: { feedback: "Transition to dip position!", audio: true, countRep: false, color: "yellow" },
        DIP: { feedback: "Push up!", audio: true, countRep: false, color: "yellow" },
        FINISH: { feedback: "Excellent!", audio: true, countRep: true, color: "green" },
    },

    transitions: {
        INIT: {
            chinBelowBar: "PULLUP"
        },
        PULLUP: {
            chinAboveBar: "TRANSITION"
        },
        TRANSITION: {
            elbowAboveBar: "DIP",
            chinBelowBar: "PULLUP"
        },
        DIP: {
            lockedOut: "FINISH",
            chinBelowBar: "PULLUP"
        },
        FINISH: {
            chinBelowBar: "PULLUP"
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
        },
        jointPos: {
            leftElbowPos: 13,
            rightElbowPos: 14,
            leftWristPos: 15,
            rightWristPos: 16,
            leftMouthPos: 9,
            rightMouthPos: 10
        }
    },

    targets: {
        thresholdElbowAngle: 170,
    },

    conditions: {
        lockedOut: {
            states: ["DIP"],
            req: "elbowAngle > thresholdElbowAngle",
            ret: "lockedOut"
        },
        chinAboveBar: {
            states: ["PULLUP"],
            req: "mouthPos.y < wristPos.y",
            ret: "chinAboveBar"
        },
        elbowAboveBar: {
            states: ["TRANSITION"],
            req: "elbowPos.y < wristPos.y",
            ret: "elbowAboveBar"
        },
        chinBelowBar: {
            states: ["INIT", "TRANSITION", "DIP", "FINISH"],
            req: "mouthPos.y >= wristPos.y",
            ret: "chinBelowBar"
        }
    }
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
 * @param {number} [targetElbowLockOutAngle=170] - The target elbow angle to be used for evaluation.
 */
export const checkMuscleUp = (landmarks, onFeedbackUpdate, setColor, setCurrElbowAngle, setRepCount, targetElbowLockOutAngle = 170) => {
    muscleUpInfo.targets["thresholdElbowAngle"] = targetElbowLockOutAngle;

    currState = genCheck(
        muscleUpInfo,
        (...args) => getTransitionType(...args, muscleUpInfo, currState),
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        { ElbowAngle: setCurrElbowAngle }
    );
};