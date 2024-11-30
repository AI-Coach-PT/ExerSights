import { genCheck } from "./GenFeedback";

const latExtRotationInfo = {
  states: {
    INIT: { feedback: "Get ready!", audio: false, countRep: false },
    NOT_PERPENDICULAR: {
      feedback: "Rotate your bent arm upwards/externally, perpendicular to the ground!",
      audio: true,
      countRep: false,
    },
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
      // leftSideAngle: [15, 13, 7],
      // rightSideAngle: [15, 13, 8],
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

  const sideAngle = closerSide === "left" ? leftSideAngle : rightSideAngle;

  if (sideAngle >= thresholdSideAngle) return "perpendicular";
  else return "notPerpendicular";
};

/**
 * Checks and updates the pull-up posture state, tracks elbow angle, and counts repetitions.
 * Leverages generalized feedback checking method.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setCurrSideAngle - Function to update the current elbow angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetSideAngle=20] - The target elbow angle to be used for evaluation.
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
