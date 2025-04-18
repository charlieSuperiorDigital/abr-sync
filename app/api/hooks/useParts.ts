import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPartOrdersByTenantId, updatePartOrder, getPartsOnReturnStatus } from '../functions/parts'
import { PartsOrderSummary, TenantPartOrder, UpdatePartOrderRequest, Part } from '../../types/parts';

interface UseGetTenantPartOrdersOptions {
    tenantId: string
}

/**
 * Hook to fetch part orders for a specific tenant
 * @param options - Query options including tenantId and enabled flag
 * @returns Query result with part orders data
 */
export function useGetTenantPartOrders({ tenantId }: UseGetTenantPartOrdersOptions) {
    const { data, isLoading, error } = useQuery<TenantPartOrder[]>({
        queryKey: ['partOrders', 'tenant', tenantId],
        queryFn: async () => {
            try {
                if (!tenantId) {
                    console.log('No tenant ID provided to useGetTenantPartOrders')
                    throw new Error('No tenant ID provided')
                }
                return await getPartOrdersByTenantId({ tenantId })
            } catch (error) {
                console.error('Error in useGetTenantPartOrders hook:', error)
                throw error
            }
        },
        enabled: !!tenantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1, // Only retry once
        refetchOnWindowFocus: false // Don't refetch when window gains focus
    })

    // Filter orders based on different parts statuses
    const ordersWithPartsToBeOrdered = data?.filter(order =>
        order.partsOrders.some((po : PartsOrderSummary) => po.partsToOrderCount > 0)
    ) || []

    const ordersWithPartsToBeReceived = data?.filter(order =>
        order.partsOrders.some((po : PartsOrderSummary) => po.partsToReceiveCount > 0)
    ) || []

    const ordersWithPartsToBeReturned = data?.filter(order =>
        order.partsOrders.some((po : PartsOrderSummary) => po.partsToReturnCount > 0)
    ) || []

    const calculateOrderTotalParts = (order: TenantPartOrder) => {
        return order.partsOrders.reduce((total : number, po : PartsOrderSummary) =>
            total + (po.partsToOrderCount + po.partsToReceiveCount + po.partsToReturnCount),
            0);
    };

    const calculateOrderToOrderParts = (order: TenantPartOrder) => {
        return order.partsOrders.reduce((total : number, po : PartsOrderSummary) =>
            total + po.partsToOrderCount,
            0);
    };

    const calculateOrderToReceiveParts = (order: TenantPartOrder) => {
        return order.partsOrders.reduce((total : number, po : PartsOrderSummary) =>
            total + po.partsToReceiveCount,
            0);
    };

    const calculateOrderToReturnParts = (order: TenantPartOrder) => {
        return order.partsOrders.reduce((total : number, po : PartsOrderSummary) =>
            total + po.partsToReturnCount,
            0);
    };

    // Filter orders with core parts
    const ordersWithCoreParts = data?.filter(order => order.partsOrders.some((po : PartsOrderSummary) => po.hasCorePart)) || [];

    // Return categorized and raw data similar to other hooks
    return {
        ordersWithPartsToBeOrdered,
        ordersWithPartsToBeReceived,
        ordersWithPartsToBeReturned,
        calculateOrderTotalParts,
        calculateOrderToOrderParts,
        calculateOrderToReceiveParts,
        calculateOrderToReturnParts,
        ordersWithCoreParts,
        data,
        isLoading,
        error
    }
}

export function useUpdatePartOrder() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ partOrderId, data }: { partOrderId: string, data: UpdatePartOrderRequest }) => updatePartOrder(partOrderId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partOrders'] });
        }
    });
    return {
        updatePartOrder: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess
    };
}

export function usePartsOnReturnStatus() {
  const { data, isLoading, error } = useQuery<Part[]>({
    queryKey: ['partsOnReturnStatus'],
    queryFn: getPartsOnReturnStatus,
    staleTime: 5 * 60 * 1000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return {
    parts: data || [],
    isLoading,
    error,
  };
}
