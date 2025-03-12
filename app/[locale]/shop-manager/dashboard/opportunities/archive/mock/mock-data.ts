export interface IArchive {
  id: string
  claim: string
  vehicle: {
    image: string
    year: number
    make: string
    model: string
  }
  roNumber: string
  customer: string
  firstCall: string
  secondCall: string
  lastUpdatedBy: {
    name: string
    avatar: string
  }
  lastUpdated: string
  timeTracking: string
  priority?: boolean
}

export const archiveMock: IArchive[] = [
  {
    id: '24-58495058',
    claim: '24-58495058',
    vehicle: {
      image: '/placeholder.svg?height=40&width=60',
      year: 2017,
      make: 'Volkswagen',
      model: 'Golf',
    },
    roNumber: '114849',
    customer: 'Aiden Moore',
    firstCall: '9-15-25',
    secondCall: '9-15-25',
    lastUpdatedBy: {
      name: 'Alexander Walker',
      avatar: '/placeholder.svg?height=24&width=24',
    },
    lastUpdated: '2 months ago',
    timeTracking: '2h',
  },
  {
    id: '24-58495058',
    claim: '24-58495058',
    vehicle: {
      image: '/placeholder.svg?height=40&width=60',
      year: 2016,
      make: 'BMW',
      model: '3 Series',
    },
    roNumber: '114824',
    customer: 'Harper White',
    firstCall: '10-16-25',
    secondCall: '10-16-25',
    lastUpdatedBy: {
      name: 'Aiden Moore',
      avatar: '/placeholder.svg?height=24&width=24',
    },
    lastUpdated: '2 months ago',
    timeTracking: '1h',
  },
  {
    id: '24-58495058',
    claim: '24-58495058',
    vehicle: {
      image: '/placeholder.svg?height=40&width=60',
      year: 2018,
      make: 'Toyota',
      model: 'Sienna',
    },
    roNumber: '113945',
    customer: 'Tom Roberts',
    firstCall: '10-16-25',
    secondCall: '10-16-25',
    lastUpdatedBy: {
      name: 'Aiden Moore',
      avatar: '/placeholder.svg?height=24&width=24',
    },
    lastUpdated: '2 months ago',
    timeTracking: '1h',
  },
  {
    id: '24-58495058',
    claim: '24-58495058',
    vehicle: {
      image: '/placeholder.svg?height=40&width=60',
      year: 2021,
      make: 'Honda',
      model: 'Accord',
    },
    roNumber: '113929',
    customer: 'Charlie Thompson',
    firstCall: '10-14-25',
    secondCall: '10-14-25',
    lastUpdatedBy: {
      name: 'James Davis',
      avatar: '/placeholder.svg?height=24&width=24',
    },
    lastUpdated: '2 months ago',
    timeTracking: '18h',
  },
  {
    id: '24-58495058',
    claim: '24-58495058',
    vehicle: {
      image: '/placeholder.svg?height=40&width=60',
      year: 2022,
      make: 'Nissan',
      model: 'Pathfinder',
    },
    roNumber: '113924',
    customer: 'George Brown',
    firstCall: '9-16-25',
    secondCall: '9-16-25',
    lastUpdatedBy: {
      name: 'Noah Brown',
      avatar: '/placeholder.svg?height=24&width=24',
    },
    lastUpdated: '2 months ago',
    timeTracking: '17h',
    priority: true,
  },
  {
    id: '24-58495058',
    claim: '24-58495058',
    vehicle: {
      image: '/placeholder.svg?height=40&width=60',
      year: 2020,
      make: 'Audi',
      model: 'Q5',
    },
    roNumber: '118302',
    customer: 'Alexander Walker',
    firstCall: '10-17-25',
    secondCall: '10-17-25',
    lastUpdatedBy: {
      name: 'Alexander Walker',
      avatar: '/placeholder.svg?height=24&width=24',
    },
    lastUpdated: '2 months ago',
    timeTracking: '10h',
  },
]
