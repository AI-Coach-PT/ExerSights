let detectPose;

export default async function getDetectPose(...args) {
    if (!detectPose) {
        detectPose = (await import('./PoseDetectorTasksVision')).default;
    }
    return detectPose(...args);
}