import { create } from 'zustand'
import { User } from '../types/user'
import { mockUsers } from '../mocks/users.mock'

interface UserStore {
  users: User[]
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
  getUsersByRole: (role: string) => User[]
  getActiveUsers: () => User[]
  updateUser: (updatedUser: User) => void
  addUser: (user: User) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: mockUsers,
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  getUsersByRole: (role) => {
    return get().users.filter(user => user.role === role)
  },

  getActiveUsers: () => {
    return get().users.filter(user => user.isActive)
  },

  updateUser: (updatedUser) => {
    
    set((state) => ({
      users: state.users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    }))
  },

  addUser: (user) => 
    set((state) => ({
      users: [...state.users, user]
    })),
}))
