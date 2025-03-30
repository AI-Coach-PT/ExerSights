import { genCheck, getTransitionType } from "../GenFeedback";

export const treePoseInfo = {
  states: {
    INIT: {
      feedback: "Bring the sole of your foot into your inner thigh as high as possible!",
      audio: true,
      countRep: false,
      color: "yellow",
    },
    POSING: {
      feedback: "You got it! Keep it up!",
      audio: true,
      countRep: false,
      color: "green",
    },
    BREAKING: {
      feedback: "Balance! Try to keep your pose up!",
      audio: true,
      countRep: false,
      color: "yellow",
    },
  },

  transitions: {
    INIT: {
      breaking: "BREAKING",
    },
    POSING: {
      breaking: "BREAKING",
    },
    BREAKING: {
      posing: "POSING",
      init: "INIT",
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

  conditions: {
    posing: {
      states: ["BREAKING"],
      req: "hipAngle < targetHipAngle && kneeAngle < targetKneeAngle",
      ret: "posing",
    },
    breaking: {
      states: ["POSING", "INIT"],
      req: "hipAngle < thresholdHipAngle && (hipAngle >= targetHipAngle && kneeAngle >= targetKneeAngle)",
      ret: "breaking",
    },
    init: {
      states: ["BREAKING"],
      req: "hipAngle >= thresholdHipAngle",
      ret: "init",
    },
  },

  targets: {
    targetHipAngle: 150,
    targetKneeAngle: 65,
    thresholdHipAngle: 160,
  },

  angleSetters: ["setHipAngle", "setKneeAngle"],

  title: "Tree Pose (Vrksasana)",
};

let currState;

/**
 * Checks the tree pose/vrksasana form and provides feedback.
 *
 * @param {Array} landmarks - Body position data points from pose detection
 * @param {Function} onFeedbackUpdate - Callback to update exercise feedback
 * @param {Function} setColor - Function to update visual feedback color
 * @param {Function} setCurrHipAngle - Function to update current hip angle display
 * @param {Function} setRepCount - Function to update repetition counter
 */
export const checkTreePose = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setCurrHipAngle,
  setCurrKneeAngle,
  setRepCount,
  targetHipAngle = 150,
  targetKneeAngle = 65
) => {
  treePoseInfo.targets["targetHipAngle"] = targetHipAngle;
  treePoseInfo.targets["targetKneeAngle"] = targetKneeAngle

  currState = genCheck(
    treePoseInfo,
    (...args) => getTransitionType(...args, treePoseInfo, currState),
    currState,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { HipAngle: setCurrHipAngle, KneeAngle: setCurrKneeAngle }
  );
};
