import 'next-auth'

declare module 'next-auth' {
  export interface Session {
    user: {
      userId: string
      token: string
      email: string
      firstName: string
      lastName: string
      roles: string[]
      tenantId: string
      tokenExpiration: string
      image?: string | null
    }
  }
  export interface User {
    userId: string
    token: string
    email: string
    firstName: string
    lastName: string
    roles: string[]
    tenantId: string
    tokenExpiration: string
    errorMessage?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    email: string
    firstName: string
    lastName: string
    roles: string[]
    token: string
    tenantId: string
    tokenExpiration: string
  }
}
