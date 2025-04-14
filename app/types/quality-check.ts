interface Workfile {
  id: string
  opportunityId: string
  opportunity: null | any
  status: string
  dropDate: string
  estimatedCompletionDate: string
  createdAt: string
  updatedAt: string
}

interface QualityCheckItem {
  id: string
  qualityCheckId: string
  name: string
  type: number
  okStatus: boolean
  description: string
  notes: string
  images: string[] | null
  performedBy: string | null
  updatedAt: string | null
}

interface QualityCheck {
  id: string
  workfileId: string
  workfile: Workfile
  performedBy: string
  completed: boolean
  updatedAt: string
}

export interface GetQualityCheckResponse {
  qualityCheck: QualityCheck
  checks: QualityCheckItem[]
}

export interface UpdateQualityCheckRequest {
  qualityCheckId: string
  completed: boolean
}

export interface UpdateQualityCheckItemRequest {
  id: string
  name: string
  okStatus: boolean
  type: number
  description: string
  notes: string
}

export interface AddCustomCheckRequest {
  qualityCheckId: string
  name: string
  okStatus: boolean
  type: number
  description: string
  notes: string
  performedBy: string
}

export interface DeleteImageParams {
  qualityCheckItemId: string
  fileName: string
}

export interface DeleteCustomCheckParams {
  qualityCheckItemId: string
}
