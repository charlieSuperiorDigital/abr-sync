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
