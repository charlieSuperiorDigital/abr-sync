export type UserRole = 
  | 'Estimator'
  | 'Painter'
  | 'BodyTech'
  | 'Technician'
  | 'Manager'
  | 'CSR'
  | 'Admin'

export type Language = 'English' | 'Español'

export type ModuleAccess = 
  | 'All'
  | 'Opportunities'
  | 'Workfiles'
  | 'Parts'
  | 'Insurance'
  | 'VehicleOwners'
  | 'Users'
  | 'Locations'
  | 'Settings'

export type CommunicationAccess = 
  | 'All'
  | 'Insurances'
  | 'Vendors'
  | 'VehicleOwners'

export type NotificationType = 'SMS' | 'Email' | 'Both'

export type NotificationCategory = 
  | 'All'
  | 'WorkfileECD'
  | 'TaskAssigned'
  | 'TaskCompleted'
  | 'OpportunityCreated'

// Available locations in the system
export const AVAILABLE_LOCATIONS = [
  'Main Shop',
  'Paint Shop',
  'Body Shop',
  'Detail Center',
  'Parts Department',
  'Service Center',
  'QC Bay'
] as const

export type Location = typeof AVAILABLE_LOCATIONS[number]

export interface User {
  id: string
  firstName: string;
  lastName: string;
  fullName: string
  email: string
  phoneNumber: string
  //password: string // Note: This should be hashed in the database
  passwordHash: string;
  isVerified: boolean;
  verificationCode: string | null;
  role: UserRole
  hourlyRate: number
  isActive: boolean
  preferredLanguage: Language

  tenantId: string;
  
  // Access Control
  moduleAccess: ModuleAccess[]
  communicationAccess: CommunicationAccess[]
  
  // Notification Preferences
  notificationType: NotificationType
  notificationCategories: NotificationCategory[]

  passwordResetValidity: string;
  tempPasswordResetCode: string;
  googleSSOId: string | null;
  facebookSSOId: string | null;
  appleSSOId: string | null;
  //roles: UserRole; // JSON string of roles array
  invitations: any[]; // Could be replaced with Invitation type if needed
  tenantRoles: any[]; // Could be replaced with TenantRole type if needed
  
  // Metadata
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  
  // Optional fields
  avatar?: string
  department?: string
  locations: Location[] 
  notes?: string
}

// Helper function to get full name
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

// Example of creating a new user
// export const createDefaultUser = (
//   id: string,
//   fullName: string,
//   email: string,
//   role: UserRole
// ): User => ({
//   id,
//   fullName,
//   email,
//   phoneNumber: '',
//   passwordHash: '', // Should be set through proper authentication flow
//   role,
//   hourlyRate: 0,
//   isActive: true,
//   preferredLanguage: 'English',
//   moduleAccess: [],
//   communicationAccess: [],
//   notificationType: 'Email',
//   notificationCategories: [],
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
//   locations: []
// })
