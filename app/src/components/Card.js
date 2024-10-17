import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';

/**
 * ExerciseCard displays a card with an image, title, description, and an optional link for navigation.
 * If a `link` is provided, the card is clickable and navigates to the specified route using `react-router-dom`.
 *
 * @component
 * @param {string} image The URL of the image to display.
 * @param {string} title The title of the exercise.
 * @param {string} description A short description of the exercise.
 * @param {string} link The URL to navigate to when the card is clicked.
 * @returns {JSX.Element} A card displaying exercise details.
 */
function ExerciseCard({ image, title, description, link }) {
    return (
        <Card>
            <CardActionArea component={link ? Link : 'div'} to={link ? link : null}>
                <CardMedia
                    component="img"
                    image={image}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} height="5vh">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ExerciseCard;