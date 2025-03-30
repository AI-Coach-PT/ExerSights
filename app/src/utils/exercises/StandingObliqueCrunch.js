import { genCheck, getTransitionType } from "../GenFeedback";

export const standingObliqueCrunchInfo = {
  states: {
    INIT: { feedback: "Stand tall and get ready!", audio: false, countRep: false, color: "yellow" },
    CRUNCHING: { feedback: "Crunch your oblique!", audio: true, countRep: false, color: "yellow" },
    CRUNCHED: {
      feedback: "Excellent work!",
      audio: true,
      countRep: true,
      color: "green",
    },
    RETURNING: {
      feedback: "Lower your knee and stand up straight!",
      audio: true,
      countRep: false,
      color: "yellow",
    },
    BREAKING: {
      feedback: "Keep your hands and elbows up and bent!",
      audio: true,
      countRep: false,
      color: "red",
    },
  },

  transitions: {
    INIT: {
      crunching: "CRUNCHING",
    },
    CRUNCHING: {
      hitTarget: "CRUNCHED",
      breaking: "BREAKING",
    },
    CRUNCHED: {
      returning: "RETURNING",
      breaking: "BREAKING",
    },
    RETURNING: {
      lockedOut: "INIT",
    },
    BREAKING: {
      bend: "CRUNCHING",
    },
  },

  jointInfo: {
    joints: {
      left: {
        leftShoulder: 11,
        leftElbow: 13,
        leftWrist: 15,
        leftHip: 23,
        leftKnee: 25,
        leftAnkle: 27,
      },
      right: {
        rightShoulder: 12,
        rightElbow: 14,
        rightWrist: 16,
        rightHip: 24,
        rightKnee: 26,
        rightAnkle: 28,
      },
    },
    jointAngles: {
      leftElbowAngle: [11, 13, 15],
      rightElbowAngle: [12, 14, 16],
      leftHipAngle: [11, 23, 25],
      rightHipAngle: [12, 24, 26],
      leftKneeAngle: [23, 25, 27],
      rightKneeAngle: [24, 26, 28],
    },
  },

  conditions: {
    crunching: {
      states: ["INIT"],
      req: "hipAngle < thresholdHipAngle",
      ret: "crunching",
    },
    hitTarget: {
      states: ["CRUNCHING"],
      req: "hipAngle <= targetHipAngle",
      ret: "hitTarget",
    },
    returning: {
      states: ["CRUNCHED"],
      req: "hipAngle > targetHipAngle",
      ret: "returning",
    },
    lockedOut: {
      states: ["RETURNING"],
      req: "hipAngle >= thresholdHipAngle",
      ret: "lockedOut",
    },
    breaking: {
      states: ["CRUNCHING", "CRUNCHED"],
      req: "elbowAngle > thresholdElbowAngle",
      ret: "breaking",
    },
    bend: {
      states: ["BREAKING"],
      req: "elbowAngle <= thresholdElbowAngle",
      ret: "bend",
    },
  },

  targets: {
    targetHipAngle: 100,
    thresholdHipAngle: 150,
    thresholdElbowAngle: 90,
  },

  angleSetters: ["setHipAngle"],

  title: "Standing Oblique Crunch",
};

let currState;

/**
 * Checks the standing oblique crunch exercise form and provides feedback.
 *
 * @param {Array} landmarks - Body position data points from pose detection
 * @param {Function} onFeedbackUpdate - Callback to update exercise feedback
 * @param {Function} setColor - Function to update visual feedback color
 * @param {Function} setCurrHipAngle - Function to update current hip angle display
 * @param {Function} setRepCount - Function to update repetition counter
 */
export const checkStandingObliqueCrunch = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setCurrHipAngle,
  setRepCount,
  targetHipAngle = 100
) => {
  standingObliqueCrunchInfo.targets["targetHipAngle"] = targetHipAngle;

  currState = genCheck(
    standingObliqueCrunchInfo,
    (...args) => getTransitionType(...args, standingObliqueCrunchInfo, currState),
    currState,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { HipAngle: setCurrHipAngle }
  );
};
