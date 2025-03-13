export const workfiles : Workfile[] = [
    // Upcoming Workfile
    {
      workfileId: "WF123456",
      opportunityId: "OPP123456", // Related to a New Opportunity
      status: "Upcoming",
      createdDate: "2023-10-11T14:00:00Z",
      lastUpdatedDate: "2023-10-11T18:00:00Z",
      vehicle: {
        vin: "1HGCM82633A123456",
        make: "Honda",
        model: "Accord",
        year: 2018,
        licensePlate: "ABC123",
        exteriorColor: "Blue",
        interiorColor: "Black",
        mileageIn: 45000,
        vehiclePicturesUrls: [
          "https://example.com/vehicle1-front.jpg",
          "https://example.com/vehicle1-rear.jpg",
        ],
      },
      customer: {
        name: "John Doe",
        phone: "+1-555-123-4567",
        email: "johndoe@example.com",
        address: "123 Main St, Anytown, USA",
      },
      insurance: {
        company: "Progressive",
        claimNumber: "CLM789012",
        policyNumber: "POL345678",
        deductible: 500,
        typeOfLoss: "Collision",
      },
      inDate: "2023-10-11T08:00:00Z",
      estimatedCompletionDate: "2023-10-18T17:00:00Z",
      estimateAmount: 2500,
      partsList: [
        {
          partName: "Front Bumper",
          status: "Ordered",
        },
        {
          partName: "Headlight Assembly",
          status: "To Order",
        },
      ],
      lastCommunicationSummary: "Vehicle checked in on 2023-10-11.",
    },
  
    // In Progress Workfile
    {
      workfileId: "WF234567",
      opportunityId: "OPP345678", // Related to an Estimate Opportunity
      status: "In Progress",
      createdDate: "2023-10-12T15:00:00Z",
      lastUpdatedDate: "2023-10-12T19:00:00Z",
      vehicle: {
        vin: "2C3CDXBG5KH123456",
        make: "Chrysler",
        model: "300",
        year: 2019,
        licensePlate: "DEF456",
        exteriorColor: "Black",
        interiorColor: "Beige",
        mileageIn: 32000,
        vehiclePicturesUrls: [
          "https://example.com/vehicle2-front.jpg",
          "https://example.com/vehicle2-rear.jpg",
        ],
      },
      customer: {
        name: "Michael Brown",
        phone: "+1-555-456-7890",
        email: "michaelbrown@example.com",
        address: "789 Oak St, Sometown, USA",
      },
      insurance: {
        company: "Geico",
        claimNumber: "CLM234567",
        policyNumber: "POL123456",
        deductible: 750,
        typeOfLoss: "Collision",
      },
      inDate: "2023-10-12T09:00:00Z",
      estimatedCompletionDate: "2023-10-19T17:00:00Z",
      estimateAmount: 3000,
      partsList: [
        {
          partName: "Hood",
          status: "Received",
        },
        {
          partName: "Windshield",
          status: "To Order",
        },
      ],
      lastCommunicationSummary: "Vehicle repair in progress as of 2023-10-12.",
    },
  
    // QC Workfile
    {
      workfileId: "WF345678",
      opportunityId: "OPP567890", // Related to a 2nd Call Opportunity
      status: "QC",
      createdDate: "2023-10-13T16:00:00Z",
      lastUpdatedDate: "2023-10-13T20:00:00Z",
      vehicle: {
        vin: "1G1JC6SH9A1234567",
        make: "Chevrolet",
        model: "Camaro",
        year: 2017,
        licensePlate: "JKL012",
        exteriorColor: "Yellow",
        interiorColor: "Black",
        mileageIn: 28000,
        vehiclePicturesUrls: [
          "https://example.com/vehicle3-front.jpg",
          "https://example.com/vehicle3-rear.jpg",
        ],
      },
      customer: {
        name: "David Wilson",
        phone: "+1-555-654-3210",
        email: "davidwilson@example.com",
        address: "654 Maple St, Newtown, USA",
      },
      insurance: {
        company: "Farmers",
        claimNumber: "CLM678901",
        policyNumber: "POL345678",
        deductible: 500,
        typeOfLoss: "Collision",
      },
      inDate: "2023-10-13T08:00:00Z",
      estimatedCompletionDate: "2023-10-20T17:00:00Z",
      estimateAmount: 3500,
      partsList: [
        {
          partName: "Front Bumper",
          status: "Received",
        },
        {
          partName: "Headlight Assembly",
          status: "Received",
        },
      ],
      lastCommunicationSummary: "Vehicle in QC as of 2023-10-13.",
    },
  
    // Ready for Pickup Workfile
    {
      workfileId: "WF456789",
      opportunityId: "OPP789012", // Related to a Total Loss Opportunity
      status: "Ready for Pickup",
      createdDate: "2023-10-14T17:00:00Z",
      lastUpdatedDate: "2023-10-14T21:00:00Z",
      vehicle: {
        vin: "WAUZZZ8V0FA123456",
        make: "Audi",
        model: "A4",
        year: 2020,
        licensePlate: "PQR678",
        exteriorColor: "Gray",
        interiorColor: "Black",
        mileageIn: 25000,
        vehiclePicturesUrls: [
          "https://example.com/vehicle4-front.jpg",
          "https://example.com/vehicle4-rear.jpg",
        ],
      },
      customer: {
        name: "Chris Evans",
        phone: "+1-555-890-1234",
        email: "chrisevans@example.com",
        address: "890 Birch St, Theirtown, USA",
      },
      insurance: {
        company: "Nationwide",
        claimNumber: "CLM890123",
        policyNumber: "POL567890",
        deductible: 750,
        typeOfLoss: "Collision",
      },
      inDate: "2023-10-14T09:00:00Z",
      estimatedCompletionDate: "2023-10-21T17:00:00Z",
      estimateAmount: 4000,
      partsList: [
        {
          partName: "Hood",
          status: "Received",
        },
        {
          partName: "Windshield",
          status: "Received",
        },
      ],
      lastCommunicationSummary: "Vehicle ready for pickup as of 2023-10-14.",
    },
  
    // Archived Workfile
    {
      workfileId: "WF567890",
      opportunityId: "OPP901234", // Related to an Archived Opportunity
      status: "Archived",
      createdDate: "2023-10-15T18:00:00Z",
      lastUpdatedDate: "2023-10-15T22:00:00Z",
      vehicle: {
        vin: "1C4RJFBG6EC123456",
        make: "Jeep",
        model: "Grand Cherokee",
        year: 2022,
        licensePlate: "VWX234",
        exteriorColor: "Green",
        interiorColor: "Black",
        mileageIn: 12000,
        vehiclePicturesUrls: [
          "https://example.com/vehicle5-front.jpg",
          "https://example.com/vehicle5-rear.jpg",
        ],
      },
      customer: {
        name: "Mark Taylor",
        phone: "+1-555-012-3456",
        email: "marktaylor@example.com",
        address: "234 Pine St, Thistown, USA",
      },
      insurance: {
        company: "Travelers",
        claimNumber: "CLM012345",
        policyNumber: "POL789012",
        deductible: 1000,
        typeOfLoss: "Hail Damage",
      },
      inDate: "2023-10-15T08:00:00Z",
      estimatedCompletionDate: "2023-10-22T17:00:00Z",
      estimateAmount: 4500,
      partsList: [
        {
          partName: "Hood",
          status: "Received",
        },
        {
          partName: "Windshield",
          status: "Received",
        },
      ],
      lastCommunicationSummary: "Vehicle archived after repair completion.",
    },
  ];