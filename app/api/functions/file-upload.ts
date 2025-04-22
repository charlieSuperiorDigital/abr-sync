import apiService from "@/app/utils/apiService";

/**
 * Interface for S3 file upload response
 */
export interface S3FileUploadResponse {
  fileUrl: string;
  key: string;
}

/**
 * Upload a file to S3 bucket
 * @param file - The file to upload
 * @param namePrefix - Prefix for the file name (e.g., tenant name)
 * @param bucketPrivacy - Whether the bucket is private (default: false)
 * @param withUrl - Whether to return the URL (default: true)
 * @param publicObject - Whether the object should be public (default: true)
 * @returns Promise with the uploaded file URL and key
 */
export async function uploadFileToS3(
  file: File, 
  namePrefix: string,
  bucketPrivacy: boolean = false,
  withUrl: boolean = true,
  publicObject: boolean = true
): Promise<S3FileUploadResponse> {
  console.log(`Uploading file ${file.name} with prefix ${namePrefix}`);
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Build the URL with query parameters
    const url = `/S3Bucket/UploadFile?bucketPrivacy=${bucketPrivacy}&withUrl=${withUrl}&publicObject=${publicObject}&namePrefix=${encodeURIComponent(namePrefix)}`;
    
    const response = await apiService.post<S3FileUploadResponse>(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('File uploaded successfully to S3:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

/**
 * Delete a file from S3 bucket
 * @param key - The S3 key of the file to delete
 * @returns Promise with void
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  console.log(`Deleting file with key: ${key}`);
  
  try {
    await apiService.delete<void>(
      `/S3Bucket/DeleteFile?key=${encodeURIComponent(key)}`
    );
    
    console.log('File deleted successfully from S3');
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}
