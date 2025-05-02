import { calculateAngle } from '../helpers/Angles';

function createPushUpChecker() {
  let pushUpCount = 0;
  let inPushUpPosition = false;
  let closerArm = null;

  return function pushUpGameCheck(
    landmarks,
    onFeedbackUpdate,
    setCurrElbowAngle,
    setRepCount,
    targetElbowAngle = 65
  ) {
    const thresholdAngle = 150;
    let currentAngle = 150;

    if (!closerArm || !inPushUpPosition) {
      closerArm = getCloserArm(landmarks);
    }

    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftHand = landmarks[15];
    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightHand = landmarks[16];

    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftHand);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightHand);

    currentAngle = closerArm === 'left' ? leftElbowAngle : rightElbowAngle;
    setCurrElbowAngle(currentAngle);

    if (currentAngle < targetElbowAngle && !inPushUpPosition) {
      inPushUpPosition = true;
      onFeedbackUpdate('Down');
    }

    if (currentAngle > thresholdAngle && inPushUpPosition) {
      inPushUpPosition = false;
      pushUpCount += 1;
      onFeedbackUpdate('Up');
      setRepCount(pushUpCount);
    }
  };
}

function getCloserArm(landmarks) {
  const leftZ = landmarks[15].z;
  const rightZ = landmarks[16].z;
  return leftZ < rightZ ? 'left' : 'right';
}

export default createPushUpChecker;
