type RepairOrderStatus = "Pending" | "In Progress" | "Completed" | "Rejected";
type UserRole = "Painter" | "Technician" | "Parts Manager";
type ContactType = "Email" | "Phone" | "SMS";
type CommunicationType = "Call" | "Email" | "SMS" | "In-Person";

interface QualityCheck {
  state: RepairOrderStatus;
  date: string;
  assignedTo: string; // Example: "John Doe - Technician"
}

interface Vehicle {
  model: string;
  year: number;
  pictures: string[];
  imageUrl: string;
}

interface InsuranceProvider {
  id: string;
  name: string;
  pendingEstimates: number;
  pendingReimbursements: number;
  updates: number;
  representative: string;
}

interface Owner {
  name: string;
  address: string;
  company: string;
  preferredContactType: ContactType;
  email: string;
  phoneNumber: string;
}

interface CommunicationLog {
  type: CommunicationType;
  date: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  picture: string;
}

interface WorkOrder {
  RepairOrder: string;
  QualityCheck: QualityCheck;
  Vehicle: Vehicle;
  InsuranceProvider: InsuranceProvider;
  Owner: Owner;
  inRental: boolean;
  inDate: string;
  ECD: string;
  lastCommunicationDate: string;
  summary: string;
  CommunicationLogs: CommunicationLog[];
  Estimate: number;
  PickupDate?: string;
}
