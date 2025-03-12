export interface Vehicle {
  year: number
  make: string
  model: string
  imageUrl: string
}

export interface User {
  id: string
  name: string
  avatarUrl: string
}

export interface Warning {
  type: 'MISSING_VEHICLE_INFO' | 'NONE'
  time: string
}

export interface Insurance {
  company: 'PROGRESSIVE' | 'GEICO' | 'ALLSTATE' | 'SELFPAY'
  isActive: boolean
}

export interface Communication {
  hasEmail: boolean
  hasPhone: boolean
  hasMessages: boolean
  messageCount?: number
}

export interface ISecondCall {
  id: string
  claim: string
  vehicle: Vehicle
  roNumber: string
  customer: string
  firstCall: string
  secondCall: string
  lastUpdatedBy: User
  lastUpdated: string
  timeTracking: string
  hasDocument: boolean
  archive: boolean
}

export const mockSecondCall: ISecondCall[] = [
  {
    id: '1',
    claim: '24-58495058',
    vehicle: {
      year: 2017,
      make: 'Volkswagen',
      model: 'Passat',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MbCekxUwcApYCPjuNjex3n7MDRHmIo.png',
    },
    roNumber: '114849',
    customer: 'Aiden Moore',
    firstCall: '9-15-25',
    secondCall: '9-15-25',
    lastUpdatedBy: {
      id: '1',
      name: 'Alexander Walker',
      avatarUrl: '/placeholder.svg',
    },
    lastUpdated: '2 months ago',
    timeTracking: '2h',
    hasDocument: true,
    archive: false,
  },
  {
    id: '2',
    claim: '24-58495058',
    vehicle: {
      year: 2016,
      make: 'BMW',
      model: '328i',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MbCekxUwcApYCPjuNjex3n7MDRHmIo.png',
    },
    roNumber: '114824',
    customer: 'Harper White',
    firstCall: '10-16-25',
    secondCall: '10-16-25',
    lastUpdatedBy: {
      id: '2',
      name: 'Aiden Moore',
      avatarUrl: '/placeholder.svg',
    },
    lastUpdated: '2 months ago',
    timeTracking: '1h',
    hasDocument: true,
    archive: false,
  },
  {
    id: '3',
    claim: '24-58495058',
    vehicle: {
      year: 2018,
      make: 'Toyota',
      model: 'Sienna',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MbCekxUwcApYCPjuNjex3n7MDRHmIo.png',
    },
    roNumber: '113945',
    customer: 'Tom Roberts',
    firstCall: '10-16-25',
    secondCall: '10-16-25',
    lastUpdatedBy: {
      id: '2',
      name: 'Aiden Moore',
      avatarUrl: '/placeholder.svg',
    },
    lastUpdated: '2 months ago',
    timeTracking: '1h',
    hasDocument: true,
    archive: false,
  },
  {
    id: '4',
    claim: '24-58495058',
    vehicle: {
      year: 2021,
      make: 'Honda',
      model: 'Accord',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MbCekxUwcApYCPjuNjex3n7MDRHmIo.png',
    },
    roNumber: '113929',
    customer: 'Charlie Thompson',
    firstCall: '10-14-25',
    secondCall: '10-14-25',
    lastUpdatedBy: {
      id: '3',
      name: 'James Davis',
      avatarUrl: '/placeholder.svg',
    },
    lastUpdated: '2 months ago',
    timeTracking: '18h',
    hasDocument: true,
    archive: false,
  },
]
export function mapVehicleRecord(data: any): ISecondCall {
  return {
    id: data.id || 'N/A',
    claim: data.claim || 'N/A',
    vehicle: data.vehicle || 'Unknown',
    roNumber: data.roNumber || 'N/A',
    customer: data.customer || 'Unknown',
    firstCall: data.firstCall || 'N/A',
    secondCall: data.secondCall || 'N/A',
    lastUpdatedBy: data.lastUpdatedBy || 'Unknown',
    lastUpdated: data.lastUpdated || 'N/A',
    timeTracking: data.timeTracking || 'N/A',
    hasDocument: data.hasDocument || false,
    archive: data.archive || false,
  }
}
