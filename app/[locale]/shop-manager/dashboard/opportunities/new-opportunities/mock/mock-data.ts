export interface NewOpportunites {
  id: string
  vehicle: {
    year: number
    make: string
    model: string
    imageUrl: string
  }
  claim: string
  insurance: {
    company: string
    isActive: boolean
  }
  owner: string
  inRental: boolean
  dropDate: string
  warning?: {
    type: string
    time: string
  }
  uploadDeadline: string
  lastCommDate: string
  email: string
  phone: string
  message: string
}
export function mapOpportunityData(data: any): NewOpportunites {
  return {
    id: data.id,
    vehicle: {
      year: data.vehicleYear,
      make: data.vehicleMake,
      model: data.vehicleModel,
      imageUrl: data.vehicleImage || '',
    },
    claim: data.claimNumber || '',
    insurance: {
      company: data.insuranceCompany as
        | 'PROGRESSIVE'
        | 'GEICO'
        | 'ALLSTATE'
        | 'SELFPAY',
      isActive: data.isInsuranceActive ?? false,
    },
    owner: data.ownerName || 'Unknown',
    inRental: data.isInRental ?? false,
    dropDate: data.dropOffDate || '',
    warning: {
      type: data.warningType as 'MISSING_VEHICLE_INFO' | 'NONE',
      time: data.warningTime || '',
    },
    uploadDeadline: data.uploadDeadline || '',
    lastCommDate: data.lastCommunicationDate || '',
    email: data.email,
    phone: data.phone,
    message: data.hasDelivery,
  }
}

