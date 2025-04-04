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
  addTaskToOpportunity: (opportunityId: string, task: Omit<Task, 'id' | 'createdAt'>) => void
  addTaskToWorkfile: (workfileId: string, task: Omit<Task, 'id' | 'createdAt'>) => void
  
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
  tasks: mockTasks.map(task => ({ ...task })),
  selectedTask: null,

  setSelectedTask: (task) => set({ selectedTask: task }),

  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          status: task.status || 'open',
          lastUpdatedDate: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ]
    })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              lastUpdatedDate: new Date().toISOString()
            }
          : task
      ),
      selectedTask:
        state.selectedTask?.id === taskId
          ? {
              ...state.selectedTask,
              ...updates,
              lastUpdatedDate: new Date().toISOString()
            }
          : state.selectedTask,
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

  getTasksByDueDate: (date: string) => {
    const state = get()
    return state.tasks.filter((task) => {
      if (!task.dueDateTime) return false
      const taskDate = task.dueDateTime.split('T')[0]
      return taskDate === date
    })
  },

  getTasksByPriority: (priorityText) => {
    const state = get()
    return state.tasks.filter(
      (task) => {
        if (typeof task.priority === 'string') return false
        return task.priority.text.toLowerCase() === priorityText.toLowerCase()
      }
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
      if (!task.dueDateTime) return false
      const dueDate = new Date(task.dueDateTime)
      return dueDate < now && task.status !== 'completed'
    })
  },

  getUpcomingTasks: (daysAhead) => {
    const state = get()
    const now = new Date()
    const future = new Date()
    future.setDate(now.getDate() + daysAhead)
    
    return state.tasks.filter((task) => {
      if (!task.dueDateTime) return false
      const dueDate = new Date(task.dueDateTime)
      return dueDate >= now && dueDate <= future && task.status !== 'completed'
    })
  },

  // Entity-specific task functions
  getTasksByOpportunityId: (opportunityId) => {
    const state = get()
    return state.tasks.filter((task) => 
      task.relatedTo?.some(relation => relation.type === 'opportunity' && relation.id === opportunityId)
    )
  },

  getTasksByWorkfileId: (workfileId) => {
    const state = get()
    return state.tasks.filter((task) => 
      task.relatedTo?.some(relation => relation.type === 'workfile' && relation.id === workfileId)
    )
  },

  addTaskToOpportunity: (opportunityId, task) => {
    const state = get()
    state.addTask({
      ...task,
      id: crypto.randomUUID(),
      relatedTo: [{
        type: 'opportunity',
        id: opportunityId
      }],
      createdAt: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  addTaskToWorkfile: (workfileId, task) => {
    const state = get()
    state.addTask({
      ...task,
      id: crypto.randomUUID(),
      relatedTo: [{
        type: 'workfile',
        id: workfileId
      }],
      createdAt: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  convertOpportunityTaskToWorkfile: (taskId, workfileId) => {
    const state = get()
    const task = state.getTaskById(taskId)
    if (!task || !task.relatedTo?.some(relation => relation.type === 'opportunity')) return

    state.updateTask(taskId, {
      relatedTo: task.relatedTo?.map(relation => 
        relation.type === 'opportunity' ? { type: 'workfile', id: workfileId } : relation
      ),
      lastUpdatedDate: new Date().toISOString(),
    })
  },

  getRelatedWorkfileTasks: (opportunityId) => {
    const state = get()
    const opportunityTasks = state.getTasksByOpportunityId(opportunityId)
    return opportunityTasks.map(task => {
      const workfileId = task.relatedTo?.find(relation => relation.type === 'workfile')?.id
      const workfileTasks = state.getTasksByWorkfileId(workfileId || '')
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
