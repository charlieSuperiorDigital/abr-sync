// import { User, UserRole, ModuleAccess, CommunicationAccess, NotificationCategory, AVAILABLE_LOCATIONS } from '../types/user'

// // Helper function to generate consistent IDs
// const generateId = (num: number) => num.toString().padStart(6, '0')

// export const mockUsers: User[] = [
//   // Shop Owners
//   {
//     id: generateId(1),
//     fullName: 'John Smith',
//     email: 'john.smith@autobody.com',
//     phoneNumber: '555-0101',
//     password: 'hashed_password',
//     role: 'ShopOwner',
//     hourlyRate: 0,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['All'],
//     communicationAccess: ['All'],
//     notificationType: 'Both',
//     notificationCategories: ['All'],
//     createdAt: '2024-01-01T08:00:00.000Z',
//     updatedAt: '2025-03-26T14:30:00.000Z',
//     lastLoginAt: '2025-03-27T08:15:00.000Z',
//     avatar: 'https://ui-avatars.com/api/?name=John+Smith',
//     department: 'Management',
//     locations: ['Main Shop', 'Body Shop', 'Paint Shop']
//   },
//   {
//     id: generateId(2),
//     fullName: 'Richard Williams',
//     email: 'richard.w@autobody.com',
//     phoneNumber: '555-0102',
//     password: 'hashed_password',
//     role: 'ShopOwner',
//     hourlyRate: 0,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['All'],
//     communicationAccess: ['All'],
//     notificationType: 'Both',
//     notificationCategories: ['All'],
//     createdAt: '2024-01-02T08:00:00.000Z',
//     updatedAt: '2025-03-26T15:30:00.000Z',
//     lastLoginAt: '2025-03-27T09:15:00.000Z',
//     department: 'Management',
//     locations: ['Main Shop', 'Service Center']
//   },

//   // Paint Techs
//   {
//     id: generateId(3),
//     fullName: 'David Chen',
//     email: 'david.c@autobody.com',
//     phoneNumber: '555-0103',
//     password: 'hashed_password',
//     role: 'PaintTech',
//     hourlyRate: 32.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Workfiles'],
//     communicationAccess: [],
//     notificationType: 'SMS',
//     notificationCategories: ['TaskAssigned', 'TaskCompleted'],
//     createdAt: '2024-03-01T10:00:00.000Z',
//     updatedAt: '2025-03-24T15:20:00.000Z',
//     department: 'Paint',
//     locations: ['Paint Shop']
//   },
//   {
//     id: generateId(4),
//     fullName: 'Alex Turner',
//     email: 'alex.t@autobody.com',
//     phoneNumber: '555-0104',
//     password: 'hashed_password',
//     role: 'PaintTech',
//     hourlyRate: 32.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Workfiles'],
//     communicationAccess: [],
//     notificationType: 'SMS',
//     notificationCategories: ['TaskAssigned'],
//     createdAt: '2024-03-02T10:00:00.000Z',
//     updatedAt: '2025-03-24T16:20:00.000Z',
//     department: 'Paint',
//     locations: ['Paint Shop']
//   },
//   {
//     id: generateId(5),
//     fullName: 'Miguel Santos',
//     email: 'miguel.s@autobody.com',
//     phoneNumber: '555-0105',
//     password: 'hashed_password',
//     role: 'PaintTech',
//     hourlyRate: 32.00,
//     isActive: true,
//     preferredLanguage: 'Español',
//     moduleAccess: ['Workfiles'],
//     communicationAccess: [],
//     notificationType: 'SMS',
//     notificationCategories: ['TaskAssigned'],
//     createdAt: '2024-03-03T10:00:00.000Z',
//     updatedAt: '2025-03-24T17:20:00.000Z',
//     department: 'Paint',
//     locations: ['Paint Shop']
//   },

//   // CSRs
//   {
//     id: generateId(6),
//     fullName: 'Sarah Johnson',
//     email: 'sarah.j@autobody.com',
//     phoneNumber: '555-0106',
//     password: 'hashed_password',
//     role: 'CSR',
//     hourlyRate: 28.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Opportunities', 'VehicleOwners'],
//     communicationAccess: ['VehicleOwners'],
//     notificationType: 'Both',
//     notificationCategories: ['OpportunityCreated'],
//     createdAt: '2024-03-10T11:00:00.000Z',
//     updatedAt: '2025-03-23T14:10:00.000Z',
//     department: 'Customer Service',
//     locations: ['Main Shop']
//   },
//   {
//     id: generateId(7),
//     fullName: 'Emma Davis',
//     email: 'emma.d@autobody.com',
//     phoneNumber: '555-0107',
//     password: 'hashed_password',
//     role: 'CSR',
//     hourlyRate: 28.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Opportunities', 'VehicleOwners'],
//     communicationAccess: ['VehicleOwners'],
//     notificationType: 'Email',
//     notificationCategories: ['OpportunityCreated'],
//     createdAt: '2024-03-11T11:00:00.000Z',
//     updatedAt: '2025-03-23T15:10:00.000Z',
//     department: 'Customer Service',
//     locations: ['Main Shop']
//   },
//   {
//     id: generateId(8),
//     fullName: 'Isabella Martinez',
//     email: 'isabella.m@autobody.com',
//     phoneNumber: '555-0108',
//     password: 'hashed_password',
//     role: 'CSR',
//     hourlyRate: 28.00,
//     isActive: true,
//     preferredLanguage: 'Español',
//     moduleAccess: ['Opportunities', 'VehicleOwners'],
//     communicationAccess: ['VehicleOwners'],
//     notificationType: 'Both',
//     notificationCategories: ['OpportunityCreated'],
//     createdAt: '2024-03-12T11:00:00.000Z',
//     updatedAt: '2025-03-23T16:10:00.000Z',
//     department: 'Customer Service',
//     locations: ['Main Shop']
//   },

