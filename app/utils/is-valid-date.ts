export const isValidDate = (date: string | undefined): boolean => {
    if (!date) return false;
    
    // Check for invalid date formats
    const invalidDates = ['0001-01-01T00:00:00', '0001-01-01T00:00:00.000Z'];
    if (invalidDates.includes(date)) return false;
    
    // Try to parse the date
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };