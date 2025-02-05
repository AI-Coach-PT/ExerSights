import { genCheck } from "../GenFeedback";

const plankInfo = {
  states: {
    MISALIGNED_HIP: { feedback: "Make sure hip is aligned with shoulder and knee", audio: true, countRep: false, color: "yellow" },
    ALIGNED_HIP: { feedback: "Excellent!", audio: true, countRep: false, color: "green" },
  },

  transitions: {
    MISALIGNED_HIP: {
        aligned: "ALIGNED_HIP",
    },
    ALIGNED_HIP: {
        misaligned: "MISALIGNED_HIP",
    },
  },

  jointInfo: {
    joints: {
      left: {
        leftShoulder: 12,
        leftHip: 24,
        leftKnee: 26,
      },
      right: {
        rightShoulder: 11,
        rightHip: 23,
        rightKnee: 25,
      },
    },
    jointAngles: {
      leftSideAngle: [12, 24, 26],
      rightSideAngle: [11, 23, 25],
    },
  },

  targets: {
    targetHipAngle: 145,
  },

  disableVisibilityCheck: false,
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

  const targetHipAngle = plankInfo.targets["targetHipAngle"];

  const sideAngle = closerSide === "left" ? leftSideAngle : rightSideAngle;

  if (currState === "MISALIGNED_HIP" && sideAngle >= targetHipAngle - 10 && sideAngle <= targetHipAngle + 10) return "aligned";
  if ((currState === "ALIGNED_HIP") && (sideAngle <= targetHipAngle - 10 || sideAngle >= targetHipAngle + 10)) return "misaligned";

  return "null";
};

/**
 * Checks lateral external rotation based on given landmarks and updates feedback.
 *
 * @param {Array} landmarks - An array of landmarks used for calculating angles.
 * @param {Function} onFeedbackUpdate - Callback function to update feedback based on the current state.
 * @param {Function} setCurrSideAngle - Function to set the current side angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetSideAngle=145] - The target angle for side rotation. Defaults to 140 if not specified.
 */
export const checkPlank = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setCurrHipAngle,
  setRepCount,
  targetHipAngle = 145
) => {
  plankInfo.targets["targetHipAngle"] = targetHipAngle;

  currState = genCheck(
    latExtRotationInfo,
    getTransitionType,
    currState,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { HipAngle: setCurrHipAngle }
  );
};
