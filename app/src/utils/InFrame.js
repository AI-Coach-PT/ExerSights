/**
 * Determines if the required body parts/limbs are in frame
 *
 * @param {Object} top The topmost required visible landmark for an exercise
 * @param {Object} bottom The bottommost required visible landmark for an exercise
 * @param {Object} left The leftmost required visible landmark for an exercise
 * @param {Object} right The rightmost required visible landmark for an exercise
 * 
 * Note: Not all exercises require all 4 (ex. Bridge only requires top and bottom)
 * Pass 'undefined' or 'null' for arguments you don't need 
 * 
 * @returns {in_frame} 1 if the body is fully in frame, 0 otherwise 
 */

export const inFrame = (top = null, bottom = null, left = null, right = null) => {
    let in_frame = 0;
    const visibility_threshold = 0.5

    // Track how many defined arguments pass the visibility check
    let validVisibilityCount = 0;
    let requiredCount = 0;

    // Check each argument only if it's provided (not null)
    if (top && top?.visibility > visibility_threshold) {
        validVisibilityCount++;
    }
    if (bottom && bottom?.visibility > visibility_threshold) {
        validVisibilityCount++;
    }
    if (left && left?.visibility > visibility_threshold) {
        validVisibilityCount++;
    }
    if (right && right?.visibility > visibility_threshold) {
        validVisibilityCount++;
    }

    // Count the number of defined (non-null) arguments
    if (top) requiredCount++;
    if (bottom) requiredCount++;
    if (left) requiredCount++;
    if (right) requiredCount++;

    // If all defined arguments pass the visibility check
    if (validVisibilityCount === requiredCount && requiredCount > 0 && validVisibilityCount > 0) {
        in_frame = 1;
    }

    return in_frame;
};