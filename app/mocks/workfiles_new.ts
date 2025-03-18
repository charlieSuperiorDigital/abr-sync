import { Workfile, WorkfileStatus } from "../types/workfile";

export const workfiles: Workfile[] = [
    // Upcoming Workfile
    {
      workfileId: "WF123456",
      opportunityId: "OPP123456", // Related to a New Opportunity
      roNumber: "RO123456",
      status: WorkfileStatus.Upcoming,
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
          "https://picsum.photos/200/100?random=1",
          "https://picsum.photos/200/100?random=2",
        ],
      },
      owner: {
        name: "John Doe",
        phone: "+1-555-123-4567",
        secondaryPhone: "+1-555-999-8888",
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
        adjuster: "Mike Smith",
        adjusterPhone: "+1-555-987-6543",
        adjusterEmail: "mike.smith@progressive.com"
      },
      inDate: "2023-10-11T08:00:00Z",
      estimatedCompletionDate: "2023-10-18T17:00:00Z",
      estimateAmount: 2500,
      estimateSource: "CCC ONE",
      estimateVersion: 1,
      estimateHours: 24,
      location: "Bay 3",
      parts: {
        total: 2,
        returns: 0,
        returnsAmount: 0,
        lastOrderDate: "2023-10-11T10:00:00Z",
        list: [
          {
            partName: "Front Bumper",
            status: "Ordered",
            orderDate: "2023-10-11T10:00:00Z"
          },
          {
            partName: "Headlight Assembly",
            status: "To Order"
          }
        ]
      },
      lastCommunicationSummary: "Vehicle checked in on 2023-10-11.",
    },
  
    // In Progress Workfile
    {
      workfileId: "WF234567",
      opportunityId: "OPP345678", // Related to an Estimate Opportunity
      roNumber: "RO234567",
      status: WorkfileStatus.InProgress,
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
          "https://picsum.photos/200/100?random=3",
          "https://picsum.photos/200/100?random=4",
        ],
      },
      owner: {
        name: "Michael Brown",
        phone: "+1-555-456-7890",
        secondaryPhone: "+1-555-111-2222",
        email: "michaelbrown@example.com",
        address: "789 Oak St",
        city: "Sometown",
        state: "NY",
        zip: "67890",
        company: "XYZ Inc"
      },
      insurance: {
        company: "Geico",
        claimNumber: "CLM234567",
        policyNumber: "POL123456",
        deductible: 750,
        typeOfLoss: "Collision",
        adjuster: "Jane Doe",
        adjusterPhone: "+1-555-555-5555",
        adjusterEmail: "jane.doe@geico.com"
      },
      inDate: "2023-10-12T09:00:00Z",
      estimatedCompletionDate: "2023-10-19T17:00:00Z",
      estimateAmount: 3000,
      estimateSource: "CCC ONE",
      estimateVersion: 1,
      estimateHours: 30,
      location: "Bay 2",
      parts: {
        total: 2,
        returns: 0,
        returnsAmount: 0,
        lastOrderDate: "2023-10-12T10:00:00Z",
        list: [
          {
            partName: "Hood",
            status: "Received",
            orderDate: "2023-10-12T10:00:00Z"
          },
          {
            partName: "Windshield",
            status: "To Order"
          }
        ]
      },
      lastCommunicationSummary: "Vehicle repair in progress as of 2023-10-12.",
    },
  
    // QC Workfile
    {
      workfileId: "WF345678",
      opportunityId: "OPP567890", // Related to a 2nd Call Opportunity
      roNumber: "RO345678",
      status: WorkfileStatus.QC,
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
          "https://picsum.photos/200/100?random=5",
          "https://picsum.photos/200/100?random=6",
        ],
      },
      owner: {
        name: "David Wilson",
        phone: "+1-555-654-3210",
        secondaryPhone: "+1-555-333-4444",
        email: "davidwilson@example.com",
        address: "654 Maple St",
        city: "Newtown",
        state: "FL",
        zip: "34567",
        company: " DEF Inc"
      },
      insurance: {
        company: "Farmers",
        claimNumber: "CLM678901",
        policyNumber: "POL345678",
        deductible: 500,
        typeOfLoss: "Collision",
        adjuster: "Bob Johnson",
        adjusterPhone: "+1-555-666-7777",
        adjusterEmail: "bob.johnson@farmers.com"
      },
      inDate: "2023-10-13T08:00:00Z",
      estimatedCompletionDate: "2023-10-20T17:00:00Z",
      estimateAmount: 3500,
      estimateSource: "CCC ONE",
      estimateVersion: 1,
      estimateHours: 36,
      location: "Bay 1",
      parts: {
        total: 2,
        returns: 0,
        returnsAmount: 0,
        lastOrderDate: "2023-10-13T10:00:00Z",
        list: [
          {
            partName: "Front Bumper",
            status: "Received",
            orderDate: "2023-10-13T10:00:00Z"
          },
          {
            partName: "Headlight Assembly",
            status: "Received"
          }
        ]
      },
      lastCommunicationSummary: "Vehicle in QC as of 2023-10-13.",
    },
  
    // Ready for Pickup Workfile
    {
      workfileId: "WF456789",
      opportunityId: "OPP789012", // Related to a Total Loss Opportunity
      roNumber: "RO456789",
      status: WorkfileStatus.ReadyForPickup,
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
          "https://picsum.photos/200/100?random=7",
          "https://picsum.photos/200/100?random=8",
        ],
      },
      owner: {
        name: "Chris Evans",
        phone: "+1-555-890-1234",
        secondaryPhone: "+1-555-444-5555",
        email: "chrisevans@example.com",
        address: "890 Birch St",
        city: "Theirtown",
        state: "TX",
        zip: "90123",
        company: "GHI Inc"
      },
      insurance: {
        company: "Nationwide",
        claimNumber: "CLM890123",
        policyNumber: "POL567890",
        deductible: 750,
        typeOfLoss: "Collision",
        adjuster: "Alice Brown",
        adjusterPhone: "+1-555-777-8888",
        adjusterEmail: "alice.brown@nationwide.com"
      },
      inDate: "2023-10-14T09:00:00Z",
      estimatedCompletionDate: "2023-10-21T17:00:00Z",
      estimateAmount: 4000,
      estimateSource: "CCC ONE",
      estimateVersion: 1,
      estimateHours: 40,
      location: "Bay 4",
      parts: {
        total: 2,
        returns: 0,
        returnsAmount: 0,
        lastOrderDate: "2023-10-14T10:00:00Z",
        list: [
          {
            partName: "Hood",
            status: "Received",
            orderDate: "2023-10-14T10:00:00Z"
          },
          {
            partName: "Windshield",
            status: "Received"
          }
        ]
      },
      lastCommunicationSummary: "Vehicle ready for pickup as of 2023-10-14.",
    },
  
    // Archived Workfile
    {
      workfileId: "WF567890",
      opportunityId: "OPP901234", // Related to an Archived Opportunity
      roNumber: "RO567890",
      status: WorkfileStatus.Archived,
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
          "https://picsum.photos/200/100?random=9",
          "https://picsum.photos/200/100?random=10",
        ],
      },
      owner: {
        name: "Mark Taylor",
        phone: "+1-555-012-3456",
        secondaryPhone: "+1-555-222-3333",
        email: "marktaylor@example.com",
        address: "234 Pine St",
        city: "Thistown",
        state: "IL",
        zip: "45678",
        company: "JKL Inc"
      },
      insurance: {
        company: "Travelers",
        claimNumber: "CLM012345",
        policyNumber: "POL789012",
        deductible: 1000,
        typeOfLoss: "Hail Damage",
        adjuster: "Mike Davis",
        adjusterPhone: "+1-555-999-0000",
        adjusterEmail: "mike.davis@travelers.com"
      },
      inDate: "2023-10-15T08:00:00Z",
      estimatedCompletionDate: "2023-10-22T17:00:00Z",
      estimateAmount: 4500,
      estimateSource: "CCC ONE",
      estimateVersion: 1,
      estimateHours: 45,
      location: "Bay 5",
      parts: {
        total: 2,
        returns: 0,
        returnsAmount: 0,
        lastOrderDate: "2023-10-15T10:00:00Z",
        list: [
          {
            partName: "Hood",
            status: "Received",
            orderDate: "2023-10-15T10:00:00Z"
          },
          {
            partName: "Windshield",
            status: "Received"
          }
        ]
      },
      lastCommunicationSummary: "Vehicle archived after repair completion.",
    },
  ];