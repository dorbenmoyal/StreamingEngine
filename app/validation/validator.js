
/**
 * Validate the user input
 * @userInput - the user input
 */
export function isUserInputValid(userInput) {
        return !isNaN(userInput) &&
            !isNaN(parseFloat(userInput))
}