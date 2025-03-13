export const mockWorkOrders: WorkOrder[] = [
    {
      RepairOrder: "RO-1001",
      QualityCheck: {
        state: "In Progress",
        date: "2025-03-10T14:30:00Z",
        assignedTo: "Michael Carter - Technician",
      },
      Vehicle: {
        model: "Toyota Camry",
        year: 2022,
        imageUrl: "https://picsum.photos/seed/camry1/400/300",
        pictures: [
          "https://picsum.photos/seed/camry1/400/300",
          "https://picsum.photos/seed/camry2/400/300",
        ],
      },
      InsuranceProvider: {
        id: "INS-001",
        name: "State Farm",
        pendingEstimates: 2,
        pendingReimbursements: 1,
        updates: 3,
        representative: "Sarah Johnson",
      },
      Owner: {
        name: "James Anderson",
        address: "1234 Elm Street, Springfield, IL",
        company: "State Farm",
        preferredContactType: "Email",
        email: "james.anderson@email.com",
        phoneNumber: "555-1234",
      },
      inRental: true,
      inDate: "2025-03-08T10:15:00Z",
      ECD: "2025-03-15T18:00:00Z",
      lastCommunicationDate: "2025-03-10T16:45:00Z",
      summary: "Vehicle in repair, waiting for parts approval.",
      CommunicationLogs: [
        {
          type: "Call",
          date: "2025-03-09T11:00:00Z",
          user: {
            id: "USR-001",
            name: "David Lee",
            picture: "https://picsum.photos/seed/user1/100",
          },
        },
        {
          type: "Email",
          date: "2025-03-10T14:00:00Z",
          user: {
            id: "USR-002",
            name: "Sarah Johnson",
            picture: "https://picsum.photos/seed/user2/100",
          },
        },
      ],
      Estimate: 4500.75,
      PickupDate: undefined,
    },
    {
      RepairOrder: "RO-1002",
      QualityCheck: {
        state: "Completed",
        date: "2025-03-09T12:00:00Z",
        assignedTo: "Emily Davis - Painter",
      },
      Vehicle: {
        model: "Honda Accord",
        year: 2020,
        imageUrl: "https://picsum.photos/seed/accord1/400/300",
        pictures: [
          "https://picsum.photos/seed/accord1/400/300",
          "https://picsum.photos/seed/accord2/400/300",
        ],
      },
      InsuranceProvider: {
        id: "INS-002",
        name: "Geico",
        pendingEstimates: 0,
        pendingReimbursements: 1,
        updates: 1,
        representative: "Mark Thompson",
      },
      Owner: {
        name: "Lisa Miller",
        address: "5678 Oak Avenue, Dallas, TX",
        company: "Geico",
        preferredContactType: "Phone",
        email: "lisa.miller@email.com",
        phoneNumber: "555-5678",
      },
      inRental: false,
      inDate: "2025-03-07T09:00:00Z",
      ECD: "2025-03-12T17:30:00Z",
      lastCommunicationDate: "2025-03-09T15:30:00Z",
      summary: "Quality check completed, waiting for pickup.",
      CommunicationLogs: [
        {
          type: "SMS",
          date: "2025-03-08T13:00:00Z",
          user: {
            id: "USR-003",
            name: "Mark Thompson",
            picture: "https://picsum.photos/seed/user3/100",
          },
        },
        {
          type: "In-Person",
          date: "2025-03-09T10:00:00Z",
          user: {
            id: "USR-004",
            name: "Lisa Miller",
            picture: "https://picsum.photos/seed/user4/100",
          },
        },
      ],
      Estimate: 3200.25,
      PickupDate: "2025-03-13T09:00:00Z",
    },
    {
      RepairOrder: "RO-1003",
      QualityCheck: {
        state: "Pending",
        date: "2025-03-11T08:45:00Z",
        assignedTo: "John Williams - Parts Manager",
      },
      Vehicle: {
        model: "Ford Mustang",
        year: 2019,
        imageUrl: "https://picsum.photos/seed/mustang1/400/300",
        pictures: [
          "https://picsum.photos/seed/mustang1/400/300",
          "https://picsum.photos/seed/mustang2/400/300",
        ],
      },
      InsuranceProvider: {
        id: "INS-003",
        name: "Allstate",
        pendingEstimates: 1,
        pendingReimbursements: 2,
        updates: 5,
        representative: "David Roberts",
      },
      Owner: {
        name: "Emma Watson",
        address: "9102 Maple Drive, Denver, CO",
        company: "Allstate",
        preferredContactType: "SMS",
        email: "emma.watson@email.com",
        phoneNumber: "555-7890",
      },
      inRental: true,
      inDate: "2025-03-06T14:00:00Z",
      ECD: "2025-03-16T09:30:00Z",
      lastCommunicationDate: "2025-03-10T10:20:00Z",
      summary: "Pending parts delivery.",
      CommunicationLogs: [
        {
          type: "Call",
          date: "2025-03-07T11:30:00Z",
          user: {
            id: "USR-005",
            name: "David Roberts",
            picture: "https://picsum.photos/seed/user5/100",
          },
        },
        {
          type: "Email",
          date: "2025-03-09T15:10:00Z",
          user: {
            id: "USR-006",
            name: "Emma Watson",
            picture: "https://picsum.photos/seed/user6/100",
          },
        },
      ],
      Estimate: 5700.90,
      PickupDate: undefined,
    },
    {
      RepairOrder: "RO-1004",
      QualityCheck: {
        state: "Rejected",
        date: "2025-03-05T16:20:00Z",
        assignedTo: "Alex Reed - Technician",
      },
      Vehicle: {
        model: "Chevrolet Silverado",
        year: 2021,
        imageUrl: "https://picsum.photos/seed/silverado1/400/300",
        pictures: [
          "https://picsum.photos/seed/silverado1/400/300",
          "https://picsum.photos/seed/silverado2/400/300",
        ],
      },
      InsuranceProvider: {
        id: "INS-004",
        name: "Progressive",
        pendingEstimates: 0,
        pendingReimbursements: 0,
        updates: 2,
        representative: "Natalie Perez",
      },
      Owner: {
        name: "Chris Johnson",
        address: "7803 Sunset Blvd, Los Angeles, CA",
        company: "Progressive",
        preferredContactType: "Email",
        email: "chris.johnson@email.com",
        phoneNumber: "555-3456",
      },
      inRental: false,
      inDate: "2025-03-04T12:45:00Z",
      ECD: "2025-03-10T11:00:00Z",
      lastCommunicationDate: "2025-03-06T09:00:00Z",
      summary: "Repair order rejected due to incorrect estimate.",
      CommunicationLogs: [
        {
          type: "Email",
          date: "2025-03-05T14:00:00Z",
          user: {
            id: "USR-007",
            name: "Natalie Perez",
            picture: "https://picsum.photos/seed/user7/100",
          },
        },
        {
          type: "Call",
          date: "2025-03-06T10:30:00Z",
          user: {
            id: "USR-008",
            name: "Chris Johnson",
            picture: "https://picsum.photos/seed/user8/100",
          },
        },
      ],
      Estimate: 6300.50,
      PickupDate: undefined,
    },
  ];

interface Vehicle {
  model: string;
  year: number;
  imageUrl: string;
  pictures: string[];
}

// More work orders can be added similarly.