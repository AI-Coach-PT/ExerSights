import { bridgeInfo, checkBridges } from "../../utils/exercises/Bridge";
import bridgeHelpImg from "../../assets/instructions/bridgeHelp.png";
import { instructionsTextBridge, instructionsVideoBridge } from "../../assets/content";

import { deadBugInfo, checkDeadBug } from "../../utils/exercises/DeadBug";
import deadbugHelpImg from "../../assets/instructions/deadbugHelp.png";
import { instructionsTextDeadbug, instructionsVideoDeadbug } from "../../assets/content";

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
    }
};