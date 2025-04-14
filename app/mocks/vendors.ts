import { Vendor } from '../types/vendor';

export const vendorsMockData: Vendor[] = [
  {
    vendorId: 'V-001',
    name: 'AutoZone Commercial',
    representative: 'Michael Johnson',
    roCompleted: 24,
    roInProgress: 8,
    pendingReturns: 3,
    spentPerMonth: 12450.75,
    spentPerWeek: 3112.68,
    refundAmount: 1250.50,
    refundPartsCount: 5,
    totalAmount: 145789.25,
    lastCommunicationDate: '2025-03-28T14:30:00Z',
    summary: 'Primary supplier for Toyota and Honda parts. Offers same-day delivery for most items and 10% discount on bulk orders.',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'mjohnson@autozone.com'
    },
    hasUpdates: true
  },
  {
    vendorId: 'V-002',
    name: 'NAPA Auto Parts',
    representative: 'Sarah Williams',
    roCompleted: 18,
    roInProgress: 5,
    pendingReturns: 1,
    spentPerMonth: 9875.25,
    spentPerWeek: 2468.81,
    refundAmount: 750.25,
    refundPartsCount: 3,
    totalAmount: 98450.50,
    lastCommunicationDate: '2025-03-29T10:15:00Z',
    summary: 'Specialized in domestic vehicle parts. Provides extended warranty on all parts and free technical support.',
    contactInfo: {
      phone: '(555) 234-5678',
      email: 'swilliams@napa.com'
    },
    hasUpdates: false
  },
  {
    vendorId: 'V-003',
    name: 'O\'Reilly Auto Parts',
    representative: 'David Miller',
    roCompleted: 15,
    roInProgress: 6,
    pendingReturns: 2,
    spentPerMonth: 8750.50,
    spentPerWeek: 2187.63,
    refundAmount: 500.75,
    refundPartsCount: 2,
    totalAmount: 76890.25,
    lastCommunicationDate: '2025-03-27T09:45:00Z',
    summary: 'Good source for aftermarket parts. Offers competitive pricing and frequent promotions on common repair items.',
    contactInfo: {
      phone: '(555) 345-6789',
      email: 'dmiller@oreilly.com'
    },
    hasUpdates: true
  },
  {
    vendorId: 'V-004',
    name: 'Advance Auto Parts',
    representative: 'Jennifer Davis',
    roCompleted: 12,
    roInProgress: 4,
    pendingReturns: 0,
    spentPerMonth: 6500.25,
    spentPerWeek: 1625.06,
    refundAmount: 0,
    refundPartsCount: 0,
    totalAmount: 54320.75,
    lastCommunicationDate: '2025-03-30T11:20:00Z',
    summary: 'Reliable for European vehicle parts. Known for quality and authenticity of parts with detailed documentation.',
    contactInfo: {
      phone: '(555) 456-7890',
      email: 'jdavis@advanceauto.com'
    },
    hasUpdates: false
  },
  {
    vendorId: 'V-005',
    name: 'LKQ Corporation',
    representative: 'Robert Wilson',
    roCompleted: 30,
    roInProgress: 12,
    pendingReturns: 4,
    spentPerMonth: 18750.50,
    spentPerWeek: 4687.63,
    refundAmount: 2000.25,
    refundPartsCount: 8,
    totalAmount: 210450.75,
    lastCommunicationDate: '2025-03-26T15:40:00Z',
    summary: 'Primary source for recycled and aftermarket parts. Offers significant discounts on large orders and quick delivery.',
    contactInfo: {
      phone: '(555) 567-8901',
      email: 'rwilson@lkq.com'
    },
    hasUpdates: true
  },
  {
    vendorId: 'V-006',
    name: 'Genuine Parts Company',
    representative: 'Emily Thompson',
    roCompleted: 22,
    roInProgress: 7,
    pendingReturns: 2,
    spentPerMonth: 11250.75,
    spentPerWeek: 2812.69,
    refundAmount: 875.50,
    refundPartsCount: 4,
    totalAmount: 125680.25,
    lastCommunicationDate: '2025-03-25T13:10:00Z',
    summary: 'Specializes in OEM parts for multiple manufacturers. Known for reliability and comprehensive inventory.',
    contactInfo: {
      phone: '(555) 678-9012',
      email: 'ethompson@gpc.com'
    },
    hasUpdates: false
  },
  {
    vendorId: 'V-007',
    name: 'Dorman Products',
    representative: 'Thomas Brown',
    roCompleted: 10,
    roInProgress: 3,
    pendingReturns: 1,
    spentPerMonth: 5250.25,
    spentPerWeek: 1312.56,
    refundAmount: 325.75,
    refundPartsCount: 1,
    totalAmount: 42570.50,
    lastCommunicationDate: '2025-03-24T16:50:00Z',
    summary: 'Good for hard-to-find replacement parts. Provides detailed fitment information and technical specifications.',
    contactInfo: {
      phone: '(555) 789-0123',
      email: 'tbrown@dorman.com'
    },
    hasUpdates: true
  },
  {
    vendorId: 'V-008',
    name: 'Standard Motor Products',
    representative: 'Jessica Martinez',
    roCompleted: 8,
    roInProgress: 2,
    pendingReturns: 0,
    spentPerMonth: 4150.50,
    spentPerWeek: 1037.63,
    refundAmount: 0,
    refundPartsCount: 0,
    totalAmount: 36780.25,
    lastCommunicationDate: '2025-03-23T10:30:00Z',
    summary: 'Specializes in electrical and engine management components. Offers technical training and support.',
    contactInfo: {
      phone: '(555) 890-1234',
      email: 'jmartinez@smp.com'
    },
    hasUpdates: false
  },
  {
    vendorId: 'V-009',
    name: 'ACDelco',
    representative: 'Kevin Anderson',
    roCompleted: 16,
    roInProgress: 5,
    pendingReturns: 2,
    spentPerMonth: 9250.75,
    spentPerWeek: 2312.69,
    refundAmount: 625.50,
    refundPartsCount: 3,
    totalAmount: 87450.25,
    lastCommunicationDate: '2025-03-22T14:15:00Z',
    summary: 'Premium supplier for GM vehicles. Known for high-quality parts and comprehensive warranty coverage.',
    contactInfo: {
      phone: '(555) 901-2345',
      email: 'kanderson@acdelco.com'
    },
    hasUpdates: true
  },
  {
    vendorId: 'V-010',
    name: 'Motorcraft',
    representative: 'Lisa Taylor',
    roCompleted: 14,
    roInProgress: 4,
    pendingReturns: 1,
    spentPerMonth: 7850.25,
    spentPerWeek: 1962.56,
    refundAmount: 425.75,
    refundPartsCount: 2,
    totalAmount: 68920.50,
    lastCommunicationDate: '2025-03-21T09:20:00Z',
    summary: 'Ford\'s official parts brand. Provides exact OEM specifications and reliable performance for Ford vehicles.',
    contactInfo: {
      phone: '(555) 012-3456',
      email: 'ltaylor@motorcraft.com'
    },
    hasUpdates: false
  }
];
