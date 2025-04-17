export interface Workfile {
  id: string
  opportunityId: string
  opportunity: null | any
  status: string
  dropDate: string
  estimatedCompletionDate: string
  createdAt: string
  updatedAt: string
}

export interface QualityCheckItem {
  id: string
  qualityCheckId: string
  name: string
  type: number
  enabled: boolean
  defaultCheck: boolean
  okStatus: boolean
  description: string
  notes: string
  images: string[] | null
  performedBy: string | null
  updatedAt: string | null
}

export interface QualityCheck {
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
  name?: string
  enabled?: boolean
  okStatus?: boolean
  // defaultCheck: boolean //should we send this?
  type?: number
  description?: string
  notes?: string
}

export interface AddCustomCheckRequest {
  qualityCheckId: string
  name: string
  enabled: boolean
  okStatus: boolean
  type: number
  description: string
  notes: string
  defaultCheck: boolean
}

export interface DeleteImageParams {
  qualityCheckItemId: string
  fileName: string
}

export interface DeleteCustomCheckParams {
  qualityCheckItemId: string
}
