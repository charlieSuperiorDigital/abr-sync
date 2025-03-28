import { 
  Workfile, 
  WorkfileStatus, 
  QualityControlStatus, 
  SubletType, 
  SubletStatus 
} from "../types/workfile";

export const workfiles: Workfile[] = [
    // Upcoming Workfile
    {
      workfileId: "WF123456",
      opportunityId: "OPP123456", // Related to a New Opportunity
      roNumber: "RO123456",
      status: WorkfileStatus.Upcoming,
      createdDate: "2023-10-11T14:00:00Z",
      lastUpdatedDate: "2023-10-11T18:00:00Z",
      dropDate: "2023-10-11T08:00:00Z",
      isVehicleCheckedIn: false,
      technician: {
        id: "TECH001",
        name: "Alex Johnson",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
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
      qualityControl: {
        status: QualityControlStatus.AWAITING,
        checklist: [
          {
            title: "VOIL Check",
            completed: false,
            enabled: true,
            isCustomField: false
          },
          {
            title: "4 Corners Inspection",
            completed: false,
            enabled: true,
            isCustomField: false
          },
          {
            title: "Pre-Scan",
            completed: false,
            enabled: true,
            isCustomField: false
          },
          {
            title: "Post-Scan",
            completed: false,
            enabled: true,
            isCustomField: false
          },
          {
            title: "Final Inspection",
            completed: false,
            enabled: true,
            isCustomField: false
          }
        ],
        assignedTo: "John Smith"
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
      dropDate: "2023-10-12T09:00:00Z",
      isVehicleCheckedIn: true,
      technician: {
        id: "TECH002",
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg"
      },
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
      qualityControl: {
        status: QualityControlStatus.AWAITING,
        checklist: [
          {
            title: "VOIL Check",
            completed: false,
            enabled: true,
            isCustomField: false
          },
          {
            title: "4 Corners Inspection",
            completed: false,
            enabled: true,
            isCustomField: false
          },
          {
            title: "Pre-Scan",
            completed: false,
            enabled: true,
            isCustomField: false
          },
          {
            title: "Post-Scan",
            completed: false,
            enabled: true,
            isCustomField: false
          },
          {
            title: "Final Inspection",
            completed: false,
            enabled: true,
            isCustomField: false
          }
        ],
        assignedTo: "Michael Johnson"
      },
      sublet: {
        type: [SubletType.ALIGN],
        status: SubletStatus.OPEN,
        dropOffDate: "2023-10-13T09:00:00Z",
        dueDate: "2023-10-14T17:00:00Z"
      },
      lastCommunicationSummary: "Vehicle repair in progress as of 2023-10-12.",
    },
  
    // Quality Control Workfile
    {
      workfileId: "WF345678",
      opportunityId: "OPP567890", // Related to a 2nd Call Opportunity
      roNumber: "RO345678",
      status: WorkfileStatus.QC,
      createdDate: "2023-10-13T16:00:00Z",
      lastUpdatedDate: "2023-10-13T20:00:00Z",
      dropDate: "2023-10-13T08:00:00Z",
      isVehicleCheckedIn: true,
      inDate: "2023-10-13T08:00:00Z",
      estimatedCompletionDate: "2023-10-20T17:00:00Z",
      estimateAmount: 3500,
      estimateSource: "CCC ONE",
      estimateVersion: 1,
      estimateHours: 36,
      location: "Bay 1",
      technician: {
        id: "TECH003",
        name: "Sarah Williams",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg"
      },
      vehicle: {
        vin: "1HGCM82633A123456",
        make: "Honda",
        model: "CR-V",
        year: 2020,
        licensePlate: "XYZ-789",
        exteriorColor: "Silver",
        interiorColor: "Gray",
        mileageIn: 35000,
        vehiclePicturesUrls: [
          "https://images.unsplash.com/photo-1568844293986-ca3c5a678aa2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        ]
      },
      owner: {
        name: "Emily Johnson",
        phone: "555-789-1234",
        email: "emily.johnson@example.com",
        address: "789 Elm Street",
        city: "Springfield",
        state: "IL",
        zip: "62701"
      },
      insurance: {
        company: "Progressive",
        claimNumber: "CLM-789-1234",
        policyNumber: "POL-789-1234",
        deductible: 750,
        typeOfLoss: "Collision",
        adjuster: "Daniel Smith",
        adjusterPhone: "555-987-6543",
        adjusterEmail: "daniel.smith@progressive.com"
      },
      qualityControl: {
        status: QualityControlStatus.AWAITING,
        checklist: [
          {
            title: "VOIL Check",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T14:00:00Z"
          },
          {
            title: "4 Corners Inspection",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T15:00:00Z"
          },
          {
            title: "Pre-Scan",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T16:00:00Z"
          },
          {
            title: "Post-Scan",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T17:00:00Z"
          },
          {
            title: "Final Inspection",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T18:00:00Z"
          }
        ],
        assignedTo: "Sarah Williams"
      },
      sublet: {
        type: [SubletType.CALIBRATION, SubletType.AC, SubletType.FIX],
        status: SubletStatus.IN_PROGRESS,
        dropOffDate: "2023-10-13T10:00:00Z",
        dueDate: "2023-10-15T17:00:00Z"
      },
      lastCommunicationSummary: "Quality control checks in progress.",
    },
  
    // Ready for Pickup Workfile
    {
      workfileId: "WF456789",
      opportunityId: "OPP789012", // Related to a Total Loss Opportunity
      roNumber: "RO456789",
      status: WorkfileStatus.ReadyForPickup,
      createdDate: "2023-10-14T17:00:00Z",
      lastUpdatedDate: "2023-10-14T21:00:00Z",
      dropDate: "2023-10-14T08:00:00Z",
      isVehicleCheckedIn: true,
      technician: {
        id: "TECH004",
        name: "Emily Davis",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg"
      },
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
      pickupDate: "2023-10-22T10:00:00Z",
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
      qualityControl: {
        status: QualityControlStatus.COMPLETED,
        checklist: [
          {
            title: "VOIL Check",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T14:00:00Z"
          },
          {
            title: "4 Corners Inspection",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T15:00:00Z"
          },
          {
            title: "Pre-Scan",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T16:00:00Z"
          },
          {
            title: "Post-Scan",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T17:00:00Z"
          },
          {
            title: "Final Inspection",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-13T18:00:00Z"
          }
        ],
        assignedTo: "Michael Johnson"
      },
      sublet: {
        type: [SubletType.AC],
        status: SubletStatus.DONE,
        dropOffDate: "2023-10-12T09:00:00Z",
        dueDate: "2023-10-13T17:00:00Z"
      },
      lastCommunicationSummary: "Vehicle ready for pickup.",
    },
  
    // Archived Workfile
    {
      workfileId: "WF567890",
      opportunityId: "OPP901234", // Related to an Archived Opportunity
      roNumber: "RO567890",
      status: WorkfileStatus.Archived,
      createdDate: "2023-10-15T18:00:00Z",
      lastUpdatedDate: "2023-10-15T22:00:00Z",
      dropDate: "2023-10-15T08:00:00Z",
      isVehicleCheckedIn: true,
      technician: {
        id: "TECH005",
        name: "Robert Brown",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg"
      },
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
      inDate: "2023-10-15T09:00:00Z",
      estimatedCompletionDate: "2023-10-22T17:00:00Z",
      estimateAmount: 4500,
      estimateSource: "CCC ONE",
      estimateVersion: 1,
      estimateHours: 45,
      location: "Bay 5",
      pickupDate: "2023-10-23T14:00:00Z",
      vehicleOutDate: "2023-10-23T15:30:00Z",
      parts: {
        total: 2,
        returns: 0,
        returnsAmount: 0,
        lastOrderDate: "2023-10-15T10:00:00Z",
        list: [
          {
            partName: "Door Panel",
            status: "Received",
            orderDate: "2023-10-15T10:00:00Z"
          },
          {
            partName: "Side Mirror",
            status: "Received"
          }
        ]
      },
      qualityControl: {
        status: QualityControlStatus.COMPLETED,
        checklist: [
          {
            title: "VOIL Check",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-15T13:30:00Z"
          },
          {
            title: "4 Corners Inspection",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-15T13:45:00Z"
          },
          {
            title: "Pre-Scan",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-15T11:00:00Z"
          },
          {
            title: "Post-Scan",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-15T16:30:00Z"
          },
          {
            title: "Final Inspection",
            completed: false,
            enabled: true,
            isCustomField: false,
            completionDate: "2023-10-15T17:00:00Z"
          }
        ],
        completionDate: "2023-10-15T17:30:00Z",
        completedBy: "Robert Brown",
        assignedTo: "Robert Brown"
      },
      lastCommunicationSummary: "Vehicle archived as of 2023-10-15.",
    }
  ];