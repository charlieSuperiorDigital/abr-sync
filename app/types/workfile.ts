import { Task } from './task'

// Tracks the current state of the workfile
export enum WorkfileStatus {
  Upcoming = "Upcoming", // Vehicle has been dropped off, workfile created
  InProgress = "In Progress", // Active repair work is being done
  QC = "QC", // Vehicle undergoing quality control inspection
  ReadyForPickup = "Ready for Pickup", // Repair complete, vehicle ready for pickup
  Archived = "Archived" // Workfile is archived
}

// Tracks the status of quality control
export enum QualityControlStatus {
  AWAITING = "AWAITING", // Quality control is pending or in progress
  COMPLETED = "COMPLETED" // Quality control has been completed
}

// Represents the type of sublet work
export enum SubletType {
  ALIGN = "Align",
  AC = "A/C",
  FIX = "Fix",
  CALIBRATION = "Calibration"
}

// Represents the status of sublet work
export enum SubletStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  DONE = "Done"
}

// Represents a quality control checklist item
export type QualityControlChecklistItem = {
  title: string; // Title of the checklist item
  completed: boolean; // Whether the checklist item has been completed
  completionDate?: string; // Date when the checklist item was completed (ISO format)
  enabled: boolean; // Whether the checklist item is enabled and should be shown
  isCustomField: boolean; // Whether this is a custom field added by the user
  description?: string; // Description for custom fields
};

// Represents the quality control object
export type QualityControl = {
  status: QualityControlStatus; // Current status of quality control
  checklist: QualityControlChecklistItem[]; // List of quality control checklist items
  completionDate?: string; // Date when the quality control was completed (ISO format)
  completedBy?: string; // Name of the user who completed the quality control
  assignedTo?: string; // Name of the technician assigned to the quality control
};

// Represents a sublet for a workfile
export type Sublet = {
  type: SubletType[]; // Type of sublet work
  status: SubletStatus; // Current status of the sublet
  dropOffDate?: string; // Date when the vehicle was dropped off for sublet work (ISO format)
  dueDate?: string; // Date when the sublet work is due to be completed (ISO format)
};

// Represents the API response format for workfiles
export type WorkfileApiResponse = {
  id: string;
  opportunityId: string;
  opportunity: {
    id: string;
    tenantId: string;
    insuranceId: string;
    insurance: null;
    vehicleId: string;
    vehicle: {
      id: string;
      vin: string;
      make: string;
      model: string;
      year: number;
      licensePlate: string;
      exteriorColor: string;
      interiorColor: string;
      mileageIn: number;
      vehiclePicturesUrls: string[];
      owner: {
        id: string;
        name: string;
        phone: string;
        secondaryPhone?: string;
        email: string;
        address: string;
        city?: string;
        state?: string;
        zip?: string;
        company?: string;
      };
    };
    locationId: string | null;
    location: null;
    documentId: string | null;
    document: null;
    summary: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    _1stCall: string;
    _2ndCall: string;
  };
  qualityControl: QualityControl;
  status: string;
  dropDate: string;
  estimatedCompletionDate: string;
  createdAt: string;
  updatedAt: string;
};

// Maps API response to our Workfile type
export const mapWorkfileApiResponseToWorkfile = (apiResponse: WorkfileApiResponse): Workfile => ({
  id: apiResponse.id,
  workfileId: apiResponse.id,
  opportunityId: apiResponse.opportunityId,
  status: apiResponse.status as WorkfileStatus,
  createdDate: apiResponse.createdAt,
  lastUpdatedDate: apiResponse.updatedAt,
  dropDate: apiResponse.dropDate,
  estimatedCompletionDate: apiResponse.estimatedCompletionDate,
  inDate: apiResponse.dropDate,
  vehicle: {
    vin: '',
    make: '',
    model: '',
    year: 0,
    licensePlate: '',
    exteriorColor: '',
    interiorColor: '',
    mileageIn: 0,
    vehiclePicturesUrls: []
  },
  owner: {
    name: '',
    phone: '',
    email: '',
    address: ''
  },
  insurance: {
    company: '',
    claimNumber: '',
    policyNumber: '',
    deductible: 0,
    typeOfLoss: ''
  },
  parts: {
    total: 0,
    returns: 0,
    returnsAmount: 0,
    list: []
  },
  repairStartDate: apiResponse.createdAt,
  uploadDeadline: new Date(new Date(apiResponse.dropDate).getTime() + 24 * 60 * 60 * 1000).toISOString(),
  tasks: []
});

export type Workfile = {
  id: string;
  workfileId: string; // Unique identifier for the workfile
  opportunityId: string; // Reference to the original opportunity
  roNumber?: string; // RO number
  status: WorkfileStatus; // Current status of the workfile
  createdDate: string; // Date the workfile was created (ISO format)
  lastUpdatedDate: string; // Date the workfile was last updated (ISO format)
  dropDate?: string; // Date the vehicle was dropped off (ISO format)
  isVehicleCheckedIn?: boolean; // Whether the vehicle has been checked in
  technician?: {
    id: string;
    name: string;
    avatar?: string;
  }; // Technician assigned to the workfile
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
  pickupDate?: string; // Date when the vehicle is scheduled to be picked up
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
  qualityControl?: QualityControl; // Quality control object
  sublet?: Sublet; // Sublet information for the workfile
  tasks?: Task[]; // Array of complete tasks linked to this workfile
};