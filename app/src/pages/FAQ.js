import { React, useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ContactForm from "../components/ContactForm";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{}}>
      <ListItemButton onClick={() => setOpen(!open)} sx={{ px: 0 }}>
        <ListItemText primary={<Typography variant="h5">{question}</Typography>} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {answer.map((ans) => (
          <Typography
            variant="body1"
            sx={{ textAlign: "left", mb: "0.5rem", color: "text.secondary" }}>
            {ans}
          </Typography>
        ))}
      </Collapse>
      <Divider />
    </Box>
  );
};

function FAQ() {
  const faqData = [
    {
      question: "Is ExerSights free to use?",
      answer: [
        "Yes! ExerSights is 100% free to use! ExerSights is also 100% open source, and you can find the source code at: https://github.com/AI-Coach-PT/ExerSights ",
      ],
    },
    {
      question: "How do I use ExerSights?",
      answer: [
        "See our tutorial video on the home page (you may have to scroll down)! It will walk you through how to use every part of ExerSights thoroughly, and enable you to improve your exercise performance immediately!",
      ],
    },
    {
      question: "What does logging in to ExerSights through Google Single-Sign On do for me?",
      answer: [
        "Logging into ExerSights allows you to edit and store exercise angle preferences, pinned exercises (on the catalog page), and custom-made exercise programs on Google Firebase, allowing you to use ExerSights on multiple devices and synchronize your preferences and programs! ExerSights does not store any of your personal data.",
      ],
    },
    {
      question: "What happens to my personal data?",
      answer: ["Absolutely nothing. ExerSights does not store any of your personal data."],
    },
    {
      question: "Can I use ExerSights in a crowded environment, or even with multiple people?",
      answer: [
        "We do not advise using ExerSights in a crowded environment. While it is possible for the Mediapipe computer vision model (see the next question) to detect more than one person in the frame, we have limited control over the model and cannot guarantee that it will always detect the correct person performing the exercise. By default, ExerSights is programmed to assume only one person is in the frame.",
        "That said, we are actively working on a two-player game feature, where two people can be in frame simultaneously and compete against each other. Look out for this feature soon!",
      ],
    },
    {
      question: "What is ExerSights not capable of?",
      answer: [
        "As a software-only AI coach/physical therapist, ExerSights is limited in its capabilities. To understand its limitations, it is appropriate to understand how ExerSights provides real-time feedback.",
        "At its core, ExerSights leverages Google's Mediapipe framework to precisely locate your joints. ExerSights then computes the angles between relevant joints for specific exercises. By analyzing these angles, ExerSights identifies which phase of an exercise you're currently performing, and provides real-time, personalized feedback to guide your workout.",
        "As a result, it is possible to cheat ExerSights’ feedback and repetition counter by not actually performing the exercises and just bending your limbs into the appropriate positions; however, Team ExerSights does not recommend this, as this would only waste your own time that you can be using to improve your general fitness.",
      ],
    },
    {
      question: "Can I trust ExerSights to provide me accurate feedback?",
      answer: [
        "We have developed ExerSights with accuracy and correctness in mind, and a list of references can be found on our open-source GitHub repository. However, we cannot guarantee accuracy and correctness, so we have to reiterate our disclaimer found on the homepage.",
        "Exercise feedback and stats provided may not always be accurate. We are not liable for inaccurate feedback or any resulting injuries. Always consult a professional trainer before performing exercises. Use at your own risk.",
      ],
    },
    {
      question: "A particular feature is not working! What do I do?",
      answer: [
        "We are sorry to hear our feature is not working for you! We recommend using Google Chrome as your browser, so ensure you are using that if a feature is not working.",
        "If you are already on Chrome, please also try to perform a hard refresh on the ExerSights page so that you are not using any stale, cached content.",
        "If nothing is working, leave us a message below! We would love to help you out!",
      ],
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        padding: "0.5rem",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Typography variant="h1" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ width: "60rem", maxWidth: "90%", mb: "1.5rem" }}>
        <List disablePadding>
          {faqData.map((faq) => (
            <FAQItem question={faq.question} answer={faq.answer} />
          ))}
        </List>
      </Box>

      <Box sx={{ width: "60rem", maxWidth: "90%" }}>
        <Typography variant="h5" sx={{ width: "60rem", maxWidth: "90%" }}>
          Another concern we did not address, or have additional feedback?
        </Typography>
        <Typography variant="h6" sx={{ mb: "1rem", color: "text.secondary" }}>
          We always want to hear from you! Contact us using the form below!
        </Typography>

        <ContactForm />
      </Box>
    </Box>
  );
}

export default FAQ;
