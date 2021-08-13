
export function isUserInputValid(userInput) {
        return !isNaN(userInput) &&
            !isNaN(parseFloat(userInput))
}