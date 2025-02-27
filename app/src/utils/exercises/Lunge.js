import { genCheck } from "../GenFeedback";

export const lungeInfo = {
  states: {
    STANDING: { feedback: "Please Begin Rep!", audio: false, countRep: false, color: "yellow" },
    DESCENDING: { feedback: "Bend Knees Lower!", audio: true, countRep: false, color: "yellow" },
    LUNGED: { feedback: "Excellent!", audio: true, countRep: false, color: "green" },
    FINISHED: { feedback: "Excellent!", audio: false, countRep: true, color: "green" },
  },

  transitions: {
    STANDING: {
      descending: "DESCENDING",
    },
    DESCENDING: {
      hitTarget: "LUNGED",
      finishing: "STANDING",
    },
    LUNGED: {
      finishing: "FINISHED",
    },
    FINISHED: {
      descending: "DESCENDING",
    },
  },

  jointInfo: {
    joints: {
      left: {
        leftHip: 23,
        leftKnee: 25,
        leftAnkle: 27,
      },
      right: {
        rightHip: 24,
        rightKnee: 26,
        rightAnkle: 28,
      },
    },
    jointAngles: {
      leftKneeAngle: [23, 25, 27],
      rightKneeAngle: [24, 26, 28],
    },
  },

  targets: {
    thresholdKneeAngle: 160,
    targetKneeAngle: 90,
  },

  angleSetters: ["setKneeAngle"],

  title: "Lunge",
};

/**
 * Determines the type of transition based on lunge depth (knee angles).
 *
 * @param {object} jointAngles Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionType = (jointAngles, closerSide) => {
  const { leftKneeAngle, rightKneeAngle } = jointAngles;

  const targetKneeAngle = lungeInfo.targets["targetKneeAngle"];
  const thresholdAngle = lungeInfo.targets["thresholdKneeAngle"];

  if (leftKneeAngle < targetKneeAngle || rightKneeAngle < targetKneeAngle) return "hitTarget";
  if (leftKneeAngle < thresholdAngle || rightKneeAngle < thresholdAngle) return "descending";
  if (leftKneeAngle > thresholdAngle || rightKneeAngle > thresholdAngle) return "finishing";
  return null;
};

let currState;

/**
 * Checks and updates the lunge posture state, tracks knee angle, and counts repetitions.
 * Leverages generalized feedback checking method.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setCurrKneeAngle - Function to update the current knee angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetKneeAngle=90] - The target knee angle to be used for evaluation.
 */
export const checkLunge = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setCurrKneeAngle,
  setRepCount,
  targetKneeAngle = 90
) => {
  lungeInfo.targets["targetKneeAngle"] = targetKneeAngle;

  currState = genCheck(
    lungeInfo,
    getTransitionType,
    currState,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { KneeAngle: setCurrKneeAngle }
  );
};