export const mockVehicles: NewOpportunites[] = [
  {
    id: '1',
    vehicle: {
      year: 2017,
      make: 'Volkswagen',
      model: 'Passat',
      imageUrl:
        'https://fotos.perfil.com/2022/08/13/trim/876/492/chevrolet-chevy-1402194.jpg?webp',
    },
    claim: '24-58495058',
    insurance: {
      company: 'PROGRESSIVE',
      isActive: true,
    },
    owner: 'Aiden Moore',
    inRental: true,
    dropDate: '2025-09-15',
    warning: {
      type: 'MISSING_VEHICLE_INFO',
      time: '3h',
    },
    uploadDeadline: '2025-09-23',
    lastCommDate: '2023-09-23 12:34 PM',
    email: 'asda@asda.com',
    phone: '123-456-7890',
    message: '',
  },
  {
    id: '2',
    vehicle: {
      year: 2016,
      make: 'BMW',
      model: '328i',
      imageUrl:
        'https://fotos.perfil.com/2022/08/13/trim/876/492/chevrolet-chevy-1402194.jpg?webp',
    },
    claim: '24-58495058',
    insurance: {
      company: 'PROGRESSIVE',
      isActive: true,
    },
    owner: 'Harper White',
    inRental: true,
    dropDate: '2025-10-16',
    warning: {
      type: 'MISSING_VEHICLE_INFO',
      time: '3h',
    },
    uploadDeadline: '2025-09-23',
    lastCommDate: '2023-09-23 11:56 AM',
    email: 'asda@asda.com',
    phone: '123-456-7890',
    message: '',
  },
  {
    id: '3',
    vehicle: {
      year: 2018,
      make: 'Toyota',
      model: 'Sienna',
      imageUrl:
        'https://fotos.perfil.com/2022/08/13/trim/876/492/chevrolet-chevy-1402194.jpg?webp',
    },
    claim: '24-58495058',
    insurance: {
      company: 'PROGRESSIVE',
      isActive: true,
    },
    owner: 'Tom Roberts',
    inRental: true,
    dropDate: '',
    warning: {
      type: 'MISSING_VEHICLE_INFO',
      time: '4h',
    },
    uploadDeadline: '2025-09-23',
    lastCommDate: '2023-09-23 9:29 AM',
    email: 'asda@asda.com',
    phone: '123-456-7890',
    message: '',
  },
  {
    id: '4',
    vehicle: {
      year: 2021,
      make: 'Honda',
      model: 'Accord',
      imageUrl:
        'https://fotos.perfil.com/2022/08/13/trim/876/492/chevrolet-chevy-1402194.jpg?webp',
    },
    claim: '24-58495058',
    insurance: {
      company: 'PROGRESSIVE',
      isActive: true,
    },
    owner: 'Charlie Thompson',
    inRental: false,
    dropDate: '2025-10-14',

    uploadDeadline: '2025-09-22',
    lastCommDate: '2023-09-22 5:19 PM',
    email: 'example@example.com',
    phone: '123-456-7890',
    message: '',
  },
  {
    id: '5',
    vehicle: {
      year: 2020,
      make: 'Audi',
      model: 'Q5',
      imageUrl:
        'https://fotos.perfil.com/2022/08/13/trim/876/492/chevrolet-chevy-1402194.jpg?webp',
    },
    claim: '24-58495058',
    insurance: {
      company: 'GEICO',
      isActive: true,
    },
    owner: 'Alexander Walker',
    inRental: false,
    dropDate: '',

    uploadDeadline: '2025-09-23',
    lastCommDate: '2023-09-23 12:34 PM',
    email: 'asda@asda.com',
    phone: '123-456-7890',
    message: '',
  },
  {
    id: '6',
    vehicle: {
      year: 2019,
      make: 'Ford',
      model: 'Mustang',
      imageUrl:
        'https://www.ford.com/cmslibs/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang/2023/collections/3-2/23_FRD_MST_21289.jpg',
    },
    claim: '24-58495059',
    insurance: {
      company: 'STATE FARM',
      isActive: true,
    },
    owner: 'Emma Johnson',
    inRental: true,
    dropDate: '2025-11-10',
    warning: {
      type: 'MISSING_DOCUMENTS',
      time: '2h',
    },
    uploadDeadline: '2025-09-30',
    lastCommDate: '2023-09-23 10:15 AM',
    email: 'emma.johnson@example.com',
    phone: '987-654-3210',
    message: '',
  },
  {
    id: '7',
    vehicle: {
      year: 2022,
      make: 'Tesla',
      model: 'Model 3',
      imageUrl:
        'https://www.tesla.com/sites/default/files/models/images/new-model-3-social.jpg',
    },
    claim: '24-58495060',
    insurance: {
      company: 'ALLSTATE',
      isActive: false,
    },
    owner: 'Liam Brown',
    inRental: false,
    dropDate: '',
    warning: {
      type: 'PENDING_APPROVAL',
      time: '5h',
    },
    uploadDeadline: '2025-10-05',
    lastCommDate: '2023-09-23 8:45 AM',
    email: 'liam.brown@example.com',
    phone: '555-123-4567',
    message: '',
  },
  {
    id: '8',
    vehicle: {
      year: 2020,
      make: 'Chevrolet',
      model: 'Silverado',
      imageUrl:
        'https://www.chevrolet.com/content/dam/chevrolet/na/us/english/index/trucks/2023/silverado/01-images/2023-silverado-mov.jpg',
    },
    claim: '24-58495061',
    insurance: {
      company: 'LIBERTY MUTUAL',
      isActive: true,
    },
    owner: 'Olivia Davis',
    inRental: true,
    dropDate: '2025-12-01',
    warning: {
      type: 'MISSING_VEHICLE_INFO',
      time: '1h',
    },
    uploadDeadline: '2025-10-10',
    lastCommDate: '2023-09-23 3:22 PM',
    email: 'olivia.davis@example.com',
    phone: '444-555-6666',
    message: '',
  },
  {
    id: '9',
    vehicle: {
      year: 2018,
      make: 'Subaru',
      model: 'Outback',
      imageUrl:
        'https://www.subaru.com/content/dam/subaru/vehicle-landing-pages/outback/2023/overview/hero/2023-outback-hero.jpg',
    },
    claim: '24-58495062',
    insurance: {
      company: 'NATIONWIDE',
      isActive: true,
    },
    owner: 'Noah Wilson',
    inRental: false,
    dropDate: '',
    warning: {
      type: 'MISSING_DOCUMENTS',
      time: '6h',
    },
    uploadDeadline: '2025-09-28',
    lastCommDate: '2023-09-23 1:10 PM',
    email: 'noah.wilson@example.com',
    phone: '777-888-9999',
    message: '',
  },
  {
    id: '10',
    vehicle: {
      year: 2021,
      make: 'Hyundai',
      model: 'Tucson',
      imageUrl:
        'https://www.hyundai.com/content/dam/hyundai/ww/en/images/find-a-car/2023/tucson/highlights/01-design/desktop/2023-tucson-highlights-design-desktop.jpg',
    },
    claim: '24-58495063',
    insurance: {
      company: 'FARMERS',
      isActive: true,
    },
    owner: 'Ava Martinez',
    inRental: true,
    dropDate: '2025-11-25',
    warning: {
      type: 'PENDING_APPROVAL',
      time: '4h',
    },
    uploadDeadline: '2025-10-15',
    lastCommDate: '2023-09-23 9:00 AM',
    email: 'ava.martinez@example.com',
    phone: '222-333-4444',
    message: '',
  },
  {
    id: '11',
    vehicle: {
      year: 2017,
      make: 'Jeep',
      model: 'Wrangler',
      imageUrl:
        'https://www.jeep.com/content/dam/jeep/badges/2023/wrangler/overview/hero/2023-wrangler-hero.jpg',
    },
    claim: '24-58495064',
    insurance: {
      company: 'USAA',
      isActive: false,
    },
    owner: 'William Garcia',
    inRental: false,
    dropDate: '',
    warning: {
      type: 'MISSING_VEHICLE_INFO',
      time: '3h',
    },
    uploadDeadline: '2025-09-25',
    lastCommDate: '2023-09-23 11:30 AM',
    email: 'william.garcia@example.com',
    phone: '666-777-8888',
    message: '',
  },
  {
    id: '12',
    vehicle: {
      year: 2023,
      make: 'Kia',
      model: 'Sportage',
      imageUrl:
        'https://www.kia.com/content/dam/kia/us/en/home/hero/2023/sportage/2023-sportage-hero.jpg',
    },
    claim: '24-58495065',
    insurance: {
      company: 'TRAVELERS',
      isActive: true,
    },
    owner: 'Sophia Rodriguez',
    inRental: true,
    dropDate: '2025-12-15',
    warning: {
      type: 'MISSING_DOCUMENTS',
      time: '2h',
    },
    uploadDeadline: '2025-10-20',
    lastCommDate: '2023-09-23 2:45 PM',
    email: 'sophia.rodriguez@example.com',
    phone: '999-000-1111',
    message: '',
  },
]
