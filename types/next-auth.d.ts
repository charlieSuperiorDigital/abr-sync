import 'next-auth'

declare module 'next-auth' {
  export interface Session {
    user: {
      id: string
      token: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }

  export interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    token: string
    role: string
  }
}
