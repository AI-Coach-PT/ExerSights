import { genCheck } from '../GenFeedback';

const pullUpInfo = {
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
        thresholdElbowAngle: 150,
        thresholdKneeAngle: 120
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
    const { leftElbowAngle, rightElbowAngle, leftWristPos, rightWristPos, leftMouthPos, rightMouthPos, leftKneeAngle, rightKneeAngle } = jointData;

    const thresholdElbowAngle = pullUpInfo.targets["thresholdElbowAngle"];
    const thresholdKneeAngle = pullUpInfo.targets["thresholdKneeAngle"];

    const elbowAngle = closerSide === "left" ? leftElbowAngle : rightElbowAngle;
    const wristPos = closerSide === "left" ? leftWristPos : rightWristPos;
    const mouthPos = closerSide === "left" ? leftMouthPos : rightMouthPos;
    const kneeAngle = closerSide === "left" ? leftKneeAngle : rightKneeAngle;

    if ((currState === "KIP" || currState === "ASCENDING") && kneeAngle < thresholdKneeAngle) return "kneeBend";
    if ((currState === "KIP" || currState === "DESCENDING") && elbowAngle > thresholdElbowAngle) return "lockedOut";
    if (currState === "ASCENDING" && mouthPos.y < wristPos.y) return "chinAbove";
    if (mouthPos.y >= wristPos.y) return "chinBelow";

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
 * @param {number} [targetElbowLockOutAngle=150] - The target elbow angle to be used for evaluation.
 */
export const checkPullup = (landmarks, onFeedbackUpdate, setColor, setCurrElbowAngle, setRepCount, targetElbowLockOutAngle = 150) => {
    pullUpInfo.targets["thresholdElbowAngle"] = targetElbowLockOutAngle;

    currState = genCheck(
        pullUpInfo,
        getTransitionType,
        currState,
        landmarks,
        onFeedbackUpdate,
        setColor,
        setRepCount,
        { ElbowAngle: setCurrElbowAngle }
    );
};