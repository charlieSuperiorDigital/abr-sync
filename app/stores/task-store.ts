import { create } from 'zustand'
import { Task, TaskComment, TaskAttachment } from '../types/task'
import { mockTasks } from '../mocks/tasks.mock'

interface TaskStore {
  tasks: Task[]
  selectedTask: Task | null
  
  // Basic CRUD operations
  setSelectedTask: (task: Task | null) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  addTask: (task: Task) => void
  removeTask: (taskId: string) => void
  
  // Task retrieval functions
  getTaskById: (taskId: string) => Task | undefined
  getTasksByStatus: (status?: Task['status']) => Task[]
  getTasksByPriority: (priorityText: string) => Task[]
  getTasksByAssignee: (assigneeId: string) => Task[]
  getOverdueTasks: () => Task[]
  getUpcomingTasks: (daysAhead: number) => Task[]
  
  // Entity-specific task functions
  getTasksByOpportunityId: (opportunityId: string) => Task[]
  getTasksByWorkfileId: (workfileId: string) => Task[]
  addTaskToOpportunity: (opportunityId: string, task: Omit<Task, 'id' | 'createdDate'>) => void
  addTaskToWorkfile: (workfileId: string, task: Omit<Task, 'id' | 'createdDate'>) => void
  
  // Workflow transition functions
  convertOpportunityTaskToWorkfile: (taskId: string, workfileId: string) => void
  getRelatedWorkfileTasks: (opportunityId: string) => { originalTask: Task; workfileTasks: Task[] }[]
  
  // Task management functions
  assignTask: (taskId: string, assigneeId: string) => void
  startTask: (taskId: string) => void
  completeTask: (taskId: string) => void
  archiveTask: (taskId: string) => void
  reopenTask: (taskId: string) => void
  addComment: (taskId: string, comment: Omit<TaskComment, 'id' | 'createdDate'>) => void
  addAttachment: (taskId: string, attachment: Omit<TaskAttachment, 'uploadedDate'>) => void
  
  // Handle total loss transition
  handleTotalLoss: (opportunityId: string) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: mockTasks.map(task => ({ ...task, status: 'open' as const })),
  selectedTask: null,

  setSelectedTask: (task) => set({ selectedTask: task }),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              lastUpdatedDate: new Date().toISOString(),
            }
          : task
      ),
      selectedTask:
        state.selectedTask?.id === taskId
          ? {
              ...state.selectedTask,
              ...updates,
              lastUpdatedDate: new Date().toISOString(),
            }
          : state.selectedTask,
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          status: 'open',
          createdDate: new Date().toISOString().slice(0, 10),
          lastUpdatedDate: new Date().toISOString(),
        },
      ],
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      selectedTask:
        state.selectedTask?.id === taskId ? null : state.selectedTask,
    })),

  getTaskById: (taskId) => {
    const state = get()
    return state.tasks.find((task) => task.id === taskId)
  },

  getTasksByStatus: (status) => {
    const state = get()
    return status
      ? state.tasks.filter((task) => task.status === status)
      : state.tasks
  },

  getTasksByPriority: (priorityText) => {
    const state = get()
    return state.tasks.filter(
      (task) => task.priority.text.toLowerCase() === priorityText.toLowerCase()
    )
  },

  getTasksByAssignee: (assigneeId) => {
    const state = get()
    return state.tasks.filter((task) => task.assignedTo === assigneeId)
  },

  getOverdueTasks: () => {
    const state = get()
    const now = new Date()
    return state.tasks.filter((task) => {
      const dueDate = new Date(task.due)
      return (
        task.status !== 'completed' &&
        task.status !== 'archived' &&
        dueDate < now
      )
    })
  },

  getUpcomingTasks: (daysAhead) => {
    const state = get()
    const now = new Date()
    const futureDate = new Date(now)
    futureDate.setDate(now.getDate() + daysAhead)

    return state.tasks.filter((task) => {
      const dueDate = new Date(task.due)
      return (
        task.status !== 'completed' &&
        task.status !== 'archived' &&
        dueDate >= now &&
        dueDate <= futureDate
      )
    })
  },

  // Entity-specific task functions
  getTasksByOpportunityId: (opportunityId) => {
    const state = get()
    return state.tasks.filter((task) => task.relatedTo === `opportunity:${opportunityId}`)
  },

  getTasksByWorkfileId: (workfileId) => {
    const state = get()
    return state.tasks.filter((task) => task.relatedTo === `workfile:${workfileId}`)
  },

  addTaskToOpportunity: (opportunityId, task) => {
    const state = get()
    state.addTask({
      ...task,
      id: crypto.randomUUID(),
      relatedTo: `opportunity:${opportunityId}`,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  addTaskToWorkfile: (workfileId, task) => {
    const state = get()
    state.addTask({
      ...task,
      id: crypto.randomUUID(),
      relatedTo: `workfile:${workfileId}`,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  convertOpportunityTaskToWorkfile: (taskId, workfileId) => {
    const state = get()
    const task = state.getTaskById(taskId)
    if (!task || !task.relatedTo.startsWith('opportunity:')) return

    state.updateTask(taskId, {
      relatedTo: `workfile:${workfileId}`,
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  getRelatedWorkfileTasks: (opportunityId) => {
    const state = get()
    const opportunityTasks = state.getTasksByOpportunityId(opportunityId)
    return opportunityTasks.map(task => {
      const workfileId = task.relatedTo.replace('workfile:', '')
      const workfileTasks = state.getTasksByWorkfileId(workfileId)
      return { originalTask: task, workfileTasks }
    })
  },

  assignTask: (taskId, assigneeId) => {
    const state = get()
    state.updateTask(taskId, {
      assignedTo: assigneeId,
    })
  },

  startTask: (taskId) => {
    const state = get()
    state.updateTask(taskId, {
      status: 'in_progress',
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  completeTask: (taskId) => {
    const state = get()
    state.updateTask(taskId, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  archiveTask: (taskId) => {
    const state = get()
    state.updateTask(taskId, {
      status: 'archived',
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  reopenTask: (taskId) => {
    const state = get()
    state.updateTask(taskId, {
      status: 'open',
      completedDate: undefined,
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  addComment: (taskId, comment) => {
    const state = get()
    const task = state.getTaskById(taskId)
    if (!task) return

    state.updateTask(taskId, {
      comments: [
        ...(task.comments || []),
        {
          ...comment,
          id: crypto.randomUUID(),
          createdDate: new Date().toISOString(),
        },
      ],
    })
  },

  addAttachment: (taskId, attachment) => {
    const state = get()
    const task = state.getTaskById(taskId)
    if (!task) return

    state.updateTask(taskId, {
      attachments: [
        ...(task.attachments || []),
        {
          ...attachment,
          uploadedDate: new Date().toISOString(),
        },
      ],
    })
  },

  handleTotalLoss: (opportunityId) => {
    const state = get()
    const tasks = state.getTasksByOpportunityId(opportunityId)
    
    tasks.forEach(task => {
      state.updateTask(task.id, {
        priority: {
          variant: 'danger',
          text: 'Urgent'
        },
        warningMessage: 'Total Loss - Requires immediate attention'
      })
    })
  },
}))
