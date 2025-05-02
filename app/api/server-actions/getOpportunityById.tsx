import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { OpportunityResponse } from '../functions/opportunities'

// Define the type for your opportunity response

export const getOpportunityByIdAction = async (
  tenantId: string
): Promise<OpportunityResponse[]> => {
  try {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token

    if (!token) {
      throw new Error('No authentication token found')
    }

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL

    const response = await fetch(`${BASE_URL}/Opportunity/List/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 300,
        tags: [`opportunities-${tenantId}`],
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error('Error fetching opportunity by id:', error)
    throw error
  }
}
