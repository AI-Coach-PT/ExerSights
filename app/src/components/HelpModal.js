import React, { useState } from "react";
import { IconButton, Modal, Box, Typography, Button } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

/**
 * HelpModal Component
 *
 * This component renders an informational modal to assist users with exercise instructions, specifically
 * for providing guidance on camera placement. It includes a question mark icon button that, when clicked,
 * opens a modal containing an instructional video, image, and text.
 *
 * @component
 * @param {string} image - The URL of the image to display in the modal, typically depicting camera placement instructions.
 * @param {string} description - The text providing instructions and guidance on camera placement.
 *
 * @returns {JSX.Element} - Returns a modal component that can be triggered by a question mark icon button.
 */
function HelpModal({ image, description, video }) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>
      <IconButton
        onClick={handleOpenModal}
        sx={{ position: "relative", gap: "3px", color: "text.primary" }}>
        <QuestionMarkIcon fontSize="small" />
        <Typography>Help</Typography>
      </IconButton>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vw",
            height: "80vh",
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
            boxShadow: "0px 0px 20px 0px rgba(255,255,255,1)",
            p: 4,
            borderRadius: "20px",
            textAlign: "center",
          }}>
          <Typography id="modal-modal-title" variant="h3" sx={{ mb: "1rem" }}>
            Video Tutorial
          </Typography>
          <iframe
            width="100%"
            src={video}
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: "8px",
              aspectRatio: "16/9",
              marginBottom: "2rem",
            }}></iframe>
          <Typography id="modal-modal-title" variant="h3" sx={{ mb: "1rem" }}>
            Camera Placement Instructions
          </Typography>
          <Box
            component="img"
            src={image}
            sx={{
              width: "80%",
              mb: "1rem",
              borderRadius: "10px",
            }}
          />
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: "1rem" }}>
            {description}
          </Typography>
          <Button variant="contained" onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default HelpModal;
