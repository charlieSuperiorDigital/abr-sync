import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllPartsFromTenant, getPartOrdersByTenantId, updatePartOrder, getPartsByOpportunityId } from '../functions/parts'
import { PartsOrderSummary, TenantPartOrder, UpdatePartOrderRequest, PartWithFullDetails } from '../../types/parts';

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
        order.partsOrders.some((po: PartsOrderSummary) => po.partsToOrderCount > 0)
    ) || []

    const ordersWithPartsToBeReceived = data?.filter(order =>
        order.partsOrders.some((po: PartsOrderSummary) => po.partsToReceiveCount > 0)
    ) || []

    const ordersWithPartsToBeReturned = data?.filter(order =>
        order.partsOrders.some((po: PartsOrderSummary) => po.partsToReturnCount > 0)
    ) || []

    const calculateOrderTotalParts = (order: TenantPartOrder) => {
        return order.partsOrders.reduce((total: number, po: PartsOrderSummary) =>
            total + (po.partsToOrderCount + po.partsToReceiveCount + po.partsToReturnCount),
            0);
    };

    const calculateOrderToOrderParts = (order: TenantPartOrder) => {
        return order.partsOrders.reduce((total: number, po: PartsOrderSummary) =>
            total + po.partsToOrderCount,
            0);
    };

    const calculateOrderToReceiveParts = (order: TenantPartOrder) => {
        return order.partsOrders.reduce((total: number, po: PartsOrderSummary) =>
            total + po.partsToReceiveCount,
            0);
    };

    const calculateOrderToReturnParts = (order: TenantPartOrder) => {
        return order.partsOrders.reduce((total: number, po: PartsOrderSummary) =>
            total + po.partsToReturnCount,
            0);
    };

    // Filter orders with core parts
    const ordersWithCoreParts = data?.filter(order => order.partsOrders.some((po: PartsOrderSummary) => po.hasCorePart)) || [];

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

export function useGetAllPartsFromTenant(tenantId: string) {
    const { data, isLoading, error } = useQuery<PartWithFullDetails[]>({
        queryKey: ['partsOnReturnStatus', tenantId],
        queryFn: () => getAllPartsFromTenant(tenantId),
        staleTime: 5 * 60 * 1000,
        retry: 0,
        refetchOnWindowFocus: false,
    });

    const filterPartsByOpportunityId = (opportunityId: string) => {
        return data?.filter(part => part.opportunity.id === opportunityId) || [];
    }

    const groupedPartsByOpportunity = () => {
        const grouped: Array<{
            opportunity: PartWithFullDetails['opportunity'];
            partsDetails: PartWithFullDetails['partsDetails'];
        }> = [];
        const seenOpportunities = new Map<string, number>();

        if (!data) return grouped;

        for (const part of data) {
            const oppId = part.opportunity.id;
            if (seenOpportunities.has(oppId)) {
                // Add this part's partsDetails to the existing group
                const idx = seenOpportunities.get(oppId)!;
                grouped[idx].partsDetails = grouped[idx].partsDetails.concat(part.partsDetails);
            } else {
                // First time seeing this opportunity, create a father object
                grouped.push({
                    opportunity: part.opportunity,
                    partsDetails: [...part.partsDetails],
                });
                seenOpportunities.set(oppId, grouped.length - 1);
            }
        }
       
        return grouped;
    };

    function debugLog() {
        console.log('[debugLog]', groupedPartsByOpportunity);
    }

    return {
        parts: data || [],
        filterPartsByOpportunityId,
        groupedPartsByOpportunity,
        isLoading,
        debugLog,
        error,
    };
}

/**
 * Hook to fetch parts grouped by opportunity for a specific opportunity ID
 * @param opportunityId - The opportunity ID
 * @returns Query result with parts grouped by opportunity (array)
 */
export function useGetPartsByOpportunityId(opportunityId: string) {
    const { data, isLoading, error } = useQuery<PartWithFullDetails[]>({
        queryKey: ['partsByOpportunity', opportunityId],
        queryFn: () => getPartsByOpportunityId(opportunityId),
        enabled: !!opportunityId,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    function returnPartsWithOpportunityId(opportunityId: string): PartWithFullDetails[] {
        return data?.filter(part => part.opportunity.id === opportunityId) || [];
    }

    return {
        parts: data || [],
        returnPartsWithOpportunityId,
        isLoading,
        error,
    };
}
