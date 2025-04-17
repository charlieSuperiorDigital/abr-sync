import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Custom404() {
  const router = useRouter()
  const [locale, setLocale] = useState('en')
  
  useEffect(() => {
    // Extract locale from URL if available
    const path = window.location.pathname
    const localeMatch = path.match(/^\/([a-z]{2})\//)
    if (localeMatch && localeMatch[1]) {
      setLocale(localeMatch[1])
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
          <Link
            href={`/${locale}`}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Home Page
          </Link>
        </div>
      </div>
    </div>
  )
}
