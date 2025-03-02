let detectPose;

export default async function getDetectPose(...args) {
    if (!detectPose) {
        detectPose = (await (process.env.REACT_APP_MODEL === 'tasks-vision'
            ? import('./PoseDetectorTasksVision')
            : import('./PoseDetectorPose'))
        ).default;
    }
    return detectPose(...args);
}