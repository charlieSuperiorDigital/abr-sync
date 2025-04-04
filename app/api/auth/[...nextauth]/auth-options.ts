import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { login } from '../../functions/authentication'

// Extend the built-in session and user types
declare module 'next-auth' {
  interface Session {
    user: {
      userId: string
      email: string
      firstName: string
      lastName: string
      roles: string[]
      tenant: string
      token: string
      tokenExpiration: string
      image?: string | null
    }
  }

  interface User {
    firstName: string
    lastName: string
    roles: string[]
    tokenExpiration: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null
        return await login(credentials)
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.roles = user.roles
        token.token = user.token
        token.tokenExpiration = user.tokenExpiration
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId as string
        session.user.email = token.email as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.roles = token.roles as string[]
        session.user.token = token.token as string
        session.user.tokenExpiration = token.tokenExpiration as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
