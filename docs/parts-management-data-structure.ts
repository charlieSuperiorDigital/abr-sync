/**
 * Parts Management Data Structure Reference
 * 
 * This file serves as a comprehensive reference for all data structures
 * used in the Parts Management module of the ABR application.
 * 
 * NOTE: This is for documentation purposes only and is not meant to be imported
 * into the actual application code.
 */

// =============================================================================
// COMMON TYPES AND INTERFACES
// =============================================================================

/**
 * Common vehicle information structure used across all parts management interfaces
 */
export interface Vehicle {
  /** Unique identifier for the vehicle */
  vehicleId: string;
  /** Vehicle make (manufacturer) */
  make: string;
  /** Vehicle model */
  model: string;
  /** Vehicle year */
  year: number;
  /** VIN (Vehicle Identification Number) */
  vin: string;
  /** URL to vehicle image */
  imageUrl?: string;
  /** Vehicle color */
  color: string;
  /** License plate number */
  licensePlate: string;
  /** Insurance company name */
  insuranceCompany: string;
  /** Insurance policy number */
  policyNumber: string;
  /** Claim number associated with this repair */
  claimNumber: string;
}

/**
 * Contact information structure used for vendors and other entities
 */
export interface ContactInfo {
  /** Primary phone number */
  phone: string;
  /** Secondary/alternative phone number */
  alternativePhone?: string;
  /** Email address */
  email: string;
  /** Physical address */
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  /** Contact person name */
  contactPerson?: string;
  /** Preferred contact method */
  preferredContactMethod: 'phone' | 'email';
  /** Best time to contact */
  bestTimeToContact?: string;
}

/**
 * Common status types used across the parts management module
 */
export type Priority = 'high' | 'medium' | 'low';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type OrderStatus = 'pending' | 'ordered' | 'shipped' | 'delivered' | 'cancelled';
export type VendorStatus = 'active' | 'inactive' | 'blacklisted' | 'preferred';

/**
 * Common part information structure
 */
export interface Part {
  /** Unique identifier for the part */
  partId: string;
  /** Part name */
  name: string;
  /** Part number/SKU */
  partNumber: string;
  /** Part description */
  description: string;
  /** Part category */
  category: string;
  /** Part manufacturer */
  manufacturer: string;
  /** Part cost */
  cost: number;
  /** Retail price */
  retailPrice: number;
  /** Quantity */
  quantity: number;
  /** Whether the part is OEM (Original Equipment Manufacturer) */
  isOEM: boolean;
  /** Whether the part is a core part (needs to be returned) */
  isCore: boolean;
  /** Core charge amount (if applicable) */
  coreCharge?: number;
  /** Part weight */
  weight?: number;
  /** Part dimensions */
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm' | 'mm';
  };
  /** Part location in the shop */
  location?: string;
  /** Minimum stock level */
  minStockLevel?: number;
  /** Maximum stock level */
  maxStockLevel?: number;
  /** Reorder point */
  reorderPoint?: number;
  /** Lead time in days */
  leadTimeInDays?: number;
  /** Part warranty information */
  warranty?: {
    duration: number;
    unit: 'days' | 'months' | 'years';
    description: string;
  };
}

// =============================================================================
// TO ORDER PAGE
// =============================================================================

/**
 * Parts Order interface for the To Order page
 */
export interface PartsOrder {
  /** Unique identifier for the order */
  orderId: string;
  /** Repair Order number */
  roNumber: string;
  /** Vehicle information */
  vehicle: Vehicle;
  /** Number of parts in the order */
  partsCount: number;
  /** Technician assigned to the repair */
  assignedTech: string;
  /** Current status of the order */
  status: OrderStatus;
  /** Last updated timestamp */
  lastUpdated: string;
  /** Date by which parts are needed */
  neededByDate: string;
  /** Vendor from whom parts are ordered */
  vendor: string;
  /** Priority level of the order */
  priority: Priority;
  /** Parts included in this order */
  parts: Part[];
  /** Special instructions for the order */
  specialInstructions?: string;
  /** Whether expedited shipping is required */
  expeditedShipping: boolean;
  /** Shipping cost */
  shippingCost: number;
  /** Total cost of the order */
  totalCost: number;
  /** Purchase order number */
  purchaseOrderNumber: string;
  /** Order confirmation number from vendor */
  confirmationNumber?: string;
  /** Estimated delivery date */
  estimatedDeliveryDate?: string;
  /** Actual delivery date */
  actualDeliveryDate?: string;
  /** Person who placed the order */
  orderedBy: string;
  /** Person who approved the order */
  approvedBy?: string;
  /** Notes related to the order */
  notes?: string;
  /** Attachments related to the order (e.g., invoices, receipts) */
  attachments?: string[];
  /** Whether the order is taxable */
  isTaxable: boolean;
  /** Tax rate */
  taxRate: number;
  /** Tax amount */
  taxAmount: number;
  /** Discount percentage */
  discountPercentage: number;
  /** Discount amount */
  discountAmount: number;
  /** Payment terms */
  paymentTerms: string;
  /** Payment method */
  paymentMethod: 'credit_card' | 'check' | 'wire_transfer' | 'account';
  /** Payment status */
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  /** Invoice number */
  invoiceNumber?: string;
  /** Invoice date */
  invoiceDate?: string;
  /** Due date for payment */
  dueDate?: string;
}

