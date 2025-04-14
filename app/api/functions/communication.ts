import apiService from '@/app/utils/apiService'

/**
 * Interface for creating an opportunity log
 */
export interface OpportunityLogCreateVM {
  opportunityId: string;
  type: string;
  summary: string;
}

/**
 * Interface for opportunity log response
 */
export interface OpportunityLog {
  id: string;
  opportunityId: string;
  type: string;
  date: string;
  user: string;
  summary: string;
}

/**
 * Creates a new opportunity log
 * @param logData - The log data to create
 * @returns The created log
 */
export async function createOpportunityLog(logData: OpportunityLogCreateVM) {
  try {
    const response = await apiService.post<OpportunityLog>('/api/OpportunityLog', logData);
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Error creating opportunity log:', error);
    return {
      success: false,
      data: null,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Gets all logs for a specific opportunity
 * @param opportunityId - The ID of the opportunity
 * @returns Array of opportunity logs
 */
export async function getOpportunityLogs(opportunityId: string) {
  try {
    const response = await apiService.get<OpportunityLog[]>(`/api/OpportunityLog/${opportunityId}/logs`);
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Error getting opportunity logs:', error);
    return {
      success: false,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Gets the last communication log for a specific opportunity
 * @param opportunityId - The ID of the opportunity
 * @returns The last communication log
 */
export async function getLastOpportunityLog(opportunityId: string) {
  try {
    const response = await apiService.get<OpportunityLog>(`/api/OpportunityLog/${opportunityId}/last-communication`);
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Error getting last opportunity log:', error);
    return {
      success: false,
      data: null,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}