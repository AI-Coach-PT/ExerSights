import { genCheck } from './GenFeedback';

const muscleUpInfo = {
    states: {
        INIT: { feedback: "Get in position!", audio: false, countRep: false },
        PULLUP: { feedback: "Pull chin above bar!", audio: true, countRep: false },
        TRANSITION: { feedback: "Transition to dip position!", audio: true, countRep: false },
        DIP: { feedback: "Push up!", audio: true, countRep: false },
        FINISH: { feedback: "Excellent!", audio: true, countRep: true },
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
};

let currState;

/**
 * Determines the type of transition based on pull-up posture and arm movement.
 *
 * @param {object} jointData Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointData, closerSide) => {
    const { leftElbowAngle, rightElbowAngle, leftElbowPos, rightElbowPos, leftWristPos, rightWristPos, leftMouthPos, rightMouthPos } = jointData;

    const thresholdElbowAngle = muscleUpInfo.targets["thresholdElbowAngle"];

    const elbowAngle = closerSide === "left" ? leftElbowAngle : rightElbowAngle;
    const elbowPos = closerSide === "left" ? leftElbowPos : rightElbowPos;
    const wristPos = closerSide === "left" ? leftWristPos : rightWristPos;
    const mouthPos = closerSide === "left" ? leftMouthPos : rightMouthPos;

    if (currState === "DIP" && elbowAngle > thresholdElbowAngle) return "lockedOut";
    if (currState === "PULLUP" && mouthPos.y < wristPos.y) return "chinAboveBar";
    if (currState === "TRANSITION" && elbowPos.y < wristPos.y) return "elbowAboveBar";
    if (mouthPos.y >= wristPos.y) return "chinBelowBar";

    return null;
};

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
export const checkMuscleUp = (landmarks, onFeedbackUpdate, setCurrElbowAngle, setRepCount, targetElbowLockOutAngle = 170) => {
    muscleUpInfo.targets["thresholdElbowAngle"] = targetElbowLockOutAngle;

    currState = genCheck(
        muscleUpInfo,
        getTransitionType,
        currState,
        landmarks,
        onFeedbackUpdate,
        setRepCount,
        { ElbowAngle: setCurrElbowAngle }
    );
};