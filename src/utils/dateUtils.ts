// utils/dateUtils.js

/**
 * Formats a date string to the specified format
 * @param {string} dateString - The date string to format
 * @param {string} format - The desired format (e.g., 'YYYY-MM-DD')
 * @returns {string} - The formatted date string
 */
// export function formatDate(dateString: any, format = 'YYYY-MM-DD') {
//   const date = new Date(dateString)
//   const year = date.getFullYear()
//   const month = String(date.getMonth() + 1).padStart(2, '0')
//   const day = String(date.getDate()).padStart(2, '0')

//   // Replace placeholders in the format string with corresponding date parts
//   return format.replace('YYYY', year).replace('MM', month).replace('DD', day)
// }

export function formatDate(dateString, format = 'YYYY-MM-DD') {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  let hours: any
  hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('hh', formattedHours)
    .replace('mm', minutes)
    .replace('a', ampm)
}
