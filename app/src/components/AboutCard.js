import { Card, CardContent, CardMedia, Typography, IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export const AboutCard = ({ img, name, affil = "Boston University", linkedInLink }) => {
  return (
    <Card sx={{ display: "flex", width: "30rem", borderRadius: "3rem" }}>
      <CardMedia component="img" image={img} sx={{ width: "15rem" }}></CardMedia>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
        }}>
        <Typography variant="h5">{name}</Typography>
        <Typography>{affil}</Typography>
        <IconButton href={linkedInLink} target="_blank" rel="noopener noreferrer">
          <LinkedInIcon fontSize="large" />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default AboutCard;
