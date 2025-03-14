import { create } from 'zustand'
import { Workfile, WorkfileStatus } from '../types/workfile'
import { workfiles } from '../mocks/workfiles_new'

interface WorkfileStore {
  workfiles: Workfile[]
  selectedWorkfile: Workfile | null
  setSelectedWorkfile: (workfile: Workfile | null) => void
  updateWorkfile: (workfileId: string, updates: Partial<Workfile>) => void
  addWorkfile: (workfile: Workfile) => void
  removeWorkfile: (workfileId: string) => void
  getWorkfilesByStatus: (status: WorkfileStatus) => Workfile[]
  getWorkfileById: (workfileId: string) => Workfile | undefined
  getWorkfileByOpportunityId: (opportunityId: string) => Workfile | undefined
  getUpcomingWorkfiles: () => Workfile[]
  calculateCycleTime: (workfileId: string) => number | null
  getPartsReturnRate: () => number
  getLastMinutePartsOrders: () => Workfile[]
  getTechWorkloadDistribution: () => Array<{ techId: string, hoursAssigned: number }>
  checkWeatherImpact: (workfileId: string) => boolean
  checkUploadDeadlineStatus: (workfileId: string) => { passed: boolean; remainingTime: number | null }
  autoAssignTech: (workfileId: string) => void
  startRepairWork: (workfileId: string) => boolean
  moveToQC: (workfileId: string) => boolean
  moveToReadyForPickup: (workfileId: string) => boolean
  archiveWorkfile: (workfileId: string) => boolean
}

