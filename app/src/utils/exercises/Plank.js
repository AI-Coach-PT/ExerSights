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
      leftHipAngle: [12, 24, 26],
      rightHipAngle: [11, 23, 25],
    },
  },

  targets: {
    targetHipAngle: 145,
  },

  disableVisibilityCheck: false,
};

let currStatePlank;

/**
 * Determines the type of transition based on pull-up posture and arm movement.
 *
 * @param {object} jointData Object containing calculated angles for relevant joints.
 * @returns {string|null} The type of transition ("hitTarget", "descending", "finishing") or null if no transition applies.
 */
const getTransitionTypePlank = (jointData, closerSide) => {
  const { leftHipAngle, rightHipAngle } = jointData;

  const targetHipAngle = plankInfo.targets["targetHipAngle"];

  const hipAngle = closerSide === "left" ? leftHipAngle : rightHipAngle;

  if (currStatePlank === "MISALIGNED_HIP" && hipAngle > targetHipAngle) return "aligned";
  if (currStatePlank === "ALIGNED_HIP" && hipAngle < targetHipAngle) return "misaligned";

  return "null";
};

/**
 * Checks lateral external rotation based on given landmarks and updates feedback.
 *
 * @param {Array} landmarks - An array of landmarks used for calculating angles.
 * @param {Function} onFeedbackUpdate - Callback function to update feedback based on the current state.
 * @param {Function} setCurrSideAngle - Function to set the current side angle.
 * @param {Function} setRepCount - Function to update the repetition count.
 * @param {number} [targetHipAngle=145] - The target angle for side rotation. Defaults to 140 if not specified.
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

  currStatePlank = genCheck(
    plankInfo,
    getTransitionTypePlank,
    currStatePlank,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    { HipAngle: setCurrHipAngle }
  );
};


/** 
 * FSM for checking if arm are aligned
 * States: ALIGNED_ARM, MISALIGNED_ARM
 * Transitions: aligned, misaligned
 * Accesses shoulder and elbow x positions
 */
const armInfo = {
  states: {
      MISALIGNED_ARM: { feedback: "Make sure shoulder(s) are above elbow(s)", audio: false, countRep: false, color: "" },
      ALIGNED_ARM: { feedback: "Arms Good", audio: false, countRep: false, color: ""}
  },

  transitions: {
      MISALIGNED_ARM: {
          aligned: "ALIGNED_ARM",
      },
      ALIGNED_ARM: {
          misaligned: "MISALIGNED_ARM",
      }
  },

  jointInfo: {
      joints: {
        leftShoulder: 11,
        leftElbow: 13,
        rightShoulder: 12,
        rightElbow: 14,
      },
      jointPos: {
        leftShoulder: 11,
        leftElbow: 13,
        rightShoulder: 12,
        rightElbow: 14,
      }
  },

  disableVisibilityCheck: true
};

let currStateArm;
/**
* Determines the type of transition based on chest posture (hip angles).
*
* @param {object} jointAngles Object containing calculated angles for relevant joints.
* @returns {string|null} The type of transition ("leaningTooFar", "upright") or null if no transition applies.
*/
const getTransitionTypeArm = (jointData, closerSide) => {
  //const { leftShoulderPos, leftElbowPos, rightShoulderPos, rightElbowPos } = jointData;
  const leftShoulderPos = jointData["leftShoulder"];
  const leftElbowPos = jointData["leftElbow"];
  const rightShoulderPos = jointData["rightShoulder"];
  const rightElbowPos = jointData["rightElbow"];
    //leftElbowPos, rightShoulderPos, rightElbowPos } = jointData;

  const shoulderPos = closerSide === "left" ? leftShoulderPos : rightShoulderPos;
  const elbowPos = closerSide === "left" ? leftElbowPos : rightElbowPos;

  console.log(shoulderPos.x, elbowPos.x);

  if(currStateArm === "MISALIGNED_ARM" && shoulderPos.x <= elbowPos.x + 0.05 && shoulderPos.x >= elbowPos.x - 0.05) 
    return "aligned";

  if(currStateArm === "ALIGNED_ARM" && (shoulderPos.x > elbowPos.x + 0.05 || shoulderPos.x < elbowPos.x - 0.05))
    return "misaligned";

  return "null";
};



/**
* Checks and updates the arm position state based on the provided landmarks
* Leverages generalized feedback checking method.
*
* @param {Object} landmarks - The landmarks of the body to evaluate posture.
* @param {Function} onFeedbackUpdate - Callback function to handle feedback updates.
*/
export const checkArms = (
  landmarks,
  onFeedbackUpdate,
  setColor,
  setRepCount,
) => {

  currStateArm = genCheck(
    armInfo,
    getTransitionTypeArm,
    currStateArm,
    landmarks,
    onFeedbackUpdate,
    setColor,
    setRepCount,
    {}
  );
};
