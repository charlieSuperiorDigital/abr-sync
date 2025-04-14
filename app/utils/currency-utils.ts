/**
 * Formats a number as USD currency
 * @param amount - The amount to format
 * @returns A formatted currency string or '---' if amount is undefined
 */
export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined) return '---'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
