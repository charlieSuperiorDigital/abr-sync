export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }
  
  // Use fixed format for consistency between server and client
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return 'Invalid time'
  }
  
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

export function getFriendlyDate(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }

  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  // Reset time parts for date comparison
  const dateToCheck = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
  const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

  if (dateToCheck.getTime() === todayDate.getTime()) {
    return 'Today'
  } else if (dateToCheck.getTime() === tomorrowDate.getTime()) {
    return 'Tomorrow'
  } else if (dateToCheck.getTime() === yesterdayDate.getTime()) {
    return 'Yesterday'
  }

  // If more than 7 days ago, return formatted date
  return formatDate(d)
}

export function createLocalISOString(date: string, time: string): string {
  // Parse the time string (e.g., "12:00 PM") to get hours and minutes
  const [timePart, meridiem] = time.split(' ')
  let [hours, minutes] = timePart.split(':').map(Number)
  
  // Convert to 24-hour format if needed
  if (meridiem === 'PM' && hours !== 12) {
    hours += 12
  } else if (meridiem === 'AM' && hours === 12) {
    hours = 0
  }

  // Create a new date object with the correct local time
  const [year, month, day] = date.split('-').map(Number)
  const d = new Date(year, month - 1, day, hours, minutes)

  // Format as ISO string but preserve the local time by adjusting for timezone offset
  const offset = d.getTimezoneOffset() * 60000 // Convert minutes to milliseconds
  return new Date(d.getTime() - offset).toISOString()
}
