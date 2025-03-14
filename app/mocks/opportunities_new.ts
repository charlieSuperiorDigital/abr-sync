import { Opportunity, OpportunityStatus, RepairStage } from "@/app/types/opportunity"

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
        adjusterEmail: "mike.smith@progressive.com"
      },
      lastCommunicationSummary: "Initial assignment received from Progressive. Need to contact owner to schedule drop-off."
    },
    {
      opportunityId: "OPP789012",
      status: OpportunityStatus.New,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-02T10:30:00Z",
      lastUpdatedDate: "2023-10-02T10:30:00Z",
      priority: "Normal",
      isInRental: false,
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
        adjusterEmail: "emily.davis@statefarm.com"
      },
      lastCommunicationSummary: "Initial assignment received from State Farm. Attempting first contact with owner."
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
        policyNumber: "POL345678",
        deductible: 500,
        typeOfLoss: "Collision",
        representative: "Tom Wilson",
        adjuster: "Sarah Taylor",
        adjusterPhone: "+1-555-333-4444",
        adjusterEmail: "sarah.taylor@farmers.com"
      },
      lastCommunicationSummary: "Attempted to contact owner via phone - no answer. Left voicemail requesting callback to schedule vehicle drop-off. Will try alternate contact methods."
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
      repairPhase: "Not Started"
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
      is4CornersComplete: true
    },
  
    // Total Loss Opportunities - Vehicle declared total loss
    {
      opportunityId: "OPP345678",
      status: OpportunityStatus.TotalLoss,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-07T09:00:00Z",
      lastUpdatedDate: "2023-10-07T11:30:00Z",
      priority: "Normal",
      isInRental: true,
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
        claimNumber: "CLM234567",
        policyNumber: "POL567890",
        deductible: 1000,
        typeOfLoss: "Collision",
        representative: "James Wilson",
        adjuster: "Karen White",
        adjusterPhone: "+1-555-444-5555",
        adjusterEmail: "karen.white@libertymutual.com"
      },
      lastCommunicationSummary: "Vehicle declared total loss by insurance adjuster. Awaiting owner decision.",
      isTotalLoss: true
    }
]