import React, { useState } from "react";
import { Typography, Box, IconButton, Tooltip } from "@mui/material";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { setVoiceName } from "../utils/helpers/Audio";

function VoiceButton() {
    const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);

    const toggleVoiceFeedback = () => {
        setVoiceName(voiceFeedbackEnabled ? "None" : "Google US English");
        setVoiceFeedbackEnabled((prevState) => !prevState);
    };

    return (
        <Tooltip title={`${voiceFeedbackEnabled ? 'Disable' : 'Enable'} Voice Feedback`}>
            <IconButton onClick={toggleVoiceFeedback}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <RecordVoiceOverIcon sx={{ color: voiceFeedbackEnabled ? "primary.main" : "" }} />
                    <Typography>AI Voice</Typography>
                </Box>
            </IconButton>
        </Tooltip>
    );
}

export default VoiceButton;