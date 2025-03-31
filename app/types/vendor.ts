// Vendor interface for parts management vendors
export interface Vendor {
  vendorId: string;
  name: string;
  representative: string;
  roCompleted: number;
  roInProgress: number;
  pendingReturns: number;
  spentPerMonth: number;
  spentPerWeek: number;
  refundAmount: number;
  refundPartsCount: number;
  totalAmount: number;
  lastCommunicationDate: string;
  summary: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  hasUpdates: boolean;
}
