import { TenantPartOrder } from '@/app/types/parts';

/**
 * Returns the total estimated value of all part orders in an opportunity. The original object passed as an argument should be of TenantPartOrder type
 * @param partOrders Array of part orders from a TenantPartOrder
 * @returns Sum of totalAmount for all part orders inside an opportunity
 */
export function getTotalPartOrderValueFromOpportunity(partOrders: TenantPartOrder['partsOrders']): number {
  return partOrders.reduce((sum, order) => sum + order.totalAmount, 0);
}
