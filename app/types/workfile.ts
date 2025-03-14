import { Task } from './task'

// Tracks the current state of the workfile
export enum WorkfileStatus {
  Upcoming = "Upcoming", // Vehicle has been dropped off, workfile created
  InProgress = "In Progress", // Active repair work is being done
  QC = "QC", // Vehicle undergoing quality control inspection
  ReadyForPickup = "Ready for Pickup", // Repair complete, vehicle ready for pickup
  Archived = "Archived" // Workfile is archived
}

export type Workfile = {
    workfileId: string; // Unique identifier for the workfile
    opportunityId: string; // Reference to the original opportunity
    roNumber?: string; // RO number
    status: WorkfileStatus; // Current status of the workfile
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
    owner: { // Renamed from customer to match opportunity type
      name: string; // Owner name
      phone: string; // Owner phone number
      secondaryPhone?: string; // Owner secondary phone number
      email: string; // Owner email
      address: string; // Owner address
      city?: string; // Owner city
      state?: string; // Owner state
      zip?: string; // Owner zip code
      company?: string; // Owner's company name (optional)
    };
    insurance: {
      company: string; // Insurance company (e.g., Progressive)
      claimNumber: string; // Claim number
      policyNumber: string; // Policy number
      deductible: number; // Deductible amount
      typeOfLoss: string; // Type of loss (e.g., Collision, Hail Damage)
      adjuster?: string; // Adjuster name
      adjusterPhone?: string; // Adjuster phone number
      adjusterEmail?: string; // Adjuster email
    };
    inDate: string; // Date the vehicle was checked in (ISO format)
    estimatedCompletionDate?: string; // Estimated completion date (ISO format)
    estimateAmount?: number; // Total amount of the approved estimate
    estimateSource?: string; // Source of the estimate (e.g., "CCC ONE", "Ultramate EMS")
    estimateVersion?: number; // Version of the estimate
    estimateHours?: number; // Estimate hours
    location?: string; // Location of the repair
    repairPhase?: "Not Started" | "In Progress" | "Upcoming" | "QC" | "Ready for Pickup" | "Archived" | "Delivered"; // Repair phase

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
    tasks?: Task[]; // Array of complete tasks linked to this workfile
};