export interface ITotalLoss {
  id: string
  claim: string
  vehicle: {
    year: number
    make: string
    model: string
    imageUrl: string
  }
  customer: string
  insurance: string
  nroCommunication: number
  communication?: {
    hasEmail: boolean
    hasPhone: boolean
    hasMessages: boolean
    totalCommunications: number
  }
  timeTracking: string
  finalBill: {
    fileName: string
    url: string
  }
  isPickedUp: boolean
  hasDocument: boolean
  email: string
  phone: string
  messages: string
}

export const mockTotalLoss: ITotalLoss[] = [
  {
    id: '1',
    claim: '24-58495058',
    vehicle: {
      year: 2017,
      make: 'Volkswagen',
      model: 'Passat',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4WCCCwPtEy7z5DpsUotmiiZ6E06qzh.png',
    },
    customer: 'Aiden Moore',
    insurance: 'Progressive',
    nroCommunication: 3,
    timeTracking: '2 Days',
    finalBill: {
      fileName: 'FinalBill.pdf',
      url: '/documents/finalbill-1.pdf',
    },
    isPickedUp: true,
    hasDocument: true,
    email: '',
    phone: '',
    messages: '',
  },
  {
    id: '2',
    claim: '24-58495058',
    vehicle: {
      year: 2016,
      make: 'BMW',
      model: '328i',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4WCCCwPtEy7z5DpsUotmiiZ6E06qzh.png',
    },
    customer: 'Harper White',
    insurance: 'Progressive',
    communication: {
      hasEmail: true,
      hasPhone: true,
      hasMessages: true,
      totalCommunications: 3,
    },
    nroCommunication: 3,
    timeTracking: '3 Days',
    finalBill: {
      fileName: 'FinalBill.pdf',
      url: '/documents/finalbill-2.pdf',
    },
    isPickedUp: true,
    hasDocument: true,
    email: '',
    phone: '',
    messages: '',
  },
  {
    id: '3',
    claim: '24-58495058',
    vehicle: {
      year: 2018,
      make: 'Toyota',
      model: 'Sienna',
      imageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4WCCCwPtEy7z5DpsUotmiiZ6E06qzh.png',
    },
    customer: 'Tom Roberts',
    insurance: 'Progressive',
    communication: {
      hasEmail: true,
      hasPhone: true,
      hasMessages: true,
      totalCommunications: 2,
    },
    nroCommunication: 3,
    timeTracking: '2 Days',
    finalBill: {
      fileName: 'FinalBill.pdf',
      url: '/documents/finalbill-3.pdf',
    },
    isPickedUp: true,
    hasDocument: true,
    email: '',
    phone: '',
    messages: '',
  },
]