// =============================================================================
// INSURANCE APPROVALS PAGE
// =============================================================================

/**
 * Parts Insurance Approval interface for the Insurance Approvals page
 */
export interface PartsInsuranceApproval {
  /** Unique identifier for the invoice */
  invoiceId: string;
  /** Repair Order number */
  roNumber: string;
  /** Vehicle information */
  vehicle: Vehicle;
  /** Number of parts requiring approval */
  partsCount: number;
  /** Technician assigned to the repair */
  assignedTech: string;
  /** Current status of the parts */
  status: string;
  /** Last updated timestamp */
  lastUpdated: string;
  /** Invoice number */
  invoiceNumber: string;
  /** Total amount requiring approval */
  amount: number;
  /** Current approval status */
  approvalStatus: ApprovalStatus;
  /** Estimator handling the approval */
  estimator?: string;
  /** Number of parts to receive */
  toReceive?: number;
  /** Total number of parts */
  total?: number;
  /** Estimated Completion Date */
  ecd?: string;
  /** Expected date for approval */
  expected?: string;
  /** Insurance company information */
  insuranceCompany: {
    name: string;
    adjuster: string;
    phone: string;
    email: string;
    claimNumber: string;
  };
  /** Parts requiring approval */
  parts: Array<Part & {
    approvalStatus: ApprovalStatus;
    approvalRequestDate: string;
    approvalResponseDate?: string;
    approvalNotes?: string;
    alternativeParts?: Part[];
  }>;
  /** Approval request date */
  approvalRequestDate: string;
  /** Approval response date */
  approvalResponseDate?: string;
  /** Reason for approval/rejection */
  approvalReason?: string;
  /** Person who requested the approval */
  requestedBy: string;
  /** Person who processed the approval */
  processedBy?: string;
  /** Attachments related to the approval */
  attachments?: string[];
  /** Notes related to the approval */
  notes?: string;
  /** Whether a supplement is required */
  supplementRequired: boolean;
  /** Supplement number */
  supplementNumber?: number;
  /** Supplement details */
  supplementDetails?: string;
  /** Whether the approval is for OEM parts */
  isOEMApproval: boolean;
  /** Whether the approval is for aftermarket parts */
  isAftermarketApproval: boolean;
  /** Whether the approval is for used parts */
  isUsedPartsApproval: boolean;
  /** Whether the approval is for reconditioned parts */
  isReconditionedPartsApproval: boolean;
}

// =============================================================================
// RETURNS PAGE
// =============================================================================

/**
 * Parts Return interface for the Returns page
 */
