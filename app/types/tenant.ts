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
