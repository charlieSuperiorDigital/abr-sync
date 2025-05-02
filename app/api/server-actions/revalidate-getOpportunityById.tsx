'use server'

import { revalidateTag } from 'next/cache'

export const revalidateOpportunitiesAction = async (
  tenantId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    revalidateTag(`opportunities-${tenantId}`)

    return {
      success: true,
      message: `Successfully revalidated opportunities for tenant ${tenantId}`,
    }
  } catch (error) {
    console.error('Error revalidating opportunities:', error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unknown error occurred during revalidation',
    }
  }
}
