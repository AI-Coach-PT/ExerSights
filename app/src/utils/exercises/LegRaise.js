import { genCheck, getTransitionType } from "../GenFeedback";

export const legRaiseInfo = {
  states: {
    INIT: { feedback: "Lay down!", audio: true, countRep: false, color: "yellow" },
    RAISING: { feedback: "Raise legs higher!", audio: true, countRep: false, color: "yellow" },
    BENT: { feedback: "Don't bend knees!", audio: true, countRep: false, color: "red" },
    UP: { feedback: "Excellent!", audio: true, countRep: true, color: "green" },
    LOWERING: { feedback: "Fully lower legs!", audio: false, countRep: false, color: "yellow" },
  },

  transitions: {
    INIT: {
      flat: "RAISING",
    },
    RAISING: {
      raised: "UP",
      kneeBend: "BENT",
    },
    BENT: {
      kneeBend: "BENT",
      noKneeBend: "RAISING",
    },
    UP: {
      lowering: "LOWERING",
    },
    LOWERING: {
      flat: "RAISING",
    },
  },

  conditions: {
    flat: {
      states: ["INIT", "LOWERING"],
      req: "hipAngle > thresholdHipAngle",
      ret: "flat",
    },
    raised: {
      states: ["RAISING"],
      req: "hipAngle <= targetHipAngle",
      ret: "raised",
    },
    lowering: {
      states: ["UP"],
      req: "hipAngle > targetHipAngle",
      ret: "lowering",
    },
    kneeBend: {
      states: ["RAISING"],
      req: "kneeAngle < thresholdKneeAngle",
      ret: "kneeBend",
    },
    noKneeBend: {
      states: ["BENT"],
      req: "kneeAngle >= thresholdKneeAngle",
      ret: "noKneeBend",
    },
  },

  jointInfo: {
    joints: {
      left: {
        leftShoulder: 11,
        leftHip: 23,
        leftKnee: 25,
        leftAnkle: 27,
      },
      right: {
        rightShoulder: 12,
        rightHip: 24,
        rightKnee: 26,
        rightAnkle: 28,
      },
    },
    jointAngles: {
      leftHipAngle: [11, 23, 25],
      rightHipAngle: [12, 24, 26],
      leftKneeAngle: [23, 25, 27],
      rightKneeAngle: [24, 26, 28],
    },
  },

  targets: {
    targetHipAngle: 100,
    thresholdHipAngle: 130,
    thresholdKneeAngle: 160,
  },

  angleSetters: ["setHipAngle"],

  title: "Leg Raises",
};

let currState;

/**
 * Checks and updates the leg raise posture state, tracks elbow angle, and counts repetitions.
 * Leverages generalized feedback checking method.
 *
 * @param {Object} landmarks - The landmarks of the body to evaluate posture.
 * @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
 * @param {Function} setCurrElbowAngle - Function to update the current elbow angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetHipAngle=100] - The target elbow angle to be used for evaluation.
 */
export const checkLegRaise = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setHipAngle,
  setRepCount,
  targetHipAngle = 100
) => {
  legRaiseInfo.targets["targetHipAngle"] = targetHipAngle;

  currState = genCheck(
    legRaiseInfo,
    (...args) => getTransitionType(...args, legRaiseInfo, currState),
    currState,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { HipAngle: setHipAngle }
  );
};
