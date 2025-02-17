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

export const exerciseFSMs = {
    bridge: {
        fsm: bridgeInfo,
        checkFunction: checkBridges,
        helpImage: bridgeHelpImg,
        instructionsText: instructionsTextBridge,
        instructionsVideo: instructionsVideoBridge,
    },
    deadbug: {
        fsm: deadBugInfo,
        checkFunction: checkDeadBug,
        helpImage: deadbugHelpImg,
        instructionsText: instructionsTextDeadbug,
        instructionsVideo: instructionsVideoDeadbug
    },
    pushup: {
        fsm: pushUpInfo,
        checkFunction: checkPushup,
        helpImage: pushupHelpImg,
        instructionsText: instructionsTextPushup,
        instructionsVideo: instructionsVideoPushup
    },
    squat: {
        fsm: squatInfo,
        checkFunction: checkSquats,
        helpImage: squatHelpImg,
        instructionsText: instructionsTextSquat,
        instructionsVideo: instructionsVideoSquat
    },
    pullup: {
        fsm: pullUpInfo,
        checkFunction: checkPullup,
        helpImage: pullupHelpImg,
        instructionsText: instructionsTextPullup,
        instructionsVideo: instructionsVideoPullup
    }
};