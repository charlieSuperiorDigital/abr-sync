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
        company: "ABC Corp",
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
      lastCommunicationSummary: "Initial assignment received from Progressive. Need to contact owner to schedule drop-off.",
    },
    {
      opportunityId: "OPP789012",
      status: OpportunityStatus.New,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-02T10:30:00Z",
      lastUpdatedDate: "2023-10-02T10:30:00Z",
      priority: "Normal",
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
        company: "Smith Enterprises",
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
      lastCommunicationSummary: "Initial assignment received from State Farm. Attempting first contact with owner.",
    },
  
    // 2nd Call Opportunities - Follow-up if owner doesn't respond
    {
      opportunityId: "OPP567890",
      status: OpportunityStatus.SecondCall,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-05T08:00:00Z",
      lastUpdatedDate: "2023-10-05T12:00:00Z",
      priority: "Normal",
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
        company: "Wilson Enterprises",
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
      lastCommunicationSummary: "Left voicemail for owner. Second attempt to schedule drop-off date.",
    },
  
    // Estimate Opportunities - When estimate is created and approved
    {
      opportunityId: "OPP234567",
      status: OpportunityStatus.Estimate,
      stage: RepairStage.EstimateCreated,
      createdDate: "2023-10-06T14:00:00Z",
      lastUpdatedDate: "2023-10-06T16:30:00Z",
      priority: "High",
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
        zip: "90123",
        company: "Brown & Associates",
      },
      insurance: {
        company: "GEICO",
        claimNumber: "CLM234567",
        policyNumber: "POL789012",
        deductible: 750,
        typeOfLoss: "Collision",
        representative: "Lisa Martinez",
        adjuster: "John Lee",
        adjusterPhone: "+1-555-222-3333",
        adjusterEmail: "john.lee@geico.com"
      },
      lastCommunicationSummary: "Estimate completed and sent to insurance for approval.",
      isInRental: true,
      isVoilComplete: true,
      is4CornersComplete: true,
    },
  
    // Total Loss Opportunities - Vehicle declared total loss
    {
      opportunityId: "OPP345678",
      status: OpportunityStatus.TotalLoss,
      stage: RepairStage.Opportunity,
      createdDate: "2023-10-07T09:00:00Z",
      lastUpdatedDate: "2023-10-07T11:30:00Z",
      priority: "Normal",
      vehicle: {
        vin: "5NPE24AF1FH123456",
        make: "Hyundai",
        model: "Sonata",
        year: 2016,
        licensePlate: "GHI789",
        exteriorColor: "Red",
        interiorColor: "Black",
        mileageIn: 85000,
        damageDescription: "Vehicle caught in flash flood. Water damage to interior electronics and engine. Water line visible at door level suggesting significant submersion.",
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
            type: "interior",
            dateAdded: "2023-10-07T09:00:00Z"
          }
        ]
      },
      owner: {
        name: "Emily Davis",
        phone: "+1-555-321-0987",
        email: "emilydavis@example.com",
        address: "321 Pine St",
        city: "Elsewhere",
        state: "IL",
        zip: "45678",
        company: "Davis Inc.",
      },
      insurance: {
        company: "Allstate",
        claimNumber: "CLM345678",
        policyNumber: "POL123456",
        deductible: 1000,
        typeOfLoss: "Flood Damage",
        representative: "Robert Lee",
        adjuster: "Emily Chen",
        adjusterPhone: "+1-555-444-5555",
        adjusterEmail: "emily.chen@allstate.com"
      },
      lastCommunicationSummary: "Vehicle declared total loss. Awaiting owner decision on salvage.",
      isTotalLoss: true,
    },
  
    // Upcoming Opportunities - Vehicle dropped off, workfile created
    {
      opportunityId: "OPP890123",
      status: OpportunityStatus.Upcoming,
      stage: RepairStage.RepairOrder,
      createdDate: "2023-10-08T11:00:00Z",
      lastUpdatedDate: "2023-10-08T15:30:00Z",
      priority: "Normal",
      vehicle: {
        vin: "2T3ZFREV9EW123456",
        make: "Toyota",
        model: "RAV4",
        year: 2021,
        licensePlate: "MNO345",
        exteriorColor: "White",
        interiorColor: "Gray",
        mileageIn: 15000,
        damageDescription: "Minor fender bender in residential area. Front bumper and grille damaged when vehicle struck a parked car while backing out of driveway.",
        vehiclePicturesUrls: [`https://picsum.photos/seed/${Math.random()}/384/256`, `https://picsum.photos/seed/${Math.random()}/384/256`],
        photos: [
          {
            id: "PHOTO011",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "exterior",
            dateAdded: "2023-10-08T11:00:00Z"
          },
          {
            id: "PHOTO012",
            url: `https://picsum.photos/seed/${Math.random()}/384/256`,
            type: "damage",
            dateAdded: "2023-10-08T11:00:00Z"
          }
        ]
      },
      owner: {
        name: "Sarah Johnson",
        phone: "+1-555-456-7890",
        email: "sarahjohnson@example.com",
        address: "456 Cedar St",
        city: "Anywhere",
        state: "MI",
        zip: "56789",
        company: "Johnson Legal Group",
      },
      insurance: {
        company: "Liberty Mutual",
        claimNumber: "CLM890123",
        policyNumber: "POL567890",
        deductible: 500,
        typeOfLoss: "Vandalism",
        representative: "David Chen",
        adjuster: "Sarah Kim",
        adjusterPhone: "+1-555-666-7777",
        adjusterEmail: "sarah.kim@libertymutual.com"
      },
      lastCommunicationSummary: "Vehicle repaired and picked up by owner. All paperwork completed.",
      isVoilComplete: true,
      is4CornersComplete: true,
    },
  ];