import React from "react";
import { Typography, Box } from "@mui/material";
import ContactForm from "../components/ContactForm";

function Contact() {
  return (
    <Box sx={{ m: "20px", textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        Contact us!
      </Typography>
      <ContactForm />
    </Box>
  );
}

export default Contact;
