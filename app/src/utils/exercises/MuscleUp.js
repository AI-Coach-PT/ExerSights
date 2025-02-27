import { genCheck, getTransitionType } from "../GenFeedback";

export const muscleUpInfo = {
  states: {
    INIT: { feedback: "Get in position!", audio: false, countRep: false, color: "yellow" },
    PULLUP: { feedback: "Pull chin above bar!", audio: true, countRep: false, color: "yellow" },
    TRANSITION: {
      feedback: "Transition to dip position!",
      audio: true,
      countRep: false,
      color: "yellow",
    },
    DIP: { feedback: "Push up!", audio: true, countRep: false, color: "yellow" },
    FINISH: { feedback: "Excellent!", audio: true, countRep: true, color: "green" },
  },

  transitions: {
    INIT: {
      chinBelowBar: "PULLUP",
    },
    PULLUP: {
      chinAboveBar: "TRANSITION",
    },
    TRANSITION: {
      elbowAboveBar: "DIP",
      chinBelowBar: "PULLUP",
    },
    DIP: {
      lockedOut: "FINISH",
      chinBelowBar: "PULLUP",
    },
    FINISH: {
      chinBelowBar: "PULLUP",
    },
  },

  jointInfo: {
    joints: {
      left: {
        leftShoulder: 11,
        leftElbow: 13,
        leftWrist: 15,
        leftMouth: 9,
      },
      right: {
        rightShoulder: 12,
        rightElbow: 14,
        rightWrist: 16,
        rightMouth: 10,
      },
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
      rightMouthPos: 10,
    },
  },

  targets: {
    targetElbowLockOutAngle: 170,
  },

  conditions: {
    lockedOut: {
      states: ["DIP"],
      req: "elbowAngle > targetElbowLockOutAngle",
      ret: "lockedOut",
    },
    chinAboveBar: {
      states: ["PULLUP"],
      req: "mouthPos.y < wristPos.y",
      ret: "chinAboveBar",
    },
    elbowAboveBar: {
      states: ["TRANSITION"],
      req: "elbowPos.y < wristPos.y",
      ret: "elbowAboveBar",
    },
    chinBelowBar: {
      states: ["INIT", "TRANSITION", "DIP", "FINISH"],
      req: "mouthPos.y >= wristPos.y",
      ret: "chinBelowBar",
    },
  },

  angleSetters: ["setElbowAngle"],

  title: "Muscle-up",
};

let currState;

/**
 * Checks the muscle-up exercise form and provides feedback
 *
 * @param {Array} landmarks - Body position data points from pose detection
 * @param {Function} onFeedbackUpdate - Callback to update exercise feedback
 * @param {Function} setColor - Function to update visual feedback color
 * @param {Function} setCurrElbowAngle - Function to update current elbow angle display
 * @param {Function} setRepCount - Function to update repetition counter
 * @param {Number} targetElbowLockOutAngle - Target angle for elbow lockout, defaults to 170 degrees
 */
export const checkMuscleUp = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setCurrElbowAngle,
  setRepCount,
  targetElbowLockOutAngle = 170
) => {
  muscleUpInfo.targets["targetElbowLockOutAngle"] = targetElbowLockOutAngle;

  currState = genCheck(
    muscleUpInfo,
    (...args) => getTransitionType(...args, muscleUpInfo, currState),
    currState,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { ElbowAngle: setCurrElbowAngle }
  );
};
