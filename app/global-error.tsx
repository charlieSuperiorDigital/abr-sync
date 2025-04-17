'use client'
 
import { useEffect } from 'react'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">Error</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Something went wrong!</h2>
            <p className="text-gray-600 mb-8">
              We apologize for the inconvenience. Please try again later.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
