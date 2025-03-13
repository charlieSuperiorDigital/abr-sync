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
    
    // Parts tracking (Critical Metric)
    parts?: {
      total: number; // Total number of parts
      returns: number; // Number of returned parts
      returnsAmount: number; // Total cost of returned parts
      lastOrderDate?: string; // Date of last parts order
      list: Array<{
        partName: string;
        status: "To Order" | "Ordered" | "Received" | "Returned";
        orderDate?: string;
      }>;
    };

    // Tech assignment and workload tracking (Critical Metric)
    assignedTech?: {
      id: string;
      name: string;
      hoursAssigned: number;
      avatar?: string;
    };

    // Weather impact tracking (Key Business Rule)
    weatherImpact?: {
      affectsPaint: boolean;
      forecast: string;
      impactDescription?: string;
    };

    // Repair progress tracking
    repairStartDate?: string;
    repairInProgressDate?: string;
    repairCompletedDate?: string;
    vehicleOutDate?: string;
    cycleTime?: number; // Days from In Progress to Complete

    // Quality control tracking
    isVoilComplete?: boolean; // VIN, Odometer, Interior, License Plate check
    is4CornersComplete?: boolean; // Four corners inspection
    preScanCompleted?: boolean;
    postScanCompleted?: boolean;
    qcCompleted?: boolean;

    // Communication and documentation
    lastCommunicationSummary?: string;
    supplements?: Array<{
      description: string;
      status: "Pending Approval" | "Approved" | "Denied";
      amount: number;
      submittedDate: string;
    }>;
    
    // Additional tracking
    isInRental?: boolean;
    uploadDeadline?: string; // 24-hour countdown after check-in
    tasks?: Array<{
      id: string;
      name: string;
      status: "Not Started" | "In Progress" | "Completed";
      assignedTechId?: string;
      estimatedHours: number;
      completedDate?: string;
    }>;
};