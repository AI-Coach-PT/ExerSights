import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function ContactForm() {
  // State to store and display form submission status
  const [result, setResult] = useState("");

  // Handle form submission
  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setResult("Sending...."); // Show sending status
    const formData = new FormData(event.target); // Create FormData object from form

    // Add Web3Forms access key to formData
    formData.append("access_key", "2fe1561a-b924-4fc7-97f1-fabada7d79ec");

    // Send POST request to Web3Forms API
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    // Parse response data
    const data = await response.json();

    // Handle submission result
    if (data.success) {
      setResult("Thank you for your feedback!");
      event.target.reset(); // Clear form fields
    } else {
      console.log("Error", data);
      setResult(data.message); // Display error message
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flexWrap: "wrap",
        textAlign: "center",
        width: "50rem",
        maxWidth: "90%",
        padding: "0 16px",
      }}>
      <form onSubmit={onSubmit} style={{ width: "100%" }}>
        <Box sx={{ mb: "1rem" }}>
          <TextField
            fullWidth
            type="text"
            name="name"
            placeholder="Your Name"
            required
            autoComplete
            //autoFocus
          />
        </Box>
        <Box sx={{ mb: "1rem" }}>
          <TextField
            fullWidth
            type="email"
            name="email"
            placeholder="your_email@gmail.com"
            required
            autoComplete
          />
        </Box>
        <Box sx={{ mb: "1rem" }}>
          <TextField
            fullWidth
            name="message"
            placeholder="Your feedback helps us improve! Feel free to also let us know what you would like to see. Now, what would you like to tell us?"
            required
            multiline
            autoComplete
            minRows={2}
          />
        </Box>
        <Button type="submit" variant="contained" sx={{ mb: "1rem", width: "100%" }}>
          Submit Form
        </Button>
      </form>
      <Box sx={{ flexBasis: "100%" }}>
        <Typography variant="body1">{result}</Typography>
      </Box>
    </Box>
  );
}
