import { genCheck } from '../GenFeedback';

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

    "conditions": {
        "lockedOut": {
            "states": ["DIP"],
            "req": "elbowAngle > thresholdElbowAngle",
            "ret": "lockedOut"
        },
        "chinAboveBar": {
            "states": ["PULLUP"],
            "req": "mouthPos.y < wristPos.y",
            "ret": "chinAboveBar"
        },
        "elbowAboveBar": {
            "states": ["TRANSITION"],
            "req": "elbowPos.y < wristPos.y",
            "ret": "elbowAboveBar"
        },
        "chinBelowBar": {
            "states": ["INIT", "TRANSITION", "DIP", "FINISH"],
            "req": "mouthPos.y >= wristPos.y",
            "ret": "chinBelowBar"
        }
    }
};

let currState;

/**
 * Determines the type of transition based on pull-up posture and arm movement.
 *
 * @param {object} jointData Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointData, closerSide) => {
    const targets = muscleUpInfo.targets;
    const jointPos = muscleUpInfo.jointInfo.jointPos;
    const jointAngles = muscleUpInfo.jointInfo.jointAngles;

    const jointDataMap = {};

    // Pull angles from jointData
    for (const [key, index] of Object.entries(jointAngles)) {
        if (key.startsWith(closerSide)) { // Match only relevant side
            const genericKey = key.replace(closerSide, "").replace(/Angle$/, "").toLowerCase();

            if (jointData[key] !== undefined) {
                jointDataMap[genericKey + "Angle"] = jointData[key];
            } else {
                console.warn(`WARNING: Missing or invalid jointData for index ${key}`);
                jointDataMap[genericKey + "Angle"] = 0;
            }
        }
    }

    // Pull positions from jointData
    for (const [key, index] of Object.entries(jointPos)) {
        if (key.startsWith(closerSide)) { // Match only relevant side
            const genericKey = key.replace(closerSide, "").replace(/Pos$/, "").toLowerCase();

            if (jointData[key] && typeof jointData[key] === "object" && "y" in jointData[key]) {
                jointDataMap[genericKey + "Pos"] = jointData[key];
            } else {
                console.warn(`WARNING: Missing or invalid jointData for index ${key}`);
                jointDataMap[genericKey + "Pos"] = { x: 0, y: 0 };
            }
        }
    }

    for (const conditionKey in muscleUpInfo.conditions) {
        const condition = muscleUpInfo.conditions[conditionKey];
        if (condition.states.includes(currState)) {
            let { req, ret } = condition;

            // Replace generic placeholders with actual values from jointDataMap
            Object.keys(jointDataMap).forEach(key => {
                if (typeof jointDataMap[key] === "object" && jointDataMap[key] !== null) {
                    // If the key represents a position object ({x, y}), replace properly
                    req = req.replace(new RegExp(`\\b${key}\\.y\\b`, 'g'), jointDataMap[key].y);
                } else {
                    req = req.replace(new RegExp(`\\b${key}\\b`, 'g'), jointDataMap[key]);
                }
            });

            for (const [key, index] of Object.entries(targets)) {
                req = req.replace(new RegExp(key, 'g'), targets[key]);
            }

            if (eval(req)) {
                return ret;
            }
        }
    }

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