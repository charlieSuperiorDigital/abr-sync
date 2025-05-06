/**
 * Types for opportunity logs and communication
 */

/**
 * Interface for creating an opportunity log
 */
export interface OpportunityLogCreateVM {
  opportunityId: string;
  type: string;
  summary: string;
}

/**
 * Interface for opportunity log user
 */
export interface OpportunityLogUser {
  id: string;
  name: string;
  profilePicture: string | null;
}

/**
 * Interface for opportunity log response from API when creating a log
 */
export interface CreateOpportunityLogApiResponse {
  id: string;
  opportunityId: string;
  opportunity: null | object; // The API returns null here, but could potentially return an object
  type: string;
  date: string;
  userId: string;
  user: null | object; // The API returns null here, but could potentially return an object
  summary: string;
}

/**
 * Interface for opportunity log response when fetching logs
 */
export interface OpportunityLog {
  id: string;
  opportunityId: string;
  type: string;
  date: string;
  user: OpportunityLogUser;
  summary: string;
}
