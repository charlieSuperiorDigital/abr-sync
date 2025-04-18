// Types for parts-related API

export interface Vehicle {
  make: string;
  model: string;
  year: string;
  vin: string;
}

export interface CorePart {
  id: string;
  description: string;
  unitPrice: number;
}

export interface PartsOrderSummary {
  partsOrderId: string;
  vendor: {
    id: string;
    name: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  };
  partsToOrderCount: number;
  partsToReceiveCount: number;
  partsToReturnCount: number;
  totalAmount: number;
  lastCommunicationDate: string;
  summary: string;
  hasCorePart: boolean;
  hasUpdates: boolean;
  insuranceApprovalStatus: number;
  insuranceApprovalStatusName: string;
  coreParts: CorePart[];
}

export interface Tech {
  id: string;
  name: string;
  profilePicture: string;
}

export interface TenantPartOrder {
  opportunityId: string;
  roNumber: string;
  vehicle: Vehicle;
  estimateAmount: number;
  estimatedCompletionDate: string | null;
  assignedTech: Tech | null;
  partsOrders: PartsOrderSummary[];
}

export interface UpdatePartOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdatePartOrderRequest {
  status?: number;
  invoiceNumber?: string;
  approverId?: string;
  approvedAt?: string;
  printedAt?: string;
  items?: UpdatePartOrderItem[];
  insuranceApprovalStatus?: number;
  insuranceApprovalStatusName?: string;
}

export interface Part {
  id: string;
  roNumber: string;
  vehicle: Vehicle;
  vendor: any;
  description: string;
  partNumber: string;
  type: number;
  status: number;
  value: number;
  quantity: number;
  isCore: boolean;
  coreStatus: number;
  coreCharge: number;
  expectedDeliveryDate: string;
  orderedDate: string;
  orderedQuantity: number;
  receivedDate: string;
  receivedQuantity: number;
  returnAmount: number;
  returnPickupDate: string;
  returnDate: string;
  refundStatus: number;
  refundAmount: number;
}