//   // Estimators
//   {
//     id: generateId(9),
//     fullName: 'Maria Rodriguez',
//     email: 'maria.r@autobody.com',
//     phoneNumber: '555-0109',
//     password: 'hashed_password',
//     role: 'Estimator',
//     hourlyRate: 35.00,
//     isActive: true,
//     preferredLanguage: 'Español',
//     moduleAccess: ['Opportunities', 'Workfiles', 'Parts'],
//     communicationAccess: ['Insurances', 'VehicleOwners'],
//     notificationType: 'Email',
//     notificationCategories: ['WorkfileECD', 'OpportunityCreated'],
//     createdAt: '2024-02-15T09:00:00.000Z',
//     updatedAt: '2025-03-25T16:45:00.000Z',
//     department: 'Estimating',
//     locations: ['Main Shop']
//   },
//   {
//     id: generateId(10),
//     fullName: 'William Thompson',
//     email: 'william.t@autobody.com',
//     phoneNumber: '555-0110',
//     password: 'hashed_password',
//     role: 'Estimator',
//     hourlyRate: 35.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Opportunities', 'Workfiles', 'Parts'],
//     communicationAccess: ['Insurances', 'VehicleOwners'],
//     notificationType: 'Both',
//     notificationCategories: ['WorkfileECD'],
//     createdAt: '2024-02-16T09:00:00.000Z',
//     updatedAt: '2025-03-25T17:45:00.000Z',
//     department: 'Estimating',
//     locations: ['Main Shop']
//   },

//   // Part Managers
//   {
//     id: generateId(11),
//     fullName: 'Michael Brown',
//     email: 'michael.b@autobody.com',
//     phoneNumber: '555-0111',
//     password: 'hashed_password',
//     role: 'PartManager',
//     hourlyRate: 30.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Parts', 'Workfiles'],
//     communicationAccess: ['Vendors'],
//     notificationType: 'Email',
//     notificationCategories: ['TaskAssigned'],
//     createdAt: '2024-03-15T12:00:00.000Z',
//     updatedAt: '2025-03-22T13:05:00.000Z',
//     department: 'Parts',
//     locations: ['Parts Department']
//   },
//   {
//     id: generateId(12),
//     fullName: 'Daniel Lee',
//     email: 'daniel.l@autobody.com',
//     phoneNumber: '555-0112',
//     password: 'hashed_password',
//     role: 'PartManager',
//     hourlyRate: 30.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Parts', 'Workfiles'],
//     communicationAccess: ['Vendors'],
//     notificationType: 'Both',
//     notificationCategories: ['TaskAssigned'],
//     createdAt: '2024-03-16T12:00:00.000Z',
//     updatedAt: '2025-03-22T14:05:00.000Z',
//     department: 'Parts',
//     locations: ['Parts Department']
//   },

//   // Shop Managers
//   {
//     id: generateId(13),
//     fullName: 'Emily Wilson',
//     email: 'emily.w@autobody.com',
//     phoneNumber: '555-0113',
//     password: 'hashed_password',
//     role: 'ShopManager',
//     hourlyRate: 40.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['All'],
//     communicationAccess: ['All'],
//     notificationType: 'Both',
//     notificationCategories: ['All'],
//     createdAt: '2024-03-20T13:00:00.000Z',
//     updatedAt: '2025-03-21T12:00:00.000Z',
//     department: 'Management',
//     locations: ['Main Shop', 'Body Shop']
//   },
//   {
//     id: generateId(14),
//     fullName: 'Robert Garcia',
//     email: 'robert.g@autobody.com',
//     phoneNumber: '555-0114',
//     password: 'hashed_password',
//     role: 'ShopManager',
//     hourlyRate: 40.00,
//     isActive: true,
//     preferredLanguage: 'Español',
//     moduleAccess: ['All'],
//     communicationAccess: ['All'],
//     notificationType: 'Both',
//     notificationCategories: ['All'],
//     createdAt: '2024-03-21T13:00:00.000Z',
//     updatedAt: '2025-03-21T13:00:00.000Z',
//     department: 'Management',
//     locations: ['Paint Shop', 'Service Center']
//   },

