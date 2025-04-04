import { Tenant } from './tenant';

export interface Location {
    id: string;
    tenantId: string;
    tenant: Tenant;
    name: string;
    address: string;
    phone: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}