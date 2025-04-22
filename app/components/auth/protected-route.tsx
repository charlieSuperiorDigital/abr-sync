'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * A component that protects routes by checking if the user is authenticated.
 * If not authenticated, it redirects to the login page.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // If the authentication status is loaded (not loading) and user is not authenticated
    if (status === 'unauthenticated') {
      // Get the current locale from the URL
      const locale = pathname?.split('/')[1] || 'en'
      
      // Redirect to login page with a return URL
      router.push(`/${locale}/login?returnUrl=${encodeURIComponent(pathname!)}`)
    }
  }, [status, router, pathname])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 animate-spin border-primary"></div>
      </div>
    )
  }

  // If authenticated, render the children
  return status === 'authenticated' ? <>{children}</> : null
}

export default ProtectedRoute
