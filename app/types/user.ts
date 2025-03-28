export type UserRole =
  | 'BodyTech'
  | 'PaintTech'
  | 'CSR'
  | 'Estimator'
  | 'PartManager'
  | 'ShopManager'
  | 'ShopOwner'
  | 'Technician'
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
  fullName: string
  email: string
  phoneNumber: string
  password: string // Note: This should be hashed in the database
  role: UserRole
  hourlyRate: number
  isActive: boolean
  preferredLanguage: Language

  // Access Control
  moduleAccess: ModuleAccess[]
  communicationAccess: CommunicationAccess[]

  // Notification Preferences
  notificationType: NotificationType
  notificationCategories: NotificationCategory[]

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

// Example of creating a new user
export const createDefaultUser = (
  id: string,
  fullName: string,
  email: string,
  role: UserRole
): User => ({
  id,
  fullName,
  email,
  phoneNumber: '',
  password: '', // Should be set through proper authentication flow
  role,
  hourlyRate: 0,
  isActive: true,
  preferredLanguage: 'English',
  moduleAccess: [],
  communicationAccess: [],
  notificationType: 'Email',
  notificationCategories: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  locations: []
})
