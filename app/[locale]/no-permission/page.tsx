'use client'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function NoPermissionPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Get the current locale from the URL for redirection after logout
      const locale = window.location.pathname.split('/')[1] || 'en'
      // Clear any local storage items that might contain sensitive information
      localStorage.removeItem('user-preferences')
      await signOut({ redirect: false, callbackUrl: `/${locale}/login` })
      router.push(`/${locale}/login`)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <h1 style={{ color: '#d32f2f', fontWeight: 700, fontSize: '2rem' }}>You don't have the permissions to access this page</h1>
      <button
        onClick={() => router.back()}
        style={{ marginTop: 32, padding: '10px 24px', fontSize: '1rem', background: '#101010', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        Go Back
      </button>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        style={{ marginTop: 16, padding: '10px 24px', fontSize: '1rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, cursor: isLoggingOut ? 'not-allowed' : 'pointer', opacity: isLoggingOut ? 0.7 : 1 }}
      >
        {isLoggingOut ? 'Logging out...' : 'Log out'}
      </button>
    </div>
  );
}
