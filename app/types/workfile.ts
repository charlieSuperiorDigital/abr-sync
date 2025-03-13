export type Workfile = {
    workfileId: string; // Unique identifier for the workfile
    opportunityId: string; // Reference to the original opportunity
    status: 
      | "Upcoming" 
      | "In Progress" 
      | "QC" 
      | "Ready for Pickup" 
      | "Archived"; // Possible statuses
    createdDate: string; // Date the workfile was created (ISO format)
    lastUpdatedDate: string; // Date the workfile was last updated (ISO format)
    vehicle: {
      vin: string; // Vehicle Identification Number
      make: string; // Vehicle make (e.g., Toyota)
      model: string; // Vehicle model (e.g., Camry)
      year: number; // Vehicle year
      licensePlate: string; // License plate number
      exteriorColor: string; // Exterior color
      interiorColor: string; // Interior color
      mileageIn: number; // Mileage when the vehicle was checked in
      vehiclePicturesUrls: string[]; // URLs of vehicle pictures
    };
    customer: {
      name: string; // Customer name
      phone: string; // Customer phone number
      email: string; // Customer email
      address: string; // Customer address
    };
    insurance: {
      company: string; // Insurance company (e.g., Progressive)
      claimNumber: string; // Claim number
      policyNumber: string; // Policy number
      deductible: number; // Deductible amount
      typeOfLoss: string; // Type of loss (e.g., Collision, Hail Damage)
    };
    inDate: string; // Date the vehicle was checked in (ISO format)
    estimatedCompletionDate?: string; // Estimated completion date (ISO format)
    estimateAmount?: number; // Total amount of the approved estimate
    partsList?: { // List of parts required for the repair
      partName: string;
      status: "To Order" | "Ordered" | "Received" | "Returned";
    }[];
    supplements?: { // List of supplements (additional repairs or parts)
      description: string;
      status: "Pending Approval" | "Approved" | "Denied";
    }[];
    lastCommunicationSummary?: string; // Summary of the last communication
    isInRental?: boolean; // Indicates if the customer is using a rental vehicle
    isVoilComplete?: boolean; // Indicates if VOIL (VIN, Odometer, Interior, License Plate) is complete
    is4CornersComplete?: boolean; // Indicates if the four corners of the vehicle have been inspected
  };