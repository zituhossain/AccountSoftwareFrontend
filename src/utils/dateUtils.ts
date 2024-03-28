// utils/dateUtils.js

/**
 * Formats a date string to the specified format
 * @param {string} dateString - The date string to format
 * @param {string} format - The desired format (e.g., 'YYYY-MM-DD')
 * @returns {string} - The formatted date string
 */
export function formatDate(dateString, format = 'YYYY-MM-DD') {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  // Replace placeholders in the format string with corresponding date parts
  return format.replace('YYYY', year).replace('MM', month).replace('DD', day)
}
