import React, { useState } from "react";
import { IconButton, Modal, Box, Typography, Button } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

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
            <IconButton
                sx={{ position: 'absolute', top: '10px', right: '40px' }}
                onClick={handleOpenModal}
            >
                <QuestionMarkIcon />
            </IconButton>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 800,
                        bgcolor: 'background.paper',
                        border: '2px solid black',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
                        Camera Placement Instructions
                    </Typography>

                    <img src={image} width={500} />

                    <Typography variant="body2" height="5vh" sx={{ color: 'text.secondary', marginTop: '20px' }}>
                        {description}
                    </Typography>

                    <Button variant="contained" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div >
    );
}

export default HelpModal;