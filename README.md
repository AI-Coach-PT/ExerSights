# ExerSights

AI-powered application for fitness & rehab, providing real-time feedback on exercise form using state of the art computer vision models. Track, correct, and improve your exercise form for safer, smarter, and more effective workouts.

## Engineering Addendum

This document is intended to help future developers understand the core architecture and get up to speed on the current state of the codebase. 

This project aims to develop a web application to assess physical therapy techniques and athletic movements with computer vision. Key concepts of this project are integrating human pose detection models with video data that can accurately, efficiently, and constantly identify the user's current body position, as well as provide real-time feedback and guidance for the user to maintain the correct form during different physical activities, based on physiological literature. Our application will feature a catalog of exercises that users can quickly navigate to select their desired exercise and immediately start making improvements simply by activating their device camera. With a successful implementation of the application, it will positively impact fitness, physical therapy, and rehabilitation by improving exercise safety and effectiveness.

### Usage

This section covers how users are intended to access and use the project. We provide a YouTube tutorial [here](https://www.youtube.com/embed/a-16RUDbfmk?si=B4F6Q1K2--eXx2Ke) and on the home page, but additonally provide a text version here. 

Users are required to use a laptop or mobile device with a camera. Users will open the app by navigating to https://exersights.web.app/ on a web browser. For mobile devices, if the user wishes to download and use the progressive web app, they must follow the browser instructions appearing at the bottom of the page during the initial entry. 

Users will perform the following steps once on the home page:
1. Navigate to the Catalog page. Make sure you are logged in if you would like to use some of the account-specific features such as exercise settings, workout programs, and pinned exercises.
2. Search for and select a desired exercise by clicking on the exercise card.
3. Once on the exercise page, observe the feedback panel on the right. Click on the help (?) button to open a modal containing a tutorial and camera placement instructions for that specific exercise. Click the ‘close’ button or anywhere off the modal once finished viewing.
4. Click on the settings (gear) button to open a modal containing various exercise settings specifications including custom angle targets (such as target depth for squat) and voice selection for audio feedback.
5. If you would like to upload a video, click on the “Upload Video” button on the feedback panel.
6. Perform the exercise live by using your device’s webcam (or play your uploaded video) and hit the “Start Feedback” button. Ensure that your entire body is in frame and begin the exercise, adjusting your form based on the feedback.
    - If you would like to switch to an external webcam which is different from your device’s default, use the dropdown next to the “Start Feedback” button.
    - If you would like to use the timer, set a duration on the feedback panel and click the “Start n-Second Timer” (where n is the number of seconds you input in the duration field; 30 seconds by default) button to begin.
7. At the end of the exercise, a summary pop-up will be displayed. If you are logged in, you will have the option to save this summary which can be viewed later in the “My ExerSights” page at the top right.

Users also have the ability to create personalized workouts by performing the following:
1. Make sure you are logged in, and navigate to the Program page.
2. Click the + icon to create a new workout.
3. Click the gear icon to edit existing workouts. This will open a modal where you can select an exercise from the dropdown and add/position it within the program. Click “Save” and “Close” to save your changes to the database and exit out of the modal.
4. Users can navigate to the FAQ page to see answers to frequently-asked questions and a form to submit requests for new exercises, feedback, or additional questions.

#### Operating Environment

- **Crowded Environment**: We do not advise using ExerSights in a crowded environment. While it is possible for the Mediapipe computer vision model to detect more than one person in the frame, we have limited control over the model and cannot guarantee that it will always detect the correct person performing the exercise. By default, ExerSights is programmed to assume only one person is in the frame. To avoid the model switching to another person, ensure that you are the only one in frame.
- **Lighting/Background**: To ensure the highest feedback accuracy, please perform exercises in a well-lit area where your body joints/limbs are discernible and visible to the camera. Also, make sure that there is a degree of contrast between you and the background. If you are wearing all blue clothes and your background is a blue wall, the model may have difficulty identifying your joint positions.
- **Camera Placement**: Each exercise has its own ideal camera placement, which ensures the highest accuracy of its feedback. For example, the squat exercise recommends users to position themselves so that the side of their body is facing the camera. Although it is possible to perform the exercise with the front of your body facing the camera, it will not be as accurate.
- **Visibility of Joints/Limbs**: In order to receive the most accurate feedback, please ensure that your entire body is visible to the camera. It is possible for the computer vision model to guess the position of non-visible joints, but this is often inaccurate and jittery. If your entire body is not in frame, the feedback panel will display the “Make sure all limbs are visible” error message as a warning.
- **Cheating the Model**: It is possible to cheat while doing many of the exercises, as our system takes into account a limited number of joint angles/positions to calculate feedback. For example, you can cheat the squat exercise by simply lifting your knee up to bend it beyond the target angle. We assume that all users are acting in good faith when using the app. Cheating the app is not advised as it disrupts your own workout efficacy. 

### Development Advice

- Ensure you have configured a streamlined development environment sooner rather than later, especially when you have multiple contributors. This enables much faster and less frustrating development. We have already set-up a realtively smooth workflow and CI/CD for this project and repository. 
- When developing larger more complex features, we highly recommend developing a working prototype of the feature as quickly as possible. Especially for features that require API calls, getting those working can be complex and tedious in their own right (i.e. MediaPipe).
- We also recommend keeping the core architecture and code relatively simple when possible. We intentionally did not create a seperate backend, which streamlined not only development, but also the usage. 
- When it comes to software, clean and well-generalized code is always the ideal. However, this is not necessarliy always feasible so it is important to chose when and where you generalize your code. Specifically, components and pages that repeat several times should be generalized (exercise pages, feedback panel component, exercise settings pages)
- Beyond generalizing code, we also needed to generalize data for this project. It's important to standarize data you plan to parse often or save to the cloud. As an example, the distinction between the different exercise pages is the exercise data. The actual pages themselves share the same code. Similarly, our programs are also stored as a JSON.
- Thorough testing is always a must. Use `console.log` and your browser developer tools to detect and debug issues. Most previous can provide a heap snapshot to detect memory leaks as an example.
- As developers constantly working in trenches of a project, it can be hard to think outside the box to come up with new features, especially in regards to usability. We found that getting external feedback from Professor, friends, family, or even strangers is a great remedy to this issue.
- Exercise science is a very nuanced and complex topic in its own right. Translating this into software is not straightforward, so we advice starting with simple and ideal examples before tackling more complex exercises with many edge-cases.
- It's okay to make assumptions. ExerSights is built on the faith that users are genuinely attempting these exercises, meaning certain exercises can be simplified. As an example, the push-up only checks the upper body. It presumes that the user's lower body is set in the push-up position and it does not affect the exercise lofic, so we do not check for it.

### Project State

ExerSights is currently in a stable and functional state, with the core features of real-time exercise feedback, user accounts, workout programs, operating as intended and largely bug-free.

#### Current Features

- Real-time text, customizable audio, and customizable visual feedback for 10+ exercises
- Individual exercise personalization and exercise favoriting/pinning on Catalog
- Customizable programs to chain several exercises together into a Program
- Mobile-responsive site and Progressive Web App effective across all devices

### Future Features

- Add more exercises!
- Detecting 2 users in one camera feed.
- Alt text for buttons/other elements when highlighted
- Adding tags and categories to exercise (i.e. upper-body, lower-body)
- Allowing users to enable and disable feedback from a distance with some sort of audio or visual cue

### Non-critical Bug Fixes

- There is a buggy 'bubble' animation when exiting a page with the `esc` key somtimes.
- Stop feedback while another window is pulled up (settings or tutorial)
- Allow PWA to update upon internet access
- On mobile devices, audio feedback overrides the audio ding for a completed rep 

## Software Report

Our software report can be found in our Wiki at the following link: [https://github.com/AI-Coach-PT/ExerSights/wiki/Software-Report](/https://github.com/AI-Coach-PT/ExerSights/wiki/Software-Report)

## Exercise References

References for each exercise implementation can be found in our Wiki at the following link: [https://github.com/AI-Coach-PT/ExerSights/wiki/Exercise-References](/https://github.com/AI-Coach-PT/ExerSights/wiki/Exercise-References)
