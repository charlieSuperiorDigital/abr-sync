/**
 * Calculates the number of days until a target date and formats it as a string.
 * @param targetDate - The target date in ISO format
 * @returns A formatted string representing days until target date
 */
export const calculateDaysUntil = (targetDate: string | undefined): string => {
  if (!targetDate) return '---'
  
  const today = new Date()
  const target = new Date(targetDate)
  
  // Reset time components for accurate day calculation
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return 'Today'
  } else {
    return `${diffDays} days`
  }
}

/**
 * Formats a date string to localized date format
 * @param date - The date in ISO format
 * @returns A formatted date string or '---' if date is undefined
 */
export const formatDate = (date: string | undefined): string => {
  if (!date) return '---'
  return new Date(date).toLocaleDateString()
}
