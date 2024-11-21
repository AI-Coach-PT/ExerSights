import React, { useState, useEffect } from "react";
import { IconButton, Modal, Box, Typography, Button, TextField } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { loadExerciseSettings, storeExerciseSettings } from "../utils/ExerciseSettings";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

function SettingsModal({ exerciseName, targetAngles, setTargetAnglesArray }) {
    const [openModal, setOpenModal] = useState(false);

    const [userEmail, setUsername] = useState("");
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);

        if (userLoggedIn) {
            storeExerciseSettings(userEmail, exerciseName, targetAngles);
            loadExerciseSettings(userEmail, exerciseName, setTargetAnglesArray);
        }
    };

    const handleInputChange = (index, value) => {
        const [setAngle, key] = setTargetAnglesArray[index];
        setAngle(value); // Update the state directly
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsername(user.email);
                setUserLoggedIn(true);
                // Load settings upon a signed-in user navigating to exercise page;
                // if the user does not have saved settings, this will do nothing,
                // and the last set values will be used (most likely default values)
                loadExerciseSettings(userEmail, exerciseName, setTargetAnglesArray);
            } else {
                setUsername("");
                setUserLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, [userEmail]);

    return (
        <div>
            <IconButton sx={{ position: "static" }} onClick={handleOpenModal}>
                <SettingsIcon fontSize="small" />
            </IconButton>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid black",
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ marginBottom: "20px" }}>
                        Adjust Exercise Settings
                    </Typography>
                    {setTargetAnglesArray.map(([_, key], index) => (
                        <TextField
                            key={key}
                            id={`outlined-number-${key}`}
                            label={`Target ${key.replace("target", "")}`}
                            type="number"
                            value={targetAngles[key]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            sx={{ marginBottom: "20px" }}
                        />
                    ))}
                    <Button variant="contained" onClick={handleCloseModal}>
                        Save & Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default SettingsModal;
