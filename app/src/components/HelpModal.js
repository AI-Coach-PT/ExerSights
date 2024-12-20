import React, { useState } from "react";
import { IconButton, Modal, Box, Typography, Button } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

/**
 * HelpModal Component
 *
 * This component renders an informational modal to assist users with exercise instructions, specifically
 * for providing guidance on camera placement. It includes an question mark icon button that, when clicked,
 * opens a modal containing instructional image and text.
 *
 * @component
 * @param {string} image - The URL of the image to display in the modal, typically depicting camera placement instructions
 * @param {string} description - The text providing instrutions and guidance on camera placement
 *
 * @returns {JSX.Element} - Returns a modal component that can be triggered by a question mark icon button.
 */
function HelpModal({ image, description }) {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <div>
            <IconButton sx={{ position: "static" }} onClick={handleOpenModal}>
                <QuestionMarkIcon fontSize="small" />
            </IconButton>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 800,
                        bgcolor: "background.paper",
                        border: "2px solid black",
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxHeight: "90vh",
                        overflow: "auto",
                    }}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ marginBottom: "4vh" }}>
                        Camera Placement Instructions
                    </Typography>

                    <img src={image} width={500} />

                    <Typography
                        variant="body2"
                        height="5vh"
                        textAlign="center"
                        width={600}
                        sx={{ color: "text.secondary", marginTop: "4vh", marginBottom: "4vh" }}>
                        {description}
                    </Typography>

                    <Button variant="contained" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default HelpModal;