export interface PartsReturn {
  /** Unique identifier for the return */
  returnId: string;
  /** Repair Order number */
  roNumber: string;
  /** Vehicle information */
  vehicle: Vehicle;
  /** Date parts were received */
  receivedDate: string;
  /** Date parts were picked up */
  pickedUpDate: string;
  /** Date parts were returned */
  returnedDate: string;
  /** Current refund status */
  refundStatus: RefundStatus;
  /** Refund amount */
  refundAmount: number;
  /** Vendor to whom parts are returned */
  vendor: string;
  /** Return authorization number */
  returnAuthorizationNumber: string;
  /** Reason for return */
  returnReason: 'wrong_part' | 'damaged' | 'defective' | 'not_needed' | 'core_return' | 'other';
  /** Detailed reason if 'other' is selected */
  otherReturnReason?: string;
  /** Parts being returned */
  parts: Array<Part & {
    returnReason: string;
    condition: 'new' | 'used' | 'damaged';
    originalInvoiceNumber: string;
    originalPurchaseDate: string;
  }>;
  /** Whether return shipping is required */
  returnShippingRequired: boolean;
  /** Return shipping cost */
  returnShippingCost: number;
  /** Return shipping method */
  returnShippingMethod?: string;
  /** Return shipping tracking number */
  returnTrackingNumber?: string;
  /** Person who processed the return */
  processedBy: string;
  /** Person who authorized the return */
  authorizedBy: string;
  /** Notes related to the return */
  notes?: string;
  /** Attachments related to the return */
  attachments?: string[];
  /** Whether a restocking fee applies */
  restockingFeeApplies: boolean;
  /** Restocking fee percentage */
  restockingFeePercentage?: number;
  /** Restocking fee amount */
  restockingFeeAmount?: number;
  /** Whether the return is taxable */
  isTaxable: boolean;
  /** Tax rate */
  taxRate: number;
  /** Tax amount */
  taxAmount: number;
  /** Credit memo number */
  creditMemoNumber?: string;
  /** Credit memo date */
  creditMemoDate?: string;
  /** Refund method */
  refundMethod: 'credit_to_account' | 'check' | 'credit_card' | 'cash';
  /** Refund transaction ID */
  refundTransactionId?: string;
  /** Refund date */
  refundDate?: string;
  /** Person who received the refund */
  refundReceivedBy?: string;
}

// =============================================================================
// VENDORS PAGE
// =============================================================================

/**
 * Vendor interface for the Vendors page
 */
export interface Vendor {
  /** Unique identifier for the vendor */
  vendorId: string;
  /** Vendor name */
  name: string;
  /** Vendor representative */
  representative: string;
  /** Number of completed repair orders with this vendor */
  roCompleted: number;
  /** Number of in-progress repair orders with this vendor */
  roInProgress: number;
  /** Number of pending returns with this vendor */
  pendingReturns: number;
  /** Amount spent per month with this vendor */
  spentPerMonth: number;
  /** Amount spent per week with this vendor */
  spentPerWeek: number;
  /** Refund amount pending from this vendor */
  refundAmount: number;
  /** Number of parts pending refund */
  refundPartsCount: number;
  /** Total amount spent with this vendor */
  totalAmount: number;
  /** Date of last communication with this vendor */
  lastCommunicationDate: string;
  /** Summary of relationship with this vendor */
  summary: string;
  /** Contact information for this vendor */
  contactInfo: ContactInfo;
  /** Whether there are updates from this vendor */
  hasUpdates?: boolean;
  /** Vendor status */
  status: VendorStatus;
  /** Vendor rating (1-5) */
  rating: number;
  /** Vendor account number */
  accountNumber: string;
  /** Vendor payment terms */
  paymentTerms: string;
  /** Vendor credit limit */
  creditLimit: number;
  /** Current balance with this vendor */
  currentBalance: number;
  /** Available credit with this vendor */
  availableCredit: number;
  /** Vendor discount percentage */
  discountPercentage: number;
  /** Vendor tax ID */
  taxId: string;
  /** Whether the vendor is tax exempt */
  isTaxExempt: boolean;
  /** Tax exemption certificate number */
  taxExemptionCertificate?: string;
  /** Vendor website */
  website: string;
  /** Vendor business hours */
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  /** Vendor specialties */
  specialties: string[];
  /** Brands carried by this vendor */
  brands: string[];
  /** Average delivery time in days */
  averageDeliveryTime: number;
  /** Return policy */
  returnPolicy: string;
  /** Warranty policy */
  warrantyPolicy: string;
  /** Notes about this vendor */
  notes?: string;
  /** Attachments related to this vendor */
  attachments?: string[];
  /** Date vendor was added to the system */
  dateAdded: string;
  /** Date of last order from this vendor */
  lastOrderDate: string;
  /** Whether this vendor offers online ordering */
  offersOnlineOrdering: boolean;
  /** Online ordering URL */
  onlineOrderingUrl?: string;
  /** Online ordering account */
  onlineOrderingAccount?: string;
  /** Whether this vendor offers delivery */
  offersDelivery: boolean;
  /** Delivery fee */
  deliveryFee?: number;
  /** Minimum order for free delivery */
  minimumOrderForFreeDelivery?: number;
  /** Whether this vendor offers pickup */
  offersPickup: boolean;
  /** Pickup location */
  pickupLocation?: string;
  /** Whether this vendor is a preferred vendor */
  isPreferred: boolean;
  /** Reason for preferred status */
  preferredReason?: string;
}

/**
 * Vendor Detail interface for expandable rows in vendor-related pages
 */
