interface Vehicle {
  id: string
  year: number
  make: string
  model: string
  imageUrl: string
}

export interface IEstimate {
  roNumber: string
  vehicle: Vehicle
  estimateUrl: string
  owner: string
  partsCount: number
  partsStatus: 'ORDERED' | 'UPDATED' | null
  inRental: boolean
  priority: 'HIGH' | 'NORMAL'
  warning: {
    message: string
    type: 'UPDATED_IN_CCC' | 'MISSING_VOR' | null
  }
  insuranceApproval: 'PENDING APPROVAL' | 'APPROVED'
  hasPreferredContact: boolean
  email: string
  phone: string
  messages: string
}

export const mockEstimate: IEstimate[] = [
  {
    roNumber: '114849',
    owner: 'John Doe',
    vehicle: {
      id: 'v1',
      year: 2017,
      make: 'Volkswagen',
      model: 'Golf',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PDlWfXhr85XOJ8sKuDzTYCK5jsbhLX.png',
    },
    estimateUrl: '/estimates/114849.pdf',
    partsCount: 13,
    partsStatus: 'ORDERED',
    inRental: true,
    priority: 'HIGH',
    warning: {
      message: 'UPDATED IN CCC BY INSURANCE',
      type: 'UPDATED_IN_CCC',
    },
    insuranceApproval: 'PENDING APPROVAL',
    hasPreferredContact: false,
    phone: '123-456-7890',
    email: 'example@example.com',
    messages: '',
  },
  {
    roNumber: '114824',
    owner: 'John Doe',
    vehicle: {
      id: 'v2',
      year: 2016,
      make: 'BMW',
      model: '328i',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PDlWfXhr85XOJ8sKuDzTYCK5jsbhLX.png',
    },
    estimateUrl: '/estimates/114824.pdf',
    partsCount: 45,
    partsStatus: 'ORDERED',
    inRental: true,
    priority: 'HIGH',
    warning: {
      message: 'MISSING VOR',
      type: 'MISSING_VOR',
    },
    insuranceApproval: 'PENDING APPROVAL',
    hasPreferredContact: false,
    phone: '123-456-7890',
    email: 'example@example.com',
    messages: '',
  },
  {
    roNumber: '113945',
    owner: 'John Doe',
    vehicle: {
      id: 'v3',
      year: 2018,
      make: 'Toyota',
      model: 'Sienna',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PDlWfXhr85XOJ8sKuDzTYCK5jsbhLX.png',
    },
    estimateUrl: '/estimates/113945.pdf',
    partsCount: 32,
    partsStatus: 'UPDATED',
    inRental: true,
    priority: 'HIGH',
    warning: {
      message: 'UPDATED IN CCC BY INSURANCE',
      type: 'UPDATED_IN_CCC',
    },
    insuranceApproval: 'PENDING APPROVAL',
    hasPreferredContact: true,
    phone: '123-456-7890',
    email: 'example@example.com',
    messages: '',
  },
  {
    roNumber: '113929',
    owner: 'John Doe',
    vehicle: {
      id: 'v4',
      year: 2021,
      make: 'Honda',
      model: 'Accord',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PDlWfXhr85XOJ8sKuDzTYCK5jsbhLX.png',
    },
    estimateUrl: '/estimates/113929.pdf',
    partsCount: 75,
    partsStatus: null,
    inRental: false,
    priority: 'NORMAL',
    warning: {
      message: '',
      type: null,
    },
    insuranceApproval: 'PENDING APPROVAL',
    hasPreferredContact: false,
    phone: '123-456-7890',
    email: 'example@example.com',
    messages: '',
  },
  {
    roNumber: '115838',
    owner: 'John Doe',
    vehicle: {
      id: 'v5',
      year: 2019,
      make: 'Chevrolet',
      model: 'Malibu',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PDlWfXhr85XOJ8sKuDzTYCK5jsbhLX.png',
    },
    estimateUrl: '/estimates/115838.pdf',
    partsCount: 14,
    partsStatus: null,
    inRental: true,
    priority: 'NORMAL',
    warning: {
      message: '',
      type: null,
    },
    insuranceApproval: 'APPROVED',
    hasPreferredContact: false,
    phone: '123-456-7890',
    email: 'example@example.com',
    messages: '',
  },
  {
    roNumber: '114925',
    owner: 'John Doe',
    vehicle: {
      id: 'v6',
      year: 2022,
      make: 'BMW',
      model: 'X3',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PDlWfXhr85XOJ8sKuDzTYCK5jsbhLX.png',
    },
    estimateUrl: '/estimates/114925.pdf',
    partsCount: 22,
    partsStatus: null,
    inRental: false,
    priority: 'NORMAL',
    warning: {
      message: '',
      type: null,
    },
    insuranceApproval: 'APPROVED',
    hasPreferredContact: false,
    phone: '123-456-7890',
    email: 'example@example.com',
    messages: '',
  },
  {
    roNumber: '114924',
    owner: 'John Doe',
    vehicle: {
      id: 'v7',
      year: 2021,
      make: 'Subaru',
      model: 'Outback',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PDlWfXhr85XOJ8sKuDzTYCK5jsbhLX.png',
    },
    estimateUrl: '/estimates/114924.pdf',
    partsCount: 25,
    partsStatus: 'UPDATED',
    inRental: true,
    priority: 'NORMAL',
    warning: {
      message: '',
      type: null,
    },
    insuranceApproval: 'APPROVED',
    hasPreferredContact: false,
    phone: '123-456-7890',
    email: 'example@example.com',
    messages: '',
  },
]
export function mapEstimate(data: any): IEstimate {
  return {
    roNumber: data.roNumber || 'N/A',
    owner: data.owner || 'Unknown',
    vehicle: {
      id: data.vehicle?.id || 'unknown',
      year: data.vehicle?.year || 0,
      make: data.vehicle?.make || 'Unknown',
      model: data.vehicle?.model || 'Unknown',
      imageUrl: data.vehicle?.imageUrl || 'default-image-url.png',
    },
    estimateUrl: data.estimateUrl || '#',
    partsCount: data.partsCount || 0,
    partsStatus: data.partsStatus || null,
    inRental: data.inRental || false,
    priority: data.priority || 'NORMAL',
    warning: {
      message: data.warning?.message || '',
      type: data.warning?.type || null,
    },
    insuranceApproval: data.insuranceApproval || 'PENDING APPROVAL',
    hasPreferredContact: data.hasPreferredContact || false,
    email: data.email || '',
    phone: data.phone || '',
    messages: data.messages || '',
  }
}
