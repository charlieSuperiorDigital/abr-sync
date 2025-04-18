import { Location } from './location';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  cccApiKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users: any[]; // Consider creating a User interface if needed
  payments: any[]; // Consider creating a Payment interface if needed
  locations: Location[]; // Array of locations associated with this tenant
}

export interface TenantListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  cccApiKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  onboardedById: string | null;
  onboardedByName: string | null;
  trialPeriod: boolean;
  discount: number;
  promoCode: string | null;
  locationCount: number;
  lastPaymentDate: string | null;
  revenue?: number; // Adding this as it's in the UI but not in the API response
}
