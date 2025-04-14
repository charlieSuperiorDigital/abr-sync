// Mock data for parts management tables

// Common vehicle images
const vehicleImages = {
  toyota: 'https://picsum.photos/seed/toyota/200',
  honda: 'https://picsum.photos/seed/honda/200',
  ford: 'https://picsum.photos/seed/ford/200',
  chevrolet: 'https://picsum.photos/seed/chevrolet/200',
  nissan: 'https://picsum.photos/seed/nissan/200',
  bmw: 'https://picsum.photos/seed/bmw/200',
  mercedes: 'https://picsum.photos/seed/mercedes/200',
  audi: 'https://picsum.photos/seed/audi/200',
  volkswagen: 'https://picsum.photos/seed/volkswagen/200',
  hyundai: 'https://picsum.photos/seed/hyundai/200',
}

type Priority = 'high' | 'medium' | 'low'
type ApprovalStatus = 'pending' | 'approved' | 'rejected'
type RefundStatus = 'pending' | 'approved' | 'rejected' | 'completed'

// To Order tab data
export const toOrderMockData = [
  {
    orderId: 'ORD-001',
    roNumber: 'RO-2025-0127',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      imageUrl: vehicleImages.toyota,
    },
    partsCount: 3,
    assignedTech: 'John Smith',
    status: 'PENDING_APPROVAL',
    lastUpdated: '2025-03-26T15:30:00Z',
    neededByDate: '2025-04-02T00:00:00Z',
    vendor: 'AutoZone Commercial',
    priority: 'high' as Priority,
  },
  {
    orderId: 'ORD-002',
    roNumber: 'RO-2025-0128',
    vehicle: {
      make: 'Honda',
      model: 'Civic',
      year: 2024,
      imageUrl: vehicleImages.honda,
    },
    partsCount: 5,
    assignedTech: 'Maria Garcia',
    status: 'APPROVED',
    lastUpdated: '2025-03-27T09:15:00Z',
    neededByDate: '2025-04-05T00:00:00Z',
    vendor: 'NAPA Auto Parts',
    priority: 'medium' as Priority,
  },
]

// To Receive tab data
export const toReceiveMockData = [
  {
    orderId: 'ORD-003',
    roNumber: 'RO-2025-0129',
    vehicle: {
      make: 'Ford',
      model: 'F-150',
      year: 2024,
      imageUrl: vehicleImages.ford,
    },
    partsCount: 2,
    assignedTech: 'Robert Johnson',
    status: 'IN_TRANSIT',
    lastUpdated: '2025-03-25T14:20:00Z',
    expectedDeliveryDate: '2025-03-29T00:00:00Z',
    trackingNumber: '1Z999AA1234567890',
    partsManager: 'David Wilson',
  },
  {
    orderId: 'ORD-004',
    roNumber: 'RO-2025-0130',
    vehicle: {
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2023,
      imageUrl: vehicleImages.chevrolet,
    },
    partsCount: 4,
    assignedTech: 'Sarah Lee',
    status: 'SHIPPED',
    lastUpdated: '2025-03-26T16:45:00Z',
    expectedDeliveryDate: '2025-03-30T00:00:00Z',
    trackingNumber: '1Z999AA1234567891',
    partsManager: 'David Wilson',
  },
]

// Invoices tab data
export const invoicesMockData = [
  {
    invoiceId: 'INV-001',
    roNumber: 'RO-2025-0131',
    vehicle: {
      make: 'Toyota',
      model: 'RAV4',
      year: 2024,
      imageUrl: vehicleImages.toyota,
    },
    partsCount: 6,
    assignedTech: 'Michael Brown',
    status: 'PENDING_PAYMENT',
    lastUpdated: '2025-03-24T11:30:00Z',
    invoiceNumber: 'INV2025-0456',
    amount: 1250.75,
    approvalStatus: 'pending' as ApprovalStatus,
  },
  {
    invoiceId: 'INV-002',
    roNumber: 'RO-2025-0132',
    vehicle: {
      make: 'Honda',
      model: 'CR-V',
      year: 2023,
      imageUrl: vehicleImages.honda,
    },
    partsCount: 3,
    assignedTech: 'Emily Davis',
    status: 'APPROVED',
    lastUpdated: '2025-03-25T13:45:00Z',
    invoiceNumber: 'INV2025-0457',
    amount: 875.50,
    approvalStatus: 'approved' as ApprovalStatus,
  },
]

