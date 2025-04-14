import apiService from '@/app/utils/apiService'
import { User } from 'next-auth'

interface LoginCredentials {
  email: string
  password: string
}

interface AuthResponse {
  userId: string
  token: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  errorMessage: string
  tenantId: string
  tokenExpiration: string
}

interface RegisterCredentials {
  tenantId: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  ssoToken: string
}

interface RegisterResponse {
  userId: string
  token: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  errorMessage: string
  tokenExpiration: string
}

export const login = async (credentials: LoginCredentials): Promise<(User & {
    firstName: string
    lastName: string
    roles: string[]
    token: string
    tokenExpiration: string
    tenantId: string
}) | null> => {
    if (!credentials?.email || !credentials?.password) {
        return null
    }
    console.log('Login credentials:', credentials)
    try {
        const response = await apiService.post<AuthResponse>('/Authorization/Login', {
            email: credentials.email,
            password: credentials.password,
        })

        if (response.data) {
            if (response.data.errorMessage) {
                console.error('Login error:', response.data.errorMessage)
                return null
            }
            console.log('Login response:', response.data)

            return {
                id: response.data.userId, // NextAuth User interface requires 'id'
                userId: response.data.userId,
                name: `${response.data.firstName} ${response.data.lastName}`,
                email: response.data.email,
                roles: response.data.roles,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                tenantId: response.data.tenantId,
                token: response.data.token,
                tokenExpiration: response.data.tokenExpiration,
                image: undefined
            }
        }
        return null
    } catch (error) {
        console.error('Authentication error:', error)
        return null
    }
}

export const register = async (credentials: RegisterCredentials): Promise<RegisterResponse | null> => {
  if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
    return null
  }

  try {
    const response = await apiService.post<RegisterResponse>('/Authorization/Register', {
      tenantId: credentials.tenantId,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
      ssoToken: credentials.ssoToken
    })

    if (response.data) {
      if (response.data.errorMessage) {
        console.error('Registration error:', response.data.errorMessage)
        return null
      }
      console.log('Registration response:', response.data)
      return response.data
    }
    return null
  } catch (error) {
    console.error('Registration error:', error)
    return null
  }
}