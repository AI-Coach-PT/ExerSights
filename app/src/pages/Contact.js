import React from "react";
import { Typography, Box } from "@mui/material";
import ContactForm from "../components/ContactForm";

function Contact() {
  return (
    <Box sx={{ textAlign: "center", padding: "0.5rem" }}>
      <Typography variant="h1" gutterBottom>
        Contact us!
      </Typography>
      <ContactForm />
    </Box>
  );
}

export default Contact;