// Received tab data
export const receivedMockData = [
  {
    receivedId: 'RCV-001',
    roNumber: 'RO-2025-0133',
    vehicle: {
      make: 'Ford',
      model: 'Explorer',
      year: 2024,
      imageUrl: vehicleImages.ford,
    },
    partsCount: 4,
    assignedTech: 'James Wilson',
    status: 'RECEIVED',
    lastUpdated: '2025-03-23T10:15:00Z',
    receivedDate: '2025-03-23T10:15:00Z',
    receivedBy: 'Alex Thompson',
    vendor: 'O\'Reilly Auto Parts',
  },
  {
    receivedId: 'RCV-002',
    roNumber: 'RO-2025-0134',
    vehicle: {
      make: 'Chevrolet',
      model: 'Equinox',
      year: 2023,
      imageUrl: vehicleImages.chevrolet,
    },
    partsCount: 2,
    assignedTech: 'Lisa Anderson',
    status: 'RECEIVED',
    lastUpdated: '2025-03-24T14:30:00Z',
    receivedDate: '2025-03-24T14:30:00Z',
    receivedBy: 'Alex Thompson',
    vendor: 'AutoZone Commercial',
  },
]

// Backordered tab data
export const backorderedMockData = [
  {
    backorderId: 'BO-001',
    roNumber: 'RO-2025-0135',
    vehicle: {
      make: 'Toyota',
      model: 'Highlander',
      year: 2024,
      imageUrl: vehicleImages.toyota,
    },
    partsCount: 1,
    assignedTech: 'Kevin Martinez',
    status: 'BACKORDERED',
    lastUpdated: '2025-03-22T09:45:00Z',
    backorderEta: '2025-04-15T00:00:00Z',
    vendorContact: 'John Doe (555-0123)',
  },
  {
    backorderId: 'BO-002',
    roNumber: 'RO-2025-0136',
    vehicle: {
      make: 'Honda',
      model: 'Pilot',
      year: 2023,
      imageUrl: vehicleImages.honda,
    },
    partsCount: 3,
    assignedTech: 'Rachel White',
    status: 'BACKORDERED',
    lastUpdated: '2025-03-23T11:20:00Z',
    backorderEta: '2025-04-10T00:00:00Z',
    vendorContact: 'Jane Smith (555-0124)',
  },
]

// Returns tab data
export const returnsMockData = [
  {
    returnId: 'RET-001',
    roNumber: 'RO-2025-0137',
    vehicle: {
      make: 'Ford',
      model: 'Edge',
      year: 2024,
      imageUrl: vehicleImages.ford,
    },
    partsCount: 2,
    assignedTech: 'Daniel Taylor',
    status: 'RETURN_PENDING',
    lastUpdated: '2025-03-21T15:30:00Z',
    returnReason: 'Wrong Part Received',
    rmaNumber: 'RMA2025-789',
    refundStatus: 'pending' as RefundStatus,
    receivedDate: '2025-03-18T10:30:00Z',
    pickedUpDate: '2025-03-19T14:45:00Z',
    returnedDate: '2025-03-20T09:15:00Z',
    refundAmount: 245.75,
    vendor: 'AutoZone Commercial',
  },
  {
    returnId: 'RET-002',
    roNumber: 'RO-2025-0138',
    vehicle: {
      make: 'Chevrolet',
      model: 'Traverse',
      year: 2023,
      imageUrl: vehicleImages.chevrolet,
    },
    partsCount: 1,
    assignedTech: 'Amanda Clark',
    status: 'RETURN_APPROVED',
    lastUpdated: '2025-03-22T13:15:00Z',
    returnReason: 'Defective Part',
    rmaNumber: 'RMA2025-790',
    refundStatus: 'approved' as RefundStatus,
    receivedDate: '2025-03-20T11:20:00Z',
    pickedUpDate: '2025-03-21T16:30:00Z',
    returnedDate: '2025-03-22T10:45:00Z',
    refundAmount: 189.99,
    vendor: 'NAPA Auto Parts',
  },
]

