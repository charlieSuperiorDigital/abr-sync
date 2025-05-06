import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getQualityCheck,
  createQualityCheck,
  updateQualityCheck,
  updateQualityCheckItem,
  addImageToQualityCheckItem,
  deleteImageFromQualityCheckItem,
  addCustomCheck,
  deleteCustomCheck
} from '../functions/quality-check'
import { 
  GetQualityCheckResponse,
  UpdateQualityCheckRequest, 
  UpdateQualityCheckItemRequest, 
  AddCustomCheckRequest,
  DeleteImageParams,
  DeleteCustomCheckParams
} from '@/app/types/quality-check'

export interface UseGetQualityCheckOptions {
  workfileId: string
  enabled?: boolean
}

export function useGetQualityCheck({ workfileId, enabled = true }: UseGetQualityCheckOptions) {
  const { data, isLoading, error } = useQuery<GetQualityCheckResponse>({
    queryKey: ['qualityCheck', workfileId],
    queryFn: async () => {
      const response = await getQualityCheck(workfileId);
      return response.data;
    },
    enabled: enabled && !!workfileId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  return {
    qualityCheck: data?.qualityCheck,
    checks: data?.checks?.map(check => {
      // Handle the case where images is a JSON string that needs to be parsed
      let parsedImages: string[] | null = null;
      if (typeof check.images === 'string') {
        try {
          parsedImages = JSON.parse(check.images);
        } catch (e) {
          console.error('Error parsing images JSON:', e);
        }
      } else {
        parsedImages = check.images;
      }
      
      return {
        ...check,
        images: parsedImages
      };
    }) || [],
    isLoading,
    error
  }
}

export function useCreateQualityCheck() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: (workfileId: string) => createQualityCheck(workfileId),
    onSuccess: (_, workfileId) => {
      queryClient.invalidateQueries({ queryKey: ['qualityCheck', workfileId] })
    }
  })

  return {
    createQualityCheck: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  }
}

export function useUpdateQualityCheck() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: (data: UpdateQualityCheckRequest) => updateQualityCheck(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityCheck'] })
    }
  })

  return {
    updateQualityCheck: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  }
}

export function useUpdateQualityCheckItem() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: (data: UpdateQualityCheckItemRequest) => updateQualityCheckItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityCheck'] })
    }
  })

  return {
    updateItem: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  }
}

export function useQualityCheckImageMutations() {
  const queryClient = useQueryClient()
  
  const addImage = useMutation({
    mutationFn: ({ id, file }: { id: string, file: File }) => 
      addImageToQualityCheckItem(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityCheck'] })
    }
  })

  const deleteImage = useMutation({
    mutationFn: (params: DeleteImageParams) => 
      deleteImageFromQualityCheckItem(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityCheck'] })
    }
  })

  return {
    addImage: addImage.mutate,
    deleteImage: deleteImage.mutate,
    isAddingImage: addImage.isPending,
    isDeletingImage: deleteImage.isPending,
    addImageError: addImage.error,
    deleteImageError: deleteImage.error
  }
}

export function useCustomCheckMutations() {
  const queryClient = useQueryClient()
  
  const addCheck = useMutation({
    mutationFn: (data: AddCustomCheckRequest) => addCustomCheck(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityCheck'] })
    }
  })

  const deleteCheck = useMutation({
    mutationFn: (params: DeleteCustomCheckParams) => deleteCustomCheck(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityCheck'] })
    }
  })

  return {
    addCustomCheck: addCheck.mutate,
    deleteCustomCheck: deleteCheck.mutate,
    isAddingCheck: addCheck.isPending,
    isDeletingCheck: deleteCheck.isPending,
    addCheckError: addCheck.error,
    deleteCheckError: deleteCheck.error
  }
}