export interface VendorDetail {
  /** Unique identifier for the vendor detail */
  vendorDetailId: string;
  /** Vendor name */
  name: string;
  /** Vendor representative */
  representative: string;
  /** Number of parts to order from this vendor */
  toOrder: number;
  /** Number of parts to receive from this vendor */
  toReceive: number;
  /** Number of parts to return to this vendor */
  toReturn: number;
  /** Total number of parts from this vendor */
  total: number;
  /** Total amount for parts from this vendor */
  totalAmount: number;
  /** Date of last communication with this vendor */
  lastCommunicationDate: string;
  /** Summary of relationship with this vendor */
  summary: string;
  /** Contact information for this vendor */
  contactInfo: ContactInfo;
  /** Phone number */
  phone: string;
  /** Email address */
  email: string;
  /** Current orders with this vendor */
  currentOrders?: PartsOrder[];
  /** Current returns with this vendor */
  currentReturns?: PartsReturn[];
  /** Current approvals with this vendor */
  currentApprovals?: PartsInsuranceApproval[];
  /** Performance metrics for this vendor */
  performanceMetrics?: {
    onTimeDeliveryRate: number;
    qualityRate: number;
    returnRate: number;
    averageResponseTime: number;
    priceCompetitiveness: number;
  };
}

// =============================================================================
// ANALYTICS AND REPORTING
// =============================================================================

/**
 * Parts Management Analytics interface for reporting
 */
export interface PartsManagementAnalytics {
  /** Total number of orders */
  totalOrders: number;
  /** Total number of parts ordered */
  totalPartsOrdered: number;
  /** Total cost of parts ordered */
  totalCost: number;
  /** Average order value */
  averageOrderValue: number;
  /** Average order processing time */
  averageOrderProcessingTime: number;
  /** Number of orders by status */
  ordersByStatus: Record<OrderStatus, number>;
  /** Number of orders by priority */
  ordersByPriority: Record<Priority, number>;
  /** Number of orders by vendor */
  ordersByVendor: Record<string, number>;
  /** Total number of returns */
  totalReturns: number;
  /** Total value of returns */
  totalReturnsValue: number;
  /** Return rate */
  returnRate: number;
  /** Number of returns by reason */
  returnsByReason: Record<string, number>;
  /** Number of returns by vendor */
  returnsByVendor: Record<string, number>;
  /** Total number of insurance approvals */
  totalInsuranceApprovals: number;
  /** Number of approvals by status */
  approvalsByStatus: Record<ApprovalStatus, number>;
  /** Average approval time */
  averageApprovalTime: number;
  /** Approval rate */
  approvalRate: number;
  /** Top vendors by order value */
  topVendorsByOrderValue: Array<{
    vendorId: string;
    vendorName: string;
    orderValue: number;
  }>;
  /** Top vendors by order count */
  topVendorsByOrderCount: Array<{
    vendorId: string;
    vendorName: string;
    orderCount: number;
  }>;
  /** Top parts by order count */
  topPartsByOrderCount: Array<{
    partId: string;
    partName: string;
    orderCount: number;
  }>;
  /** Top parts by return count */
  topPartsByReturnCount: Array<{
    partId: string;
    partName: string;
    returnCount: number;
  }>;
  /** Monthly order trends */
  monthlyOrderTrends: Array<{
    month: string;
    orderCount: number;
    orderValue: number;
  }>;
  /** Monthly return trends */
  monthlyReturnTrends: Array<{
    month: string;
    returnCount: number;
    returnValue: number;
  }>;
  /** Parts inventory turnover rate */
  inventoryTurnoverRate: number;
  /** Average days to receive parts */
  averageDaysToReceive: number;
  /** Average days to return parts */
  averageDaysToReturn: number;
  /** Average days to get insurance approval */
  averageDaysToGetApproval: number;
  /** Percentage of orders with expedited shipping */
  expeditedShippingPercentage: number;
  /** Percentage of orders with special instructions */
  specialInstructionsPercentage: number;
  /** Percentage of orders with discounts */
  discountedOrdersPercentage: number;
  /** Average discount percentage */
  averageDiscountPercentage: number;
  /** Percentage of taxable orders */
  taxableOrdersPercentage: number;
  /** Average tax rate */
  averageTaxRate: number;
  /** Percentage of orders by payment method */
  ordersByPaymentMethod: Record<string, number>;
  /** Percentage of orders by payment status */
  ordersByPaymentStatus: Record<string, number>;
  /** Average days to pay invoices */
  averageDaysToPay: number;
}

// =============================================================================
// SETTINGS AND CONFIGURATION
// =============================================================================

/**
 * Parts Management Settings interface
 */

