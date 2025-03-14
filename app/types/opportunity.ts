import { Task } from './task'

// Tracks the high-level state of the opportunity or repair order
export enum OpportunityStatus {
  New = "New", // Initial contact with owner to schedule drop date
  SecondCall = "2nd Call", // When CSR couldn't make contact with vehicle owner
  Estimate = "Estimate", // When estimate is created and approved
  TotalLoss = "Total Loss", // If vehicle is declared total loss
  Upcoming = "Upcoming", // Vehicle dropped off, workfile created
  Archived = "Archived" // Opportunity is archived
}

// Tracks the detailed progress of the repair process
export enum RepairStage {
  EstimateCreated = "Estimate Created", // The initial estimate has been created
  EstimateApproved = "Estimate Approved", // The estimate has been approved by insurance
  PartsOrdered = "Parts Ordered", // Parts required for repair have been ordered
  RepairInProgress = "Repair In Progress", // The repair work has started
  QCInspection = "QC Inspection", // Vehicle undergoing quality control inspection
  ReadyForPickup = "Ready for Pickup", // Repair complete, vehicle ready for pickup
  VehiclePickedUp = "Vehicle Picked Up", // Vehicle has been picked up by owner
  RepairOrder = "Repair Order", // Legacy stage for repair orders
  Opportunity = "Opportunity", // Legacy stage for opportunities
  NotStarted = "Not Started", // Repair has not yet started
  Upcoming = "Upcoming" // Vehicle is scheduled for drop-off
}

export type PartsWarningStatus = "ORDERED" | "UPDATED" | undefined;

export type Opportunity = {
  opportunityId: string; // Unique identifier for the opportunity
  roNumber?: string; // RO number
  status: OpportunityStatus; // Current status of the opportunity
  stage: RepairStage; // Current stage of the repair process
  createdDate: string; // Date the opportunity was created (ISO format)
  lastUpdatedDate: string; // Date the opportunity was last updated (ISO format)
  priority: "Normal" | "High"; // Priority level
  firstCallDate?: string; // Date of first contact attempt
  secondCallDate?: string; // Date of second contact attempt
  pickedUpDate?: string; // Date when vehicle was picked up (ISO format)
  lastUpdatedBy?: { // Person who last updated the opportunity
    name: string;
    avatar?: string;
  };
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
  owner: { //this was called customer before
    name: string; // Customer name
    phone: string; // Customer phone number
    secondaryPhone?: string; // Customer secondary phone number
    email: string; // Customer email
    address: string; // Customer address
    city?: string; // Customer city
    state?: string; // Customer state
    zip?: string; // Customer zip code
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
    adjuster?: string; // Adjuster name
    adjusterPhone?: string; // Adjuster phone number
    adjusterEmail?: string; // Adjuster email
  };
  dropDate?: string; // Scheduled drop date (ISO format)
  lastCommunicationSummary?: string; // Summary of the last communication
  isInRental?: boolean; // Indicates if the customer is using a rental vehicle
  isTotalLoss?: boolean; // Indicates if the vehicle is declared a total loss
  finalBill?: { // Final bill information for total loss cases
    amount: number; // Final bill amount
    date: string; // Date when the final bill was issued
    status: 'pending' | 'approved' | 'paid'; // Status of the final bill
    notes?: string; // Any additional notes about the final bill
  };
  isVoilComplete?: boolean; // Indicates if VOIL (VIN, Odometer, Interior, License Plate) is complete
  is4CornersComplete?: boolean; // Indicates if the four corners of the vehicle have been inspected
  warning?: {
    message: string; // Warning message
    type: 'UPDATED_IN_CCC' | 'MISSING_VOR' | null; // Type of warning
  }; // Warning information
  uploadDeadline?: string; // Deadline for uploading documents (ISO format)
  preferredContactMethod?: 'message' | 'email' | 'phone'; // Preferred method of contact
  isArchived?: boolean; // Indicates if the opportunity is archived, preserving its previous status

  // Additional fields for modal
  estimateAmount?: number; // Estimated amount for the repair
  estimateSource?: string; // Source of the estimate (e.g., "CCC ONE", "Ultramate EMS").
  estimateVersion?: number; // Version of the estimate
  assignedTech?: {
    id: string; // ID of the assigned technician
    name: string; // Name of the assigned technician
    avatar?: string; // Avatar of the assigned technician
    hoursAssigned?: number; // For tech workload distribution
  };
  estimator?: {
    id: string; // ID of the estimator
    estimatorName: string; // Name of the estimator
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
    count: number;
    warning?: PartsWarningStatus;
    total?: number; // Total number of parts on the estimate
    cores?: number; // Number of core parts
    coresAmount?: number; // Total cost of core parts
    returns?: number; // Number of returned parts
    returnsAmount?: number; // Total cost of returned parts
  };
  // QC and repair tracking
  preScanCompleted?: boolean; // Indicates if the pre-scan is completed
  postScanCompleted?: boolean; // Indicates if the post-scan is completed
  subletsCompleted?: boolean; // Indicates if the sublets are completed
  qcCompleted?: boolean; // Indicates if the QC is completed
  repairStartDate?: string; // Start date of the repair
  repairInProgressDate?: string; // Date when the repair is in progress
  repairCompletedDate?: string; // Date when the repair is completed
  location?: string; // Location of the repair
  dateClosed?: string; // Date when the opportunity is closed
  vehicleOutDate?: string; // Date when the vehicle is out
  vehicleInDate?: string; // Date when the vehicle is in
  estimateHours?: number; // Estimate hours
  repairPhase?: "In Progress" | "Upcoming" | "QC" | "Ready for Pickup" | "Archived" |"Not Started" |"Delivered"; // Repair phase
  estimatedCompletionDate?: string; // ECD tracking
  weatherImpact?: {
    affectsPaint: boolean;
    forecast: string;
    impactDescription?: string;
  }; // Weather integration for paint work
  cycleTime?: number; // Days from In Progress to Complete
  tasks?: Task[]; // Array of complete tasks
  notes?: string[];
};