export const useWorkfileStore = create<WorkfileStore>((set, get) => ({
  workfiles: workfiles,
  selectedWorkfile: null,

  setSelectedWorkfile: (workfile) => set({ selectedWorkfile: workfile }),

  updateWorkfile: (workfileId, updates) =>
    set((state) => ({
      workfiles: state.workfiles.map((wf) =>
        wf.workfileId === workfileId ? { ...wf, ...updates } : wf
      ),
      selectedWorkfile:
        state.selectedWorkfile?.workfileId === workfileId
          ? { ...state.selectedWorkfile, ...updates }
          : state.selectedWorkfile,
    })),

  addWorkfile: (workfile) =>
    set((state) => ({
      workfiles: [...state.workfiles, workfile],
    })),

  removeWorkfile: (workfileId) =>
    set((state) => ({
      workfiles: state.workfiles.filter(
        (wf) => wf.workfileId !== workfileId
      ),
      selectedWorkfile:
        state.selectedWorkfile?.workfileId === workfileId
          ? null
          : state.selectedWorkfile,
    })),

  getWorkfilesByStatus: (status) => {
    return get().workfiles.filter((wf) => wf.status === status)
  },

  getWorkfileById: (workfileId) => {
    return get().workfiles.find((wf) => wf.workfileId === workfileId)
  },

  getWorkfileByOpportunityId: (opportunityId) => {
    return get().workfiles.find((wf) => wf.opportunityId === opportunityId)
  },

  getUpcomingWorkfiles: () => {
    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    return get().workfiles.filter((wf) => {
      if (!wf.estimatedCompletionDate) return false
      const completionDate = new Date(wf.estimatedCompletionDate)
      return completionDate <= in24Hours && completionDate >= now
    })
  },

  calculateCycleTime: (workfileId) => {
    const workfile = get().getWorkfileById(workfileId)
    if (!workfile || !workfile.inDate || !workfile.status) return null

    const inDate = new Date(workfile.inDate)
    const now = new Date()

    // If the workfile is completed, use the completion date
    if (workfile.status === WorkfileStatus.ReadyForPickup && workfile.repairCompletedDate) {
      const completionDate = new Date(workfile.repairCompletedDate)
      return Math.ceil((completionDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
    }

    // For in-progress workfiles, calculate against current date
    if (workfile.status === WorkfileStatus.InProgress || workfile.status === WorkfileStatus.Upcoming) {
      return Math.ceil((now.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
    }

    return null
  },

  getPartsReturnRate: () => {
    const workfiles = get().workfiles
    const totalParts = workfiles.reduce((sum, wf) => sum + (wf.parts?.total || 0), 0)
    const totalReturns = workfiles.reduce((sum, wf) => sum + (wf.parts?.returns || 0), 0)
    
    return totalParts > 0 ? (totalReturns / totalParts) * 100 : 0
  },

  getLastMinutePartsOrders: () => {
    const now = new Date()
    return get().workfiles.filter((wf) => {
      if (!wf.estimatedCompletionDate || !wf.parts?.lastOrderDate) return false
      
      const ecdDate = new Date(wf.estimatedCompletionDate)
      const lastOrderDate = new Date(wf.parts.lastOrderDate)
      const hoursDiff = (ecdDate.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60)
      
      return hoursDiff <= 72 && hoursDiff >= 24
    })
  },

  getTechWorkloadDistribution: () => {
    const workfiles = get().workfiles
    const techWorkload = new Map<string, number>()

    workfiles.forEach((wf) => {
      if (wf.assignedTech?.id && (wf.status === WorkfileStatus.InProgress || wf.status === WorkfileStatus.Upcoming)) {
        const currentHours = techWorkload.get(wf.assignedTech.id) || 0
        techWorkload.set(wf.assignedTech.id, currentHours + (wf.assignedTech.hoursAssigned || 0))
      }
    })

    return Array.from(techWorkload.entries()).map(([techId, hoursAssigned]) => ({
      techId,
      hoursAssigned,
    }))
  },

  checkWeatherImpact: (workfileId) => {
    const workfile = get().getWorkfileById(workfileId)
    return workfile?.weatherImpact?.affectsPaint || false
  },

  checkUploadDeadlineStatus: (workfileId) => {
    const workfile = get().getWorkfileById(workfileId)
    if (!workfile?.inDate) return { passed: false, remainingTime: null }

    const now = new Date()
    const checkInDate = new Date(workfile.inDate)
    const deadline = new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)
    const remainingTime = deadline.getTime() - now.getTime()

    return {
      passed: remainingTime <= 0,
      remainingTime: Math.max(0, remainingTime),
    }
  },

  autoAssignTech: (workfileId) => {
    const workload = get().getTechWorkloadDistribution()
    if (workload.length === 0) return

    // Get the workfile to calculate estimated hours
    const workfile = get().getWorkfileById(workfileId)
    const estimatedHours = workfile?.tasks?.reduce((total, task) => 
      total + (task.estimatedHours || 0), 0) || 0

    // Find tech with least hours
    const leastBusyTech = workload.reduce((min, current) => 
      current.hoursAssigned < min.hoursAssigned ? current : min
    )

    // Assign the workfile to the least busy tech
    get().updateWorkfile(workfileId, {
      assignedTech: {
        id: leastBusyTech.techId,
        name: `Tech ${leastBusyTech.techId}`, // We'll need to get the actual tech name from a tech management system
        hoursAssigned: estimatedHours,
      }
    })
  },

  startRepairWork: (workfileId) => {
    const workfile = get().getWorkfileById(workfileId)
    if (!workfile) return false

    // Validate workfile is in Upcoming status
    if (workfile.status !== WorkfileStatus.Upcoming) return false

    // Validate all required conditions are met
    const uploadDeadline = get().checkUploadDeadlineStatus(workfileId)
    if (!uploadDeadline.passed) return false

    // Ensure all required parts are ordered
    const hasUnorderedParts = workfile.parts?.list.some(
      (part: { partName: string; status: string }) => part.status === "To Order"
    )
    if (hasUnorderedParts) return false

    // Auto-assign tech if not already assigned
    if (!workfile.assignedTech) {
      get().autoAssignTech(workfileId)
    }

    // Update workfile status to In Progress
    get().updateWorkfile(workfileId, {
      status: WorkfileStatus.InProgress,
      lastUpdatedDate: new Date().toISOString(),
      repairStartDate: new Date().toISOString()
    })

    return true
  },

  moveToQC: (workfileId) => {
    const workfile = get().getWorkfileById(workfileId)
    if (!workfile) return false

    // Validate workfile is in In Progress status
    if (workfile.status !== WorkfileStatus.InProgress) return false

    // Validate all tasks are completed
    const hasIncompleteTasks = workfile.tasks?.length ? workfile.tasks.some(
      (task) => !task.status || task.status !== "completed"
    ) : false
    if (hasIncompleteTasks) return false

    // Validate pre and post scans are completed
    if (!workfile.preScanCompleted || !workfile.postScanCompleted) return false

    // Update workfile status to QC
    get().updateWorkfile(workfileId, {
      status: WorkfileStatus.QC,
      lastUpdatedDate: new Date().toISOString()
    })

    return true
  },

  moveToReadyForPickup: (workfileId) => {
    const workfile = get().getWorkfileById(workfileId)
    if (!workfile) return false

    // Validate workfile is in QC status
    if (workfile.status !== WorkfileStatus.QC) return false

    // Validate all QC checks are completed
    if (!workfile.isVoilComplete || !workfile.is4CornersComplete || !workfile.qcCompleted) {
      return false
    }

    // Update workfile status to Ready for Pickup
    get().updateWorkfile(workfileId, {
      status: WorkfileStatus.ReadyForPickup,
      lastUpdatedDate: new Date().toISOString(),
      repairCompletedDate: new Date().toISOString()
    })

    return true
  },

  archiveWorkfile: (workfileId) => {
    const workfile = get().getWorkfileById(workfileId)
    if (!workfile) return false

    // Validate workfile is in Ready for Pickup status
    if (workfile.status !== WorkfileStatus.ReadyForPickup) return false

    // Calculate final cycle time
    const cycleTime = get().calculateCycleTime(workfileId)

    // Update workfile status to Archived
    get().updateWorkfile(workfileId, {
      status: WorkfileStatus.Archived,
      lastUpdatedDate: new Date().toISOString(),
      vehicleOutDate: new Date().toISOString(),
      cycleTime: cycleTime || undefined
    })

    return true
  },
}))
