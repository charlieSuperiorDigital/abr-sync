export enum UserRole {
  Admin = 'Admin',
  ShopOwner = 'ShopOwner',
  ShopManager = 'ShopManager',
  PartManager = 'PartManager',
  Estimator = 'Estimator',
  CSR = 'CSR',
  BodyTech = 'BodyTech',
  PaintTech = 'PaintTech',
  Technician = 'Technician'
}

export enum Language {
  English = 'English',
  Español = 'Español'
}

export enum ModuleAccess {
  All = 'All',
  Opportunities = 'Opportunities',
  Workfiles = 'Workfiles',
  Parts = 'Parts',
  Users = 'Users',
  Settings = 'Settings',
  Locations = 'Locations',
  VehicleOwners = 'Insurance & Vehicle Owners'
}

export enum CommunicationAccess {
  All = 'All',
  Insurances = 'Insurances',
  Vendors = 'Vendors',
  VehicleOwners = 'Vehicle Owners'
}

export enum NotificationType {
  SMS = 'SMS',
  Email = 'Email',
  Both = 'Both'
}

export enum NotificationCategory {
  All = 'All',
  TaskAssigned = 'TaskAssigned',
  TaskCompleted = 'TaskCompleted',
  OpportunityCreated = 'OpportunityCreated',
  WorkfileECD = 'WorkfileECD'
}

export enum Location {
  MainShop = 'Main Shop',
  PaintShop = 'Paint Shop',
  BodyShop = 'Body Shop',
  DetailCenter = 'Detail Center',
  PartsDepartment = 'Parts Department',
  ServiceCenter = 'Service Center',
  QCBay = 'QC Bay'
}

export interface User {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  password: string
  role: UserRole
  hourlyRate: number
  isActive: boolean
  preferredLanguage: Language
  moduleAccess: ModuleAccess[]
  communicationAccess: CommunicationAccess[]
  notificationType: NotificationType
  notificationCategories: NotificationCategory[]
  locations: Location[]
  createdAt: string
  updatedAt: string
  avatar: string
}

// Available locations in the system
export const AVAILABLE_LOCATIONS = Object.values(Location)

// Default user object for initialization
export const DEFAULT_USER = {
  id: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: UserRole.Technician,
  hourlyRate: 0,
  isActive: true,
  preferredLanguage: Language.English,
  moduleAccess: [],
  communicationAccess: [],
  notificationType: NotificationType.Email,
  notificationCategories: [],
  locations: [],
  createdAt: '',
  updatedAt: '',
  avatar: ''
} as const
