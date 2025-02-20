import { genCheck } from "../GenFeedback";

export const pilatesHundredInfo = {
  states: {
    OUTSIDE_TARGET: {
      feedback: "Try to keep your legs off the ground at the target angle!",
      audio: true,
      countRep: false,
      color: "yellow",
    },
    AT_TARGET: { feedback: "Excellent!", audio: true, countRep: false, color: "green" },
  },

  transitions: {
    OUTSIDE_TARGET: {
      atTarget: "AT_TARGET",
    },
    AT_TARGET: {
      outsideTarget: "OUTSIDE_TARGET",
    },
  },

  jointInfo: {
    joints: {
      left: {
        leftShoulder: 11,
        leftHip: 23,
        leftKnee: 25,
      },
      right: {
        rightShoulder: 12,
        rightHip: 24,
        rightKnee: 26,
      },
    },
    jointAngles: {
      leftHipAngle: [11, 23, 25],
      rightHipAngle: [12, 24, 26],
    },
  },

  targets: {
    targetHipAngle: 135,
  },

  disableVisibilityCheck: false,

  angleSetters: ["setHipAngle"],

  title: "Pilates Hundred",
};

let currState;

/**
 * Determines the type of transition.
 *
 * @param {object} jointData Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition or null if no transition applies.
 */
const getTransitionTypePilatesHundred = (jointData, closerSide) => {
  const { leftHipAngle, rightHipAngle } = jointData;

  const targetHipAngle = pilatesHundredInfo.targets["targetHipAngle"];

  const hipAngle = closerSide === "left" ? leftHipAngle : rightHipAngle;

  if (
    currState === "OUTSIDE_TARGET" &&
    hipAngle >= targetHipAngle - 5 &&
    hipAngle <= targetHipAngle + 5
  )
    return "atTarget";
  if (currState === "AT_TARGET" && (hipAngle < targetHipAngle - 5 || hipAngle > targetHipAngle + 5))
    return "outsideTarget";

  return "null";
};

/**
 * Checks pilates hundred based on given landmarks and updates feedback.
 *
 * @param {Array} landmarks - An array of landmarks used for calculating angles.
 * @param {Function} onFeedbackUpdate - Callback function to update feedback based on the current state.
 * @param {Function} setCurrSideAngle - Function to set the current side angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetHipAngle=135] - The target hip angle. Defaults to 135 if not specified.
 */
export const checkPilatesHundred = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setCurrHipAngle,
  setRepCount,
  targetHipAngle = 135
) => {
  pilatesHundredInfo.targets["targetHipAngle"] = targetHipAngle;

  currState = genCheck(
    pilatesHundredInfo,
    getTransitionTypePilatesHundred,
    currState,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { HipAngle: setCurrHipAngle }
  );
};
