/**
 * Calculates the angle (in degrees) between three points (a, b, and c) in 2D space.
 * The angle is measured at point `b`, where the line segments `a-b` and `b-c` form the angle.
 *
 * @param {Object} a The first point (a) (all points contain `x` and `y` coordinates).
 * @param {Object} b The central point (b), point where the angle is formed.
 * @param {Object} c The third point (c).
 * 
 * @returns {number} The angle in degrees (0° to 180°), between the three points.
 *                   If the calculated angle exceeds 180°, it is adjusted to fall within 0° to 180°.
 */
export const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
};