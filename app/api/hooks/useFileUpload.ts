'use client'

import { useState } from 'react'
import { uploadFileToS3, S3FileUploadResponse } from '../functions/file-upload'

interface UseFileUploadOptions {
  onSuccess?: (data: S3FileUploadResponse) => void
  onError?: (error: unknown) => void
}

interface UseFileUploadReturn {
  uploadFile: (file: File, namePrefix: string) => Promise<S3FileUploadResponse | null>
  isUploading: boolean
  error: Error | null
  reset: () => void
}

/**
 * Hook for uploading files to S3 bucket
 * @param options - Optional callbacks for success and error
 * @returns Object with upload function, loading state, and error
 */
export function useFileUpload(options?: UseFileUploadOptions): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = async (file: File, namePrefix: string): Promise<S3FileUploadResponse | null> => {
    setIsUploading(true)
    setError(null)

    try {
      const response = await uploadFileToS3(file, namePrefix)
      options?.onSuccess?.(response)
      return response
    } catch (err) {
      console.error('File upload error:', err)
      // Convert unknown error to Error object
      const errorObj = err instanceof Error ? err : new Error(String(err))
      setError(errorObj)
      options?.onError?.(errorObj)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const reset = () => {
    setError(null)
    setIsUploading(false)
  }

  return {
    uploadFile,
    isUploading,
    error,
    reset
  }
}

export default useFileUpload