// Cores tab data
export const coresMockData = [
  {
    coreId: 'CORE-001',
    roNumber: 'RO-2025-0139',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      imageUrl: vehicleImages.toyota,
    },
    description: 'Engine Control Module - Core Return Required',
    price: 350.75,
    updates: 'NEW',
    lastUpdated: '2025-03-29T10:15:00Z',
  },
  {
    coreId: 'CORE-002',
    roNumber: 'RO-2025-0140',
    vehicle: {
      make: 'Honda',
      model: 'Accord',
      year: 2024,
      imageUrl: vehicleImages.honda,
    },
    description: 'Transmission Assembly - Core Return Required',
    price: 875.50,
    updates: 'PENDING',
    lastUpdated: '2025-03-28T14:30:00Z',
  },
  {
    coreId: 'CORE-003',
    roNumber: 'RO-2025-0141',
    vehicle: {
      make: 'Ford',
      model: 'F-150',
      year: 2022,
      imageUrl: vehicleImages.ford,
    },
    description: 'Power Steering Pump - Core Return Required',
    price: 225.25,
    updates: 'URGENT',
    lastUpdated: '2025-03-27T09:45:00Z',
  },
  {
    coreId: 'CORE-004',
    roNumber: 'RO-2025-0142',
    vehicle: {
      make: 'Chevrolet',
      model: 'Silverado',
      year: 2023,
      imageUrl: vehicleImages.chevrolet,
    },
    description: 'Alternator - Core Return Required',
    price: 175.00,
    updates: 'PROCESSED',
    lastUpdated: '2025-03-26T16:20:00Z',
  },
  {
    coreId: 'CORE-005',
    roNumber: 'RO-2025-0143',
    vehicle: {
      make: 'Nissan',
      model: 'Altima',
      year: 2024,
      imageUrl: vehicleImages.nissan,
    },
    description: 'A/C Compressor - Core Return Required',
    price: 295.50,
    updates: 'NEW',
    lastUpdated: '2025-03-30T11:10:00Z',
  }
]

// Vendor details for expandable rows in To Order tab
export interface VendorDetail {
  vendorDetailId: string;
  name: string;
  representative: string;
  toOrder: number;
  toReceive: number;
  toReturn: number;
  total: number;
  totalAmount: number;
  lastCommunicationDate: string;
  summary: string;
  contactInfo: {
    phone: string;
    email: string;
  };
}

export const vendorDetailsMockData: VendorDetail[] = [
  {
    vendorDetailId: 'VD-001',
    name: 'AutoZone Commercial',
    representative: 'Michael Johnson',
    toOrder: 3,
    toReceive: 2,
    toReturn: 1,
    total: 6,
    totalAmount: 1250.75,
    lastCommunicationDate: '2025-03-28T14:30:00Z',
    summary: 'Primary supplier for Toyota and Honda parts. Offers same-day delivery for most items.',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'mjohnson@autozone.com'
    }
  },
  {
    vendorDetailId: 'VD-002',
    name: 'NAPA Auto Parts',
    representative: 'Sarah Williams',
    toOrder: 5,
    toReceive: 3,
    toReturn: 0,
    total: 8,
    totalAmount: 975.50,
    lastCommunicationDate: '2025-03-29T10:15:00Z',
    summary: 'Specialized in domestic vehicle parts. Provides extended warranty on all parts.',
    contactInfo: {
      phone: '(555) 234-5678',
      email: 'swilliams@napa.com'
    }
  },
  {
    vendorDetailId: 'VD-003',
    name: 'O\'Reilly Auto Parts',
    representative: 'David Miller',
    toOrder: 2,
    toReceive: 4,
    toReturn: 1,
    total: 7,
    totalAmount: 850.25,
    lastCommunicationDate: '2025-03-27T09:45:00Z',
    summary: 'Good source for aftermarket parts. Offers competitive pricing on common repair items.',
    contactInfo: {
      phone: '(555) 345-6789',
      email: 'dmiller@oreilly.com'
    }
  }
];
