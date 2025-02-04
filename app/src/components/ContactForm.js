import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function ContactForm() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "2fe1561a-b924-4fc7-97f1-fabada7d79ec");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
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
      }}>
      <form onSubmit={onSubmit}>
        <Box sx={{ mb: "1rem" }}>
          <TextField type="text" name="name" placeholder="Your name" required error />
        </Box>
        <Box sx={{ mb: "1rem" }}>
          <TextField type="email" name="email" placeholder="Your email" required error />
        </Box>
        <Box sx={{ mb: "1rem" }}>
          <TextField
            name="message"
            placeholder="What would you like to tell us?"
            required
            error
            multiline
            sx={{ width: "80%" }}
          />
        </Box>
        <Button type="submit" variant="contained">
          Submit Form
        </Button>
      </form>
      <Box sx={{ flexBasis: "100%" }}>
        <Typography>{result}</Typography>
      </Box>
    </Box>
  );
}
