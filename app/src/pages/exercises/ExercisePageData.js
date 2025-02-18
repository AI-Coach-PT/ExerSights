import { bridgeInfo, checkBridges } from "../../utils/exercises/Bridge";
import bridgeHelpImg from "../../assets/instructions/bridgeHelp.png";
import { instructionsTextBridge, instructionsVideoBridge } from "../../assets/content";

import { deadBugInfo, checkDeadBug } from "../../utils/exercises/DeadBug";
import deadbugHelpImg from "../../assets/instructions/deadbugHelp.png";
import { instructionsTextDeadbug, instructionsVideoDeadbug } from "../../assets/content";

import { pushUpInfo, checkPushup } from "../../utils/exercises/PushUp";
import pushupHelpImg from "../../assets/instructions/pushupHelp.png";
import { instructionsTextPushup, instructionsVideoPushup } from "../../assets/content";

import { squatInfo, checkSquats } from "../../utils/exercises/Squat";
import squatHelpImg from "../../assets/instructions/squatHelp.png";
import { instructionsTextSquat, instructionsVideoSquat } from "../../assets/content";

import { pullUpInfo, checkPullup } from "../../utils/exercises/PullUp";
import pullupHelpImg from "../../assets/instructions/pullupHelp.png";
import { instructionsTextPullup, instructionsVideoPullup } from "../../assets/content";

import { muscleUpInfo, checkMuscleUp } from "../../utils/exercises/MuscleUp";
import muscleupHelpImg from "../../assets/instructions/pullupHelp.png";
import { instructionsTextMuscleup, instructionsVideoMuscleup } from "../../assets/content";

import { latExtRotationInfo, checkLatExtRotation } from "../../utils/exercises/LatExtRotation"
import latextrotationHelpImg from "../../assets/instructions/latExtRotationHelp.png"
import { instructionsTextLatExtRotation, instructionsVideoLatExtRotation } from "../../assets/content";

import { plankInfo, checkPlank } from "../../utils/exercises/Plank";
import plankHelpImg from "../../assets/instructions/plankHelp.png"
import { instructionsTextPlank } from "../../assets/content";

export const bridge = {
    fsm: bridgeInfo,
    checkFunction: checkBridges,
    helpImage: bridgeHelpImg,
    instructionsText: instructionsTextBridge,
    instructionsVideo: instructionsVideoBridge,
}

export const deadbug = {
    fsm: deadBugInfo,
    checkFunction: checkDeadBug,
    helpImage: deadbugHelpImg,
    instructionsText: instructionsTextDeadbug,
    instructionsVideo: instructionsVideoDeadbug
}

export const pushup = {
    fsm: pushUpInfo,
    checkFunction: checkPushup,
    helpImage: pushupHelpImg,
    instructionsText: instructionsTextPushup,
    instructionsVideo: instructionsVideoPushup
}

export const squat = {
    fsm: squatInfo,
    checkFunction: checkSquats,
    helpImage: squatHelpImg,
    instructionsText: instructionsTextSquat,
    instructionsVideo: instructionsVideoSquat
}

export const pullup = {
    fsm: pullUpInfo,
    checkFunction: checkPullup,
    helpImage: pullupHelpImg,
    instructionsText: instructionsTextPullup,
    instructionsVideo: instructionsVideoPullup
}

export const muscleup = {
    fsm: muscleUpInfo,
    checkFunction: checkMuscleUp,
    helpImage: muscleupHelpImg,
    instructionsText: instructionsTextMuscleup,
    instructionsVideo: instructionsVideoMuscleup
}

export const latExtRotation = {
    fsm: latExtRotationInfo,
    checkFunction: checkLatExtRotation,
    helpImage: latextrotationHelpImg,
    instructionsText: instructionsTextLatExtRotation,
    instructionsVideo: instructionsVideoLatExtRotation
}

export const plank = {
    fsm: plankInfo,
    checkFunction: checkPlank,
    helpImage: plankHelpImg,
    instructionsText: instructionsTextPlank,
    instructionsVideo: instructionsVideoPullup
}