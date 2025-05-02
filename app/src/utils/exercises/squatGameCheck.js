import { calculateAngle } from '../helpers/Angles';

function createSquatChecker() {
  let squatCount = 0;
  let inSquatPosition = false;
  let closerLeg = null;

  return function squatGameCheck(
    landmarks,
    onFeedbackUpdate,
    setCurrKneeAngle,
    setRepCount,
    targetKneeAngle = 90
  ) {
    const thresholdAngle = 160;
    let currentAngle = 160;

    if (!closerLeg || !inSquatPosition) {
      closerLeg = getCloserLeg(landmarks);
    }

    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    currentAngle = closerLeg === 'left' ? leftKneeAngle : rightKneeAngle;
    setCurrKneeAngle(currentAngle);

    if (currentAngle < targetKneeAngle && !inSquatPosition) {
      inSquatPosition = true;
      onFeedbackUpdate('Down');
    }

    if (currentAngle > thresholdAngle && inSquatPosition) {
      inSquatPosition = false;
      squatCount += 1;
      onFeedbackUpdate('Up');
      setRepCount(squatCount);
    }
  };
}

function getCloserLeg(landmarks) {
  const leftZ = landmarks[27].z;
  const rightZ = landmarks[28].z;
  return leftZ < rightZ ? 'left' : 'right';
}

export default createSquatChecker;
