export const loadExerciseData = async (exerciseName) => {
    try {
        const module = await import(`../../utils/exercises/${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1)}`);
        const contentModule = await import(`../../assets/content`);
        const imageModule = await import(`../../assets/instructions/${exerciseName}Help.png`);

        return {
            fsm: module[`${exerciseName}Info`],
            checkFunction: module[`check${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1)}`],
            helpImage: imageModule.default,
            instructionsText: contentModule[`instructionsText${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1)}`],
            instructionsVideo: contentModule[`instructionsVideo${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1)}`],
        };
    } catch (error) {
        console.error(`Error loading exercise data for ${exerciseName}:`, error);
        return null;
    }
};