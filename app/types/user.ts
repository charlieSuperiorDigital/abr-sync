export enum UserRole {
  Admin = 'admin',
  User = 'user',
  SuperAdmin = 'superadmin',
  ShopOwner = 'shopowner',
  ShopManager = 'shopmanager',
  PartManager = 'partmanager',
  Estimator = 'estimator',
  CSR = 'csr',
  SalesRep = 'salesrep',
  BodyTech = 'bodytech',
  PaintTech = 'painttech'
}

export enum Language {
  English = 'English',
  Español = 'Español'
}

export enum ModuleAccess {
  All = 'All',
  Workfiles = 'Workfiles',
  Users = 'Users',
  Locations = 'Locations',
  Opportunities = 'Opportunities',
  Parts = 'Parts',
  Settings = 'Settings',
  InsuranceVehicleOwners = 'Insurance & Vehicle Owners'
}

export enum CommunicationAccess {
  All = 'All',
  Insurances = 'Insurances',
  Vendors = 'Vendors',
  VehicleOwners = 'Vehicle Owners'
}

export enum NotificationType {
  None = 0,
  SMS = 1,
  Email = 2,
  Both = 3
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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  verificationCode: string | null;
  isActive: boolean;
  preferredLanguage: string | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  passwordResetValidity: string;
  tempPasswordResetCode: string;
  googleSSOId: string | null;
  facebookSSOId: string | null;
  appleSSOId: string | null;
  roles: string; // JSON string of roles array
  invitations: any[]; // Could be replaced with Invitation type if needed
  tenantRoles: any[]; // Could be replaced with TenantRole type if needed

  fullName: string
  phoneNumber: string
  password: string
  role: UserRole
  hourlyRate: number
  modules: number
  communication: number
  notificationType: NotificationType
  notificationCategories: NotificationCategory[]
  locations: Location[]
  avatar: string
  lastLoginAt: string;
  profilePicture: string | null;
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
  role: UserRole.User,
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


// Helper function to get full name
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}
