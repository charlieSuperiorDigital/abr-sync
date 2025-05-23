"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") {
      console.log('[RoleGuard] Session is still loading...');
      return;
    }
    
    if (status === "unauthenticated") {
      // Redirect to login if not authenticated
      console.log('[RoleGuard] User is unauthenticated, redirecting to login');
      // Handle the case where pathname might be null
      const locale = pathname?.split("/")[1] || 'en';
      router.replace(`/${locale}/login`);
      return;
    }
    
    const userRoles = session?.user?.roles || [];
    
    // More detailed logging
    console.log('[RoleGuard] Authentication status:', status);
    console.log('[RoleGuard] Session data:', JSON.stringify(session, null, 2));
    console.log('[RoleGuard] User roles (exact format):', JSON.stringify(userRoles));
    console.log('[RoleGuard] Allowed roles (exact format):', JSON.stringify(allowedRoles));
    
    // Check if roles are strings and compare them case-insensitively
    const normalizedUserRoles = userRoles.map(role => 
      typeof role === 'string' ? role.toLowerCase() : String(role).toLowerCase()
    );
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
    
    console.log('[RoleGuard] Normalized user roles:', normalizedUserRoles);
    console.log('[RoleGuard] Normalized allowed roles:', normalizedAllowedRoles);
    
    // Check access both ways for debugging
    const hasAccess = userRoles.some((role: string) => allowedRoles.includes(role));
    const hasAccessNormalized = normalizedUserRoles.some(role => 
      normalizedAllowedRoles.includes(role)
    );
    
    console.log('[RoleGuard] Has access (exact match):', hasAccess);
    console.log('[RoleGuard] Has access (normalized):', hasAccessNormalized);
    
    if (!hasAccessNormalized) {
      console.log('[RoleGuard] Access denied, redirecting to no-permission page');
      // Handle the case where pathname might be null
      const locale = pathname?.split("/")[1] || 'en';
      router.replace(`/${locale}/no-permission`);
    } else {
      console.log('[RoleGuard] Access granted');
    }
  }, [status, session, allowedRoles, router, pathname]);

  const userRoles = session?.user?.roles || [];
  const hasAccess = userRoles.some((role: string) => allowedRoles.includes(role));
  
  // Add additional check with case-insensitive comparison
  const normalizedUserRoles = userRoles.map(role => 
    typeof role === 'string' ? role.toLowerCase() : String(role).toLowerCase()
  );
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
  const hasAccessNormalized = normalizedUserRoles.some(role => 
    normalizedAllowedRoles.includes(role)
  );
  
  if (status === "unauthenticated" || (!hasAccess && !hasAccessNormalized)) return null;
  return <>{children}</>;
}
