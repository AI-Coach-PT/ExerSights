import { genCheck } from "../GenFeedback";

export const lateralExternalRotationInfo = {
  states: {
    INIT: { feedback: "Get ready!", audio: false, countRep: false, color: "yellow" },
    NOT_PERPENDICULAR: {
      feedback: "Rotate arm upwards!",
      audio: true,
      countRep: false,
      color: "yellow",
    },
    PERPENDICULAR: { feedback: "Excellent!", audio: true, countRep: true, color: "green" },
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
    targetSideAngle: 140,
    resetSideAngle: 100,
  },

  angleSetters: ["setSideAngle"],

  title: "Lateral External Rotation",
};

let currState;

/**
 * Determines the type of transition based on arm movement.
 *
 * @param {object} jointData Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointData, closerSide) => {
  const { leftSideAngle, rightSideAngle } = jointData;

  const targetSideAngle = lateralExternalRotationInfo.targets["targetSideAngle"];
  const resetSideAngle = lateralExternalRotationInfo.targets["resetSideAngle"];

  const sideAngle = closerSide === "left" ? leftSideAngle : rightSideAngle;

  if (currState === "NOT_PERPENDICULAR" && sideAngle >= targetSideAngle) return "perpendicular";
  if ((currState === "PERPENDICULAR" || currState === "INIT") && sideAngle <= resetSideAngle)
    return "notPerpendicular";

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
export const checkLateralExternalRotation = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setCurrSideAngle,
  setRepCount,
  targetSideAngle = 140
) => {
  lateralExternalRotationInfo.targets["targetSideAngle"] = targetSideAngle;

  currState = genCheck(
    lateralExternalRotationInfo,
    getTransitionType,
    currState,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { SideAngle: setCurrSideAngle }
  );
};
