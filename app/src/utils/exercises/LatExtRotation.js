import { genCheck } from "../GenFeedback";

const latExtRotationInfo = {
  states: {
    INIT: { feedback: "Get ready!", audio: false, countRep: false },
    NOT_PERPENDICULAR: { feedback: "Rotate arm upwards!", audio: true, countRep: false },
    PERPENDICULAR: { feedback: "Excellent!", audio: true, countRep: true },
  },

  transitions: {
    INIT: {
      notPerpendicular: "NOT_PERPENDICULAR",
    },
    NOT_PERPENDICULAR: {
      perpendicular: "PERPENDICULAR",
    },
    PERPENDICULAR: {
      notPerpendicular: "NOT_PERPENDICULAR",
    },
  },

  jointInfo: {
    joints: {
      left: {
        leftEar: 7,
        leftElbow: 13,
        leftWrist: 15,
        leftHip: 23,
      },
      right: {
        rightEar: 8,
        rightElbow: 14,
        rightWrist: 16,
        rightHip: 24,
      },
    },
    jointAngles: {
      leftSideAngle: [15, 13, 23],
      rightSideAngle: [16, 14, 24],
    },
    jointPos: {
      leftEarPos: 7,
      rightEarPos: 8,
      leftElbowPos: 13,
      rightElbowPos: 14,
      leftWristPos: 15,
      rightWristPos: 16,
    },
  },

  targets: {
    thresholdSideAngle: 140,
    resetSideAngle: 100
  },

  disableVisibilityCheck: true,
};

let currState;

/**
 * Determines the type of transition based on pull-up posture and arm movement.
 *
 * @param {object} jointData Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointData, closerSide) => {
  const { leftSideAngle, rightSideAngle } = jointData;

  const thresholdSideAngle = latExtRotationInfo.targets["thresholdSideAngle"];
  const resetSideAngle = latExtRotationInfo.targets["resetSideAngle"];

  const sideAngle = closerSide === "left" ? leftSideAngle : rightSideAngle;

  if (currState === "NOT_PERPENDICULAR" && sideAngle >= thresholdSideAngle) return "perpendicular";
  if ((currState === "PERPENDICULAR" || currState == "INIT") && sideAngle <= resetSideAngle) return "notPerpendicular";

  return "null";
};

/**
 * Checks lateral external rotation based on given landmarks and updates feedback.
 *
 * @param {Array} landmarks - An array of landmarks used for calculating angles.
 * @param {Function} onFeedbackUpdate - Callback function to update feedback based on the current state.
 * @param {Function} setCurrSideAngle - Function to set the current side angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetSideAngle=140] - The target angle for side rotation. Defaults to 140 if not specified.
 */
export const checkLatExtRotation = (
  landmarks,
  onFeedbackUpdate,
  setCurrSideAngle,
  setRepCount,
  targetSideAngle = 140
) => {
  latExtRotationInfo.targets["thresholdSideAngle"] = targetSideAngle;

  currState = genCheck(
    latExtRotationInfo,
    getTransitionType,
    currState,
    landmarks,
    onFeedbackUpdate,
    setRepCount,
    { SideAngle: setCurrSideAngle }
  );
};
