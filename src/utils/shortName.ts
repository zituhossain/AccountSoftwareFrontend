/**
 * Function to extract the first letter of each word in a given string and return them in lowercase.
 * @param {string} input - The input string (e.g., "Cash", "Account Receivable").
 * @returns {string} - A string containing the first letter of each word in lowercase.
 */
export function getFirstLetterLowerCase(input: string): string {
  // Split the input string by spaces to get an array of words
  const words = input.split(' ')

  // Map each word to its first letter and convert it to lowercase
  const firstLetters = words.map(word => word.charAt(0).toLowerCase())

  // Join the first letters into a single string and return it
  return firstLetters.join('')
}