//   // Body Techs
//   {
//     id: generateId(15),
//     fullName: 'James Wilson',
//     email: 'james.w@autobody.com',
//     phoneNumber: '555-0115',
//     password: 'hashed_password',
//     role: 'BodyTech',
//     hourlyRate: 32.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Workfiles'],
//     communicationAccess: [],
//     notificationType: 'SMS',
//     notificationCategories: ['TaskAssigned', 'TaskCompleted'],
//     createdAt: '2024-03-25T14:00:00.000Z',
//     updatedAt: '2025-03-20T11:00:00.000Z',
//     department: 'Body Shop',
//     locations: ['Body Shop']
//   },
//   {
//     id: generateId(16),
//     fullName: 'Thomas Anderson',
//     email: 'thomas.a@autobody.com',
//     phoneNumber: '555-0116',
//     password: 'hashed_password',
//     role: 'BodyTech',
//     hourlyRate: 32.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Workfiles'],
//     communicationAccess: [],
//     notificationType: 'SMS',
//     notificationCategories: ['TaskAssigned'],
//     createdAt: '2024-03-26T14:00:00.000Z',
//     updatedAt: '2025-03-20T12:00:00.000Z',
//     department: 'Body Shop',
//     locations: ['Body Shop']
//   },
//   {
//     id: generateId(17),
//     fullName: 'Carlos Ruiz',
//     email: 'carlos.r@autobody.com',
//     phoneNumber: '555-0117',
//     password: 'hashed_password',
//     role: 'BodyTech',
//     hourlyRate: 32.00,
//     isActive: true,
//     preferredLanguage: 'Español',
//     moduleAccess: ['Workfiles'],
//     communicationAccess: [],
//     notificationType: 'SMS',
//     notificationCategories: ['TaskAssigned'],
//     createdAt: '2024-03-27T14:00:00.000Z',
//     updatedAt: '2025-03-20T13:00:00.000Z',
//     department: 'Body Shop',
//     locations: ['Body Shop']
//   },

//   // Technicians
//   {
//     id: generateId(18),
//     fullName: 'Robert Taylor',
//     email: 'robert.t@autobody.com',
//     phoneNumber: '555-0118',
//     password: 'hashed_password',
//     role: 'Technician',
//     hourlyRate: 30.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Workfiles'],
//     communicationAccess: [],
//     notificationType: 'SMS',
//     notificationCategories: ['TaskAssigned', 'TaskCompleted'],
//     createdAt: '2024-03-30T15:00:00.000Z',
//     updatedAt: '2025-03-19T10:00:00.000Z',
//     department: 'Service',
//     locations: ['Service Center']
//   },
//   {
//     id: generateId(19),
//     fullName: 'Steven White',
//     email: 'steven.w@autobody.com',
//     phoneNumber: '555-0119',
//     password: 'hashed_password',
//     role: 'Technician',
//     hourlyRate: 30.00,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['Workfiles'],
//     communicationAccess: [],
//     notificationType: 'SMS',
//     notificationCategories: ['TaskAssigned'],
//     createdAt: '2024-03-31T15:00:00.000Z',
//     updatedAt: '2025-03-19T11:00:00.000Z',
//     department: 'Service',
//     locations: ['Service Center']
//   },

//   // Admins
//   {
//     id: generateId(20),
//     fullName: 'Lisa Anderson',
//     email: 'lisa.a@autobody.com',
//     phoneNumber: '555-0120',
//     password: 'hashed_password',
//     role: 'Admin',
//     hourlyRate: 0,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['All'],
//     communicationAccess: ['All'],
//     notificationType: 'Both',
//     notificationCategories: ['All'],
//     createdAt: '2024-04-01T16:00:00.000Z',
//     updatedAt: '2025-03-18T09:00:00.000Z',
//     department: 'IT',
//     locations: ['Main Shop'],
//     notes: 'System administrator'
//   },
//   {
//     id: generateId(21),
//     fullName: 'David Kim',
//     email: 'david.k@autobody.com',
//     phoneNumber: '555-0121',
//     password: 'hashed_password',
//     role: 'Admin',
//     hourlyRate: 0,
//     isActive: true,
//     preferredLanguage: 'English',
//     moduleAccess: ['All'],
//     communicationAccess: ['All'],
//     notificationType: 'Both',
//     notificationCategories: ['All'],
//     createdAt: '2024-04-02T16:00:00.000Z',
//     updatedAt: '2025-03-18T10:00:00.000Z',
//     department: 'IT',
//     locations: ['Main Shop'],
//     notes: 'Network administrator'
//   }
// ]

// // Helper function to find a user by ID
// export const findUserById = (id: string): User | undefined => {
//   return mockUsers.find(user => user.id === id)
// }

// // Helper function to find users by role
// export const findUsersByRole = (role: UserRole): User[] => {
//   return mockUsers.filter(user => user.role === role)
// }

// // Helper function to find active users
// export const findActiveUsers = (): User[] => {
//   return mockUsers.filter(user => user.isActive)
// }
