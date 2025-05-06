import apiService from '@/app/utils/apiService'
import { 
  OpportunityLogCreateVM, 
  CreateOpportunityLogApiResponse, 
  OpportunityLog 
} from '@/app/types/communication-logs'

/**
 * Creates a new opportunity log
 * @param logData - The log data to create
 * @returns The created log
 */
export async function createOpportunityLog(logData: OpportunityLogCreateVM): Promise<CreateOpportunityLogApiResponse> {
  try {
    const response = await apiService.post<CreateOpportunityLogApiResponse>('/api/OpportunityLog', logData);
    return response.data;
  } catch (error) {
    console.error('Error creating opportunity log:', error);
    throw error;
  }
}

/**
 * Gets all logs for a specific opportunity
 * @param opportunityId - The ID of the opportunity
 * @returns Array of opportunity logs
 */
export async function getOpportunityLogs(opportunityId: string): Promise<OpportunityLog[]> {
  try {
    const response = await apiService.get<OpportunityLog[]>(`/api/OpportunityLog/${opportunityId}/logs`);
    return response.data;
  } catch (error) {
    console.error('Error getting opportunity logs:', error);
    throw error;
  }
}

/**
 * Gets the last communication log for a specific opportunity
 * @param opportunityId - The ID of the opportunity
 * @returns The last communication log
 */
export async function getLastOpportunityLog(opportunityId: string): Promise<OpportunityLog | null> {
  try {
    const response = await apiService.get<OpportunityLog>(`/api/OpportunityLog/${opportunityId}/last-communication`);
    return response.data;
  } catch (error) {
    console.error('Error getting last opportunity log:', error);
    throw error;
  }
}