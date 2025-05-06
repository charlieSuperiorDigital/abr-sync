import { Opportunity, OpportunityStatus, RepairStage, PartsWarningStatus } from "@/app/types/opportunities"

export const opportunities: Opportunity[] = [
    // New Opportunities - Initial contact with owner to schedule drop date
    {
      opportunityId: "OPP123456",
      status: OpportunityStatus.New,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-01T09:15:00Z",
      lastUpdatedDate: "2023-10-01T09:15:00Z",
      priority: "High",
      isInRental: true,
      uploadDeadline: "2023-10-02T09:15:00Z", // 24 hours after creation
      warning: {
        message: "Customer has history of late payments",
        type: null
      },
      vehicle: {
        vin: "1HGCM82633A123456",
        make: "Honda",
        model: "Accord",
        year: 2018,
        licensePlate: "ABC123",
        exteriorColor: "Blue",
        interiorColor: "Black",
        mileageIn: 45000,
        damageDescription: "Vehicle was involved in a front-end collision at an intersection. Impact damaged the front bumper, hood, and radiator. Airbags were not deployed.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`, `https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO001",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "exterior",
            dateAdded: "2023-10-01T09:15:00Z"
          },
          {
            id: "PHOTO002",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2023-10-01T09:15:00Z"
          }
        ]
      },
      owner: {
        name: "John Doe",
        phone: "+1-555-123-4567",
        email: "johndoe@example.com",
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        company: "ABC Corp"
      },
      insurance: {
        company: "Progressive",
        claimNumber: "CLM789012",
        policyNumber: "POL345678",
        deductible: 500,
        typeOfLoss: "Collision",
        representative: "Sarah Johnson",
        adjuster: "Mike Smith",
        adjusterPhone: "+1-555-987-6543",
        adjusterEmail: "mike.smith@progressive.com",
        approved: undefined
      },
      lastCommunicationSummary: "Initial assignment received from Progressive. Need to contact owner to schedule drop-off.",
      parts: {
        count: 8,
        total: 8,
        cores: 2,
        coresAmount: 350.50,
        returns: 1,
        returnsAmount: 75.25
      }
    },
    {
      opportunityId: "OPP789012",
      status: OpportunityStatus.New,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-02T10:30:00Z",
      lastUpdatedDate: "2023-10-02T10:30:00Z",
      priority: "Normal",
      isInRental: false,
      uploadDeadline: "2023-10-03T10:30:00Z", // 24 hours after creation
      vehicle: {
        vin: "5XYZH4AG4JH123456",
        make: "Toyota",
        model: "Camry",
        year: 2020,
        licensePlate: "XYZ789",
        exteriorColor: "Silver",
        interiorColor: "Gray",
        mileageIn: 22000,
        damageDescription: "Multiple hail impact points across hood, roof, and trunk. Quarter panels also show significant denting from golf ball sized hail.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`, `https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO003",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "exterior",
            dateAdded: "2023-10-02T10:30:00Z"
          },
          {
            id: "PHOTO004",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2023-10-02T10:30:00Z"
          }
        ]
      },
      owner: {
        name: "Jane Smith",
        phone: "+1-555-987-6543",
        email: "janesmith@example.com",
        address: "456 Elm St",
        city: "Othertown",
        state: "NY",
        zip: "67890",
        company: "Smith Enterprises"
      },
      insurance: {
        company: "State Farm",
        claimNumber: "CLM456789",
        policyNumber: "POL987654",
        deductible: 1000,
        typeOfLoss: "Hail Damage",
        representative: "Mike Anderson",
        adjuster: "Emily Davis",
        adjusterPhone: "+1-555-111-2222",
        adjusterEmail: "emily.davis@statefarm.com",
        approved: true
      },
      lastCommunicationSummary: "Initial assignment received from State Farm. Attempting first contact with owner.",
      parts: {
        count: 12,
        total: 12,
        cores: 3,
        coresAmount: 525.75,
        returns: 2,
        returnsAmount: 150.50
      }
    },
  
    // 2nd Call Opportunities - When CSR couldn't make contact with vehicle owner
    {
      opportunityId: "OPP567890",
      roNumber: "RO-114850",
      status: OpportunityStatus.SecondCall,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-05T08:00:00Z",
      lastUpdatedDate: "2023-10-05T12:00:00Z",
      priority: "Normal",
      isInRental: true,
      uploadDeadline: "2023-10-06T08:00:00Z", // 24 hours after creation
      firstCallDate: "2023-10-05T09:15:00Z",
      secondCallDate: "2023-10-05T11:45:00Z",
      lastUpdatedBy: {
        name: "Tom Wilson",
        avatar: "https://picsum.photos/seed/tom/32/32"
      },
      logs: [
        {
          type: "phone_call",
          date: "2023-10-05T09:15:00Z",
          user: "Tom Wilson",
          description: "First attempt to contact owner. No answer, left voicemail about scheduling vehicle drop-off."
        },
        {
          type: "email",
          date: "2023-10-05T10:30:00Z",
          user: "Tom Wilson",
          description: "Sent follow-up email with drop-off scheduling information."
        },
        {
          type: "phone_call",
          date: "2023-10-05T11:45:00Z",
          user: "Tom Wilson",
          description: "Second attempt to contact owner. Still no answer, left detailed voicemail."
        }
      ],
      vehicle: {
        vin: "1G1JC6SH9A1234567",
        make: "Chevrolet",
        model: "Camaro",
        year: 2017,
        licensePlate: "JKL012",
        exteriorColor: "Yellow",
        interiorColor: "Black",
        mileageIn: 28000,
        damageDescription: "Side impact collision in parking lot. Driver's side door and quarter panel sustained damage when another vehicle failed to yield.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`, `https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO005",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "exterior",
            dateAdded: "2023-10-05T08:00:00Z"
          },
          {
            id: "PHOTO006",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2023-10-05T08:00:00Z"
          }
        ]
      },
      owner: {
        name: "David Wilson",
        phone: "+1-555-654-3210",
        email: "davidwilson@example.com",
        address: "654 Maple St",
        city: "Newtown",
        state: "TX",
        zip: "34567",
        company: "Wilson Enterprises"
      },
      insurance: {
        company: "Farmers",
        claimNumber: "CLM678901",
        policyNumber: "POL234567",
        deductible: 750,
        typeOfLoss: "Collision",
        representative: "Bob Taylor",
        adjuster: "Sarah Taylor",
        adjusterPhone: "+1-555-333-4444",
        adjusterEmail: "sarah.taylor@farmers.com",
        approved: undefined
      },
      lastCommunicationSummary: "Attempted to contact owner via phone - no answer. Left voicemail requesting callback to schedule vehicle drop-off. Will try alternate contact methods.",
      parts: {
        count: 5,
        warning: "ORDERED" as PartsWarningStatus,
        total: 5,
        cores: 1,
        coresAmount: 175.25,
        returns: 0,
        returnsAmount: 0
      }
    },
    {
      opportunityId: "OPP567891",
      roNumber: "RO-114851",
      status: OpportunityStatus.SecondCall,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-04T14:00:00Z",
      lastUpdatedDate: "2023-10-05T10:30:00Z",
      priority: "High",
      isInRental: false,
      uploadDeadline: "2023-10-05T14:00:00Z", // 24 hours after creation
      firstCallDate: "2023-10-04T15:30:00Z",
      secondCallDate: "2023-10-05T10:00:00Z",
      lastUpdatedBy: {
        name: "Sarah Johnson",
        avatar: "https://picsum.photos/seed/sarah/32/32"
      },
      logs: [
        {
          type: "phone_call",
          date: "2023-10-04T15:30:00Z",
          user: "Sarah Johnson",
          description: "First attempt to contact owner. No answer, left voicemail about scheduling vehicle drop-off."
        },
        {
          type: "email",
          date: "2023-10-04T16:30:00Z",
          user: "Sarah Johnson",
          description: "Sent follow-up email with drop-off scheduling information."
        },
        {
          type: "phone_call",
          date: "2023-10-05T10:00:00Z",
          user: "Sarah Johnson",
          description: "Second attempt to contact owner. Still no answer, left detailed voicemail."
        }
      ],
      vehicle: {
        vin: "WBAPH7C52BE123456",
        make: "BMW",
        model: "M3",
        year: 2021,
        licensePlate: "MNO345",
        exteriorColor: "Alpine White",
        interiorColor: "Black",
        mileageIn: 18000,
        damageDescription: "Rear-end collision with significant damage to trunk and rear bumper. Possible frame damage.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/OPP567891/384/256`],
        photos: [
          {
            id: "PHOTO007",
            url: `https://picsum.photos/seed/OPP567891/384/256`,
            type: "exterior",
            dateAdded: "2023-10-04T14:00:00Z"
          }
        ]
      },
      owner: {
        name: "Robert Chen",
        phone: "+1-555-789-0123",
        email: "robert.chen@example.com",
        address: "789 Oak Lane",
        city: "Westbrook",
        state: "CA",
        zip: "90210"
      },
      insurance: {
        company: "GEICO",
        claimNumber: "CLM901234",
        policyNumber: "POL567890",
        deductible: 750,
        typeOfLoss: "Collision",
        representative: "Lisa Park",
        adjuster: "James Wilson",
        adjusterPhone: "+1-555-444-5555",
        adjusterEmail: "james.wilson@geico.com",
        approved: false
      },
      dropDate: "2023-10-08T09:00:00Z",
      estimatedCompletionDate: "2023-10-15T17:00:00Z",
      weatherImpact: {
        affectsPaint: false,
        forecast: "Clear",
        impactDescription: "No impact expected"
      },
      location: "Shop 3",
      repairPhase: "Not Started",
      parts: {
        count: 15,
        warning: "ORDERED" as PartsWarningStatus,
        total: 15,
        cores: 3,
        coresAmount: 525.75,
        returns: 2,
        returnsAmount: 150.50
      }
    },
  
    // Estimate Opportunities - When estimate is created and approved
    {
      opportunityId: "OPP234567",
      roNumber: "RO-2024-001",
      status: OpportunityStatus.Estimate,
      stage: RepairStage.EstimateCreated,
      createdDate: "2023-10-06T14:00:00Z",
      lastUpdatedDate: "2023-10-06T16:30:00Z",
      priority: "High",
      isInRental: false,
      vehicle: {
        vin: "WBAJB9C59JB123456",
        make: "BMW",
        model: "X5",
        year: 2019,
        licensePlate: "DEF456",
        exteriorColor: "Black",
        interiorColor: "Tan",
        mileageIn: 35000,
        damageDescription: "Rear-end collision on highway. Damage to rear bumper, trunk, and taillights. Possible frame damage requiring further inspection.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`, `https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO007",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "exterior",
            dateAdded: "2023-10-06T14:00:00Z"
          },
          {
            id: "PHOTO008",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2023-10-06T14:00:00Z"
          }
        ]
      },
      owner: {
        name: "Michael Brown",
        phone: "+1-555-789-0123",
        email: "michaelbrown@example.com",
        address: "789 Oak St",
        city: "Somewhere",
        state: "FL",
        zip: "89012",
        company: "Brown Industries"
      },
      insurance: {
        company: "GEICO",
        claimNumber: "CLM123456",
        policyNumber: "POL789012",
        deductible: 750,
        typeOfLoss: "Collision",
        representative: "Lisa Martinez",
        adjuster: "John Lee",
        adjusterPhone: "+1-555-222-3333",
        adjusterEmail: "john.lee@geico.com"
      },
      lastCommunicationSummary: "Estimate completed and sent to insurance for approval.",
      isVoilComplete: true,
      is4CornersComplete: true,
      parts: {
        count: 10,
        warning: "UPDATED" as PartsWarningStatus,
        total: 10,
        cores: 2,
        coresAmount: 350.50,
        returns: 1,
        returnsAmount: 75.25
      }
    },
    {
      opportunityId: "OPP345679",
      roNumber: "RO-2024-002",
      status: OpportunityStatus.Estimate,
      stage: RepairStage.EstimateCreated,
      createdDate: "2024-03-10T14:30:00Z",
      lastUpdatedDate: "2024-03-12T09:45:00Z",
      priority: "Normal",
      isInRental: true,
      firstCallDate: "2024-03-10T14:30:00Z",
      secondCallDate: "2024-03-11T15:45:00Z",
      lastUpdatedBy: {
        name: "Chris Thompson",
        avatar: "https://picsum.photos/seed/chris/32/32"
      },
      vehicle: {
        vin: "2HGES167X4H567890",
        make: "Ford",
        model: "Mustang",
        year: 2022,
        licensePlate: "MUS789",
        exteriorColor: "Red",
        interiorColor: "Black",
        mileageIn: 15000,
        damageDescription: "Front-end collision with guardrail. Damage to front bumper, hood, and radiator. Airbags not deployed.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO007",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2024-03-10T14:30:00Z"
          }
        ]
      },
      owner: {
        name: "Michael Brown",
        phone: "+1-555-888-9999",
        email: "michael.brown@example.com",
        address: "789 Oak Drive",
        city: "Springfield",
        state: "IL",
        zip: "62701"
      },
      insurance: {
        company: "Allstate",
        claimNumber: "CLM901234",
        policyNumber: "POL456789",
        deductible: 500,
        typeOfLoss: "Collision",
        representative: "Lisa Moore",
        adjuster: "David Jones",
        adjusterPhone: "+1-555-222-3333",
        adjusterEmail: "david.jones@allstate.com",
        approved: true
      },
      lastCommunicationSummary: "Insurance approved estimate. Ready for parts ordering.",
      isVoilComplete: true,
      is4CornersComplete: true,
      parts: {
        count: 6,
        warning: "ORDERED" as PartsWarningStatus,
        total: 6,
        cores: 1,
        coresAmount: 175.25,
        returns: 0,
        returnsAmount: 0
      }
    },
    {
      opportunityId: "OPP456789",
      roNumber: "RO-2024-003",
      status: OpportunityStatus.Estimate,
      stage: RepairStage.EstimateCreated,
      createdDate: "2024-03-11T10:15:00Z",
      lastUpdatedDate: "2024-03-13T11:30:00Z",
      priority: "High",
      isInRental: true,
      vehicle: {
        vin: "5FNRL6H52NB123456",
        make: "Honda",
        model: "Odyssey",
        year: 2023,
        licensePlate: "VAN456",
        exteriorColor: "Pearl White",
        interiorColor: "Gray",
        mileageIn: 8000,
        damageDescription: "Side impact collision. Damage to passenger doors and quarter panel. Side airbags deployed.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO008",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2024-03-11T10:15:00Z"
          }
        ]
      },
      owner: {
        name: "Sarah Thompson",
        phone: "+1-555-777-6666",
        email: "sarah.thompson@example.com",
        address: "321 Pine Street",
        city: "Riverside",
        state: "CA",
        zip: "92501"
      },
      insurance: {
        company: "GEICO",
        claimNumber: "CLM112233",
        policyNumber: "POL445566",
        deductible: 1000,
        typeOfLoss: "Collision",
        representative: "Mark Wilson",
        adjuster: "Jennifer Lee",
        adjusterPhone: "+1-555-444-5555",
        adjusterEmail: "jennifer.lee@geico.com",
        approved: false
      },
      lastCommunicationSummary: "Insurance denied estimate due to pre-existing damage. Requesting review.",
      isVoilComplete: true,
      is4CornersComplete: true,
      parts: {
        count: 14,
        warning: "UPDATED" as PartsWarningStatus,
        total: 14,
        cores: 3,
        coresAmount: 525.75,
        returns: 2,
        returnsAmount: 150.50
      }
    },
    // Total Loss Opportunities - Vehicle declared total loss
    {
      opportunityId: "OPP345678",
      roNumber: "RO-2024-003",
      status: OpportunityStatus.TotalLoss,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-07T09:00:00Z",
      lastUpdatedDate: "2023-10-07T11:30:00Z",
      priority: "Normal",
      isInRental: true,
      firstCallDate: "2023-10-07T09:00:00Z",
      secondCallDate: "2023-10-08T10:30:00Z",
      lastUpdatedBy: {
        name: "Emily Johnson",
        avatar: "https://picsum.photos/seed/emily/32/32"
      },
      vehicle: {
        vin: "5NPE24AF1FH123456",
        make: "Hyundai",
        model: "Sonata",
        year: 2021,
        licensePlate: "MNO345",
        exteriorColor: "Red",
        interiorColor: "Black",
        mileageIn: 15000,
        damageDescription: "Severe front-end collision with deployed airbags. Significant structural damage to frame and engine compartment.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`, `https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO009",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "exterior",
            dateAdded: "2023-10-07T09:00:00Z"
          },
          {
            id: "PHOTO010",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2023-10-07T09:00:00Z"
          }
        ]
      },
      owner: {
        name: "Sarah Davis",
        phone: "+1-555-456-7890",
        email: "sarahdavis@example.com",
        address: "321 Pine St",
        city: "Elsewhere",
        state: "AZ",
        zip: "56789",
        company: "Davis Corp"
      },
      insurance: {
        company: "Liberty Mutual",
        claimNumber: "CLM345678",
        policyNumber: "POL890123",
        deductible: 1000,
        typeOfLoss: "Collision",
        representative: "John White",
        adjuster: "Karen White",
        adjusterPhone: "+1-555-777-8888",
        adjusterEmail: "karen.white@libertymutual.com",
        approved: false
      },
      lastCommunicationSummary: "Vehicle declared total loss by insurance adjuster. Awaiting owner decision.",
      isTotalLoss: true,
      finalBill: {
        amount: 12500,
        date: "2023-10-09T14:00:00Z",
        status: "pending",
        notes: "Awaiting insurance company approval on final settlement amount"
      },
      parts: {
        count: 7,
        warning: "ORDERED" as PartsWarningStatus,
        total: 7,
        cores: 1,
        coresAmount: 175.25,
        returns: 0,
        returnsAmount: 0
      }
    },
  
    // Upcoming Opportunities - Vehicle is scheduled for drop-off
    {
      opportunityId: "OPP901234",
      roNumber: "RO-2024-004",
      status: OpportunityStatus.Upcoming,
      stage: RepairStage.Upcoming,
      createdDate: "2024-03-12T10:00:00Z",
      lastUpdatedDate: "2024-03-12T10:00:00Z",
      priority: "High",
      isInRental: false,
      vehicle: {
        vin: "1NXBU40E85Z123456",
        make: "Toyota",
        model: "Corolla",
        year: 2015,
        licensePlate: "COR789",
        exteriorColor: "Silver",
        interiorColor: "Gray",
        mileageIn: 80000,
        damageDescription: "Rear-end collision with minor damage to rear bumper and trunk.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO011",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2024-03-12T10:00:00Z"
          }
        ]
      },
      owner: {
        name: "Emily Lee",
        phone: "+1-555-999-8888",
        email: "emilylee@example.com",
        address: "901 Oak St",
        city: "Somewhere",
        state: "CA",
        zip: "12345"
      },
      insurance: {
        company: "State Farm",
        claimNumber: "CLM678901",
        policyNumber: "POL234567",
        deductible: 500,
        typeOfLoss: "Collision",
        representative: "David Kim",
        adjuster: "Lisa Nguyen",
        adjusterPhone: "+1-555-111-2222",
        adjusterEmail: "lisa.nguyen@statefarm.com",
        approved: true
      },
      dropDate: "2024-03-14T09:00:00Z",
      estimatedCompletionDate: "2024-03-21T17:00:00Z",
      weatherImpact: {
        affectsPaint: false,
        forecast: "Clear",
        impactDescription: "No impact expected"
      },
      location: "Shop 2",
      repairPhase: "Not Started",
      parts: {
        count: 3,
        warning: "ORDERED" as PartsWarningStatus,
        total: 3,
        cores: 0,
        coresAmount: 0,
        returns: 0,
        returnsAmount: 0
      }
    }
]

// Additional mock opportunities for New status with different warnings
export const newOpportunitiesWithWarnings: Opportunity[] = [
  {
    opportunityId: "OP-2025-0011",
    status: OpportunityStatus.New,
    stage: RepairStage.Opportunity,
    priority: "High", // High priority due to VOR warning
    createdDate: "2025-03-14T08:30:00Z",
    lastUpdatedDate: "2025-03-14T08:30:00Z",
    vehicle: {
      make: "Honda",
      model: "CR-V",
      year: 2024,
      vin: "1HGCM82633A123456",
      licensePlate: "ABC 123",
      exteriorColor: "Pearl White",
      interiorColor: "Black",
      mileageIn: 15234,
      damageDescription: "Front end collision damage",
      vehiclePicturesUrls: [
        `https://picsum.photos/seed/OP-2025-0011-1/800/600`,
        `https://picsum.photos/seed/OP-2025-0011-2/800/600`
      ]
    },
    owner: {
      name: "Sarah Martinez",
      email: "sarah.m@email.com",
      phone: "555-0123",
      address: "789 Oak Lane",
      city: "Springfield",
      state: "IL",
      zip: "62701"
    },
    insurance: {
      company: "PROGRESSIVE",
      claimNumber: "PRG-2025-789",
      policyNumber: "POL-789123",
      deductible: 500,
      typeOfLoss: "Collision",
      representative: "Michael Brown",
      adjusterEmail: "m.brown@progressive.com",
      approved: undefined
    },
    warning: {
      type: "MISSING_VOR",
      message: "Vehicle Owner Report (VOR) not submitted within 24 hours of opportunity creation"
    },
    isInRental: true,
    uploadDeadline: "2025-03-15T08:30:00Z",
    dropDate: "2025-03-16T14:00:00Z",
    logs: [
      {
        type: "email",
        date: "2025-03-14T08:30:00Z",
        user: "System",
        description: "Initial contact email sent"
      }
    ],
    parts: {
      count: 0,
      total: 0,
      cores: 0,
      coresAmount: 0,
      returns: 0,
      returnsAmount: 0
    }
  },
  {
    opportunityId: "OP-2025-0012",
    status: OpportunityStatus.New,
    stage: RepairStage.Opportunity,
    priority: "Normal", // Medium priority due to CCC update
    createdDate: "2025-03-14T09:15:00Z",
    lastUpdatedDate: "2025-03-14T10:30:00Z",
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: 2023,
      vin: "4T1BF1FK5EU123456",
      licensePlate: "XYZ 789",
      exteriorColor: "Midnight Blue",
      interiorColor: "Beige",
      mileageIn: 28456,
      damageDescription: "Side panel damage from parking incident",
      vehiclePicturesUrls: [
        `https://picsum.photos/seed/OP-2025-0012-1/800/600`,
        `https://picsum.photos/seed/OP-2025-0012-2/800/600`
      ]
    },
    owner: {
      name: "David Wilson",
      email: "d.wilson@email.com",
      phone: "555-0124",
      address: "456 Pine Street",
      city: "Springfield",
      state: "IL",
      zip: "62702"
    },
    insurance: {
      company: "GEICO",
      claimNumber: "GEI-2025-456",
      policyNumber: "POL-456789",
      deductible: 1000,
      typeOfLoss: "Collision",
      representative: "Jennifer Lee",
      adjusterEmail: "j.lee@geico.com",
      approved: undefined
    },
    warning: {
      type: "UPDATED_IN_CCC",
      message: "Estimate updated in CCC One - requires immediate review"
    },
    isInRental: false,
    uploadDeadline: "2025-03-15T09:15:00Z",
    dropDate: "2025-03-17T10:00:00Z",
    logs: [
      {
        type: "phone",
        date: "2025-03-14T09:15:00Z",
        user: "John Smith",
        description: "Initial contact call completed"
      }
    ],
    parts: {
      count: 0,
      total: 0,
      cores: 0,
      coresAmount: 0,
      returns: 0,
      returnsAmount: 0
    }
  },
  {
    opportunityId: "OP-2025-0013",
    status: OpportunityStatus.New,
    stage: RepairStage.Opportunity,
    priority: "Normal", // Normal priority, no warnings
    createdDate: "2025-03-14T10:00:00Z",
    lastUpdatedDate: "2025-03-14T10:00:00Z",
    vehicle: {
      make: "Ford",
      model: "F-150",
      year: 2024,
      vin: "1FTEW1EG5JFB12345",
      licensePlate: "DEF 456",
      exteriorColor: "Race Red",
      interiorColor: "Gray",
      mileageIn: 5123,
      damageDescription: "Rear bumper damage",
      vehiclePicturesUrls: [
        `https://picsum.photos/seed/OP-2025-0013-1/800/600`,
        `https://picsum.photos/seed/OP-2025-0013-2/800/600`
      ]
    },
    owner: {
      name: "Robert Taylor",
      email: "r.taylor@email.com",
      phone: "555-0125",
      address: "321 Maple Drive",
      city: "Springfield",
      state: "IL",
      zip: "62703"
    },
    insurance: {
      company: "STATE FARM",
      claimNumber: "SF-2025-123",
      policyNumber: "POL-123456",
      deductible: 750,
      typeOfLoss: "Collision",
      representative: "Amanda Chen",
      adjusterEmail: "a.chen@statefarm.com",
      approved: undefined
    },
    warning: undefined, // No warning - normal case
    isInRental: false,
    uploadDeadline: "2025-03-15T10:00:00Z",
    dropDate: "2025-03-18T09:00:00Z",
    logs: [
      {
        type: "email",
        date: "2025-03-14T10:00:00Z",
        user: "System",
        description: "Welcome email sent with scheduling link"
      }
    ],
    parts: {
      count: 0,
      total: 0,
      cores: 0,
      coresAmount: 0,
      returns: 0,
      returnsAmount: 0
    }
  }
];

// Update the getOpportunitiesByStatus function to include new mock data
export function getOpportunitiesByStatus(status: OpportunityStatus): Opportunity[] {
  switch (status) {
    case OpportunityStatus.New:
      return [...opportunities.filter(opp => opp.status === OpportunityStatus.New), ...newOpportunitiesWithWarnings];
    case OpportunityStatus.SecondCall:
      return opportunities.filter(opp => opp.status === OpportunityStatus.SecondCall);
    case OpportunityStatus.Estimate:
      return opportunities.filter(opp => opp.status === OpportunityStatus.Estimate);
    case OpportunityStatus.TotalLoss:
      return opportunities.filter(opp => opp.status === OpportunityStatus.TotalLoss);
    case OpportunityStatus.Upcoming:
      return opportunities.filter(opp => opp.status === OpportunityStatus.Upcoming);
    default:
      return [];
  }
}