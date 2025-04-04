export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  verificationCode: string | null;
  isActive: boolean;
  preferredLanguage: string | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  passwordResetValidity: string;
  tempPasswordResetCode: string;
  googleSSOId: string | null;
  facebookSSOId: string | null;
  appleSSOId: string | null;
  roles: string; // JSON string of roles array
  tenant: string; // Could be replaced with Tenant type if needed
  invitations: any[]; // Could be replaced with Invitation type if needed
  tenantRoles: any[]; // Could be replaced with TenantRole type if needed
}

// Helper function to get full name
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}
