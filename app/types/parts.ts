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
  partsReceivedCount: number;
  totalAmount: number;
  lastCommunicationDate: string;
  summary: string;
  hasCorePart: boolean;
  hasUpdates: boolean;
  insuranceApprovalStatus: number;
  insuranceApprovalStatusName: string;
  coreParts: CorePart[];
  lastReceivedDate: string | null;
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

/**
 * This is the type returned in the useGetAllPartsFromTenant hook.
 * It groups parts by their respective opportunities,
 * and for each opportunity, it groups the parts by their respective part orders.
 * 
 */
export interface PartWithFullDetails {
  opportunity: {
    id: string;
    tenantId: string;
    insuranceId: string;
    vehicleId: string;
    locationId: string | null;
    documentId: string | null;
    status: string;
    roNumber: string;
    createdAt: string;
    updatedAt: string;
    _1stCall: string;
    _2ndCall: string;
    dropDate: string | null;
    summary: string;
    inDate: string;
    inRental: boolean;
    estimatedCompletionDate: string;
  };
  partsDetails: Array<{
    partOrderItem: {
      id: string;
      orderId: string;
      partId: string;
      quantity: number;
      unitPrice: number;
      createdAt: string;
      updatedAt: string;
    };
    partOrder: {
      id: string;
      opportunityId: string;
      vendorId: string;
      partsManagerId: string;
      status: number;
      invoiceNumber: string | null;
      totalAmount: number;
      approvedBy: string | null;
      approvedAt: string | null;
      printedAt: string | null;
      createdBy: string;
      updatedBy: string;
      createdAt: string;
      updatedAt: string;
      hasUpdates: boolean;
      insuranceApprovalStatus: number;
    };
    part: {
      id: string;
      opportunityId: string;
      description: string;
      partNumber: string;
      oemPartNumber: string;
      type: number;
      status: number;
      listPrice: number;
      value: number;
      unitPrice: number;
      isPriceIncluded: boolean;
      isTaxable: boolean;
      isPriceManuallyAdjusted: boolean;
      quantity: number;
      isAlternatePart: boolean;
      isGlassPart: boolean;
      isCore: boolean;
      coreStatus: number;
      coreCharge: number | null;
      expectedDeliveryDate: string | null;
      orderedDate: string | null;
      orderedQuantity: number | null;
      receivedDate: string | null;
      receivedQuantity: number | null;
      returnAmount: number | null;
      returnPickupDate: string | null;
      returnDate: string | null;
      refundStatus: number | null;
      refundAmount: number | null;
      createdBy: string;
      updatedBy: string;
      createdAt: string;
      updatedAt: string;
    };
    vendor: {
      id: string;
      name: string;
      contactName: string;
      contactPhone: string;
      contactEmail: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      isActive: boolean;
      createdBy: string;
      updatedBy: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}
