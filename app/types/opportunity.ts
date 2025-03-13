export type Opportunity = {
  opportunityId: string; // Unique identifier for the opportunity
  status:
  | "New" // Initial contact with customer to schedule drop date
  | "2nd Call" // Follow-up if customer doesn't respond
  | "Estimate" // When estimate is created and approved
  | "Total Loss" // If vehicle is declared total loss
  | "Upcoming" // Vehicle dropped off, workfile created
  | "Archived"; // Opportunity is archived
  createdDate: string; // Date the opportunity was created (ISO format)
  lastUpdatedDate: string; // Date the opportunity was last updated (ISO format)
  priority: "Normal" | "High"; // Priority level
  vehicle: {
    vin: string; // Vehicle Identification Number
    make: string; // Vehicle make (e.g., Toyota)
    model: string; // Vehicle model (e.g., Camry)
    year: number; // Vehicle year
    licensePlate: string; // License plate number
    exteriorColor: string; // Exterior color
    interiorColor: string; // Interior color
    mileageIn: number; // Mileage when the vehicle was checked in
    damageDescription: string; // Description of what happened to the vehicle
    vehiclePicturesUrls: string[]; // URLs of vehicle pictures (for workfile compatibility)
    photos?: Array<{
      id: string;
      url: string;
      type: "exterior" | "interior" | "damage";
      dateAdded: string;
    }>;
  };
  customer: {
    name: string; // Customer name
    phone: string; // Customer phone number
    email: string; // Customer email
    address: string; // Customer address
    company?: string; // Customer's company name (optional)
  };
  insurance: {
    company: string; // Insurance company (e.g., Progressive)
    claimNumber: string; // Claim number
    policyNumber: string; // Policy number
    deductible: number; // Deductible amount
    typeOfLoss: string; // Type of loss (e.g., Collision, Hail Damage)
    representative: string; // Insurance representative name
    approved?: boolean; // Indicates if the insurance is approved
  };
  dropDate?: string; // Scheduled drop date (ISO format)
  lastCommunicationSummary?: string; // Summary of the last communication
  isInRental?: boolean; // Indicates if the customer is using a rental vehicle
  isTotalLoss?: boolean; // Indicates if the vehicle is declared a total loss
  isVoilComplete?: boolean; // Indicates if VOIL (VIN, Odometer, Interior, License Plate) is complete
  is4CornersComplete?: boolean; // Indicates if the four corners of the vehicle have been inspected
  warning?: {
    message: string; // Warning message
    type: 'UPDATED_IN_CCC' | 'MISSING_VOR' | null; // Type of warning
  }; // Warning information
  uploadDeadline?: string; // Deadline for uploading documents (ISO format)
  preferredContactMethod?: 'message' | 'email' | 'phone'; // Preferred method of contact

  // Additional fields for modal
  estimateAmount?: number; // Estimated amount for the repair
  assignedTech?: {
    id: string; // ID of the assigned technician
    name: string; // Name of the assigned technician
    avatar?: string; // Avatar of the assigned technician
    hoursAssigned?: number; // For tech workload distribution
  };
  estimator?: {
    id: string; // ID of the estimator
    name: string; // Name of the estimator
    avatar?: string; // Avatar of the estimator
  };
  attachments?: Array<{
    id: string; // ID of the attachment
    type: string; // Type of the attachment
    url: string; // URL of the attachment
    dateAdded: string; // Date the attachment was added
  }>;
  logs?: Array<{
    type: string; // Type of log
    date: string; // Date of the log
    user: string; // User who created the log
    description?: string; // Description of the log
  }>;
  parts?: {
    total: number; // Total number of parts
    cores: number; // Number of cores
    coresAmount: number; // Amount of cores
    returns: number; // Number of returns
    returnsAmount: number; // Amount of returns
    lastOrderDate?: string; // For tracking last-minute parts orders
  };
  // QC and repair tracking
  preScanCompleted?: boolean; // Indicates if the pre-scan is completed
  postScanCompleted?: boolean; // Indicates if the post-scan is completed
  subletsCompleted?: boolean; // Indicates if the sublets are completed
  qcCompleted?: boolean; // Indicates if the QC is completed
  repairStartDate?: string; // Start date of the repair
  repairInProgressDate?: string; // Date when the repair is in progress
  repairCompletedDate?: string; // Date when the repair is completed
  vehicleOutDate?: string; // Date when the vehicle is out
  estimatedCompletionDate?: string; // ECD tracking
  weatherImpact?: {
    affectsPaint: boolean;
    forecast: string;
    impactDescription?: string;
  }; // Weather integration for paint work
  cycleTime?: number; // Days from In Progress to Complete
};