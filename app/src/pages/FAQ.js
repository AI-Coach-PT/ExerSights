import { React, useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ContactForm from "../components/ContactForm";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
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
    // {
    //   question: "",
    //   answer: [
    //     "Yes! ExerSights is 100% free to use! ExerSights is also 100% open source, and you can find the source code at: https://github.com/AI-Coach-PT/ExerSights",
    //   ],
    // },
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
      question: "What are the ideal conditions for using ExerSights?",
      answer: [
        "As a software-only AI coach/physical therapist, ExerSights is limited in its capabilities. To best use our app, we recommend using the app under the following conditions:",
        "- You are fully in frame, such that the webcam display shows your entire body.",
        "- You are the only person in frame. See the previous FAQ for details!",
        "- You are wearing colors that do not match your background; that is, your clothing is in high contrast with your background.",
        "- You are in a well-lit environment.",
        "- You followed the camera setup instructions in the 'Help' tab located on the feedback panel in every page.",
        "- You have customized the target angle(s) of the exercise(s) you are performing via the 'Settings' tab located on the feedback panel in every page, to best fit your individual needs.",
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

  const [q1Open, setQ1Open] = useState(false);

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
          {/* Explicitly write out the first question since it has a hyperlink */}
          <Box>
            <ListItemButton onClick={() => setQ1Open(!q1Open)} sx={{ px: 0 }}>
              <ListItemText
                primary={<Typography variant="h5">{"Is ExerSights free to use?"}</Typography>}
              />
              {q1Open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={q1Open} timeout="auto" unmountOnExit>
              <Typography
                variant="body1"
                sx={{ textAlign: "left", mb: "0.5rem", color: "text.secondary" }}>
                {
                  "Yes! ExerSights is 100% free to use! ExerSights is also 100% open source, and you can find the source code at: "
                }
                <Link
                  href="https://github.com/AI-Coach-PT/ExerSights"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="text.secondary">
                  https://github.com/AI-Coach-PT/ExerSights
                </Link>
              </Typography>
            </Collapse>
            <Divider />
          </Box>

          {faqData.map((faq) => (
            <FAQItem question={faq.question} answer={faq.answer} />
          ))}
        </List>
      </Box>

      <Typography variant="h5" sx={{ width: "60rem", maxWidth: "90%", alignItems: "center" }}>
        Another concern we did not address, or have additional feedback?
      </Typography>
      <Typography variant="h6" sx={{ mb: "1rem", maxWidth: "90%", color: "text.secondary" }}>
        We always want to hear from you! Contact us using the form below!
      </Typography>
      <ContactForm />
    </Box>
  );
}

export default FAQ;
