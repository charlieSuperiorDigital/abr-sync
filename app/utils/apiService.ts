import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/auth-options'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' 

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  context?: GetServerSidePropsContext
}

interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
}

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        const extendedConfig = config as ExtendedAxiosRequestConfig
        const { token, tokenExpiration } = await this.getAuthToken(extendedConfig.context) || {}
        
        if (token) {
          // Check if token is expired
          if (tokenExpiration && new Date(tokenExpiration) <= new Date()) {
            console.warn('Token expired, user needs to re-authenticate')
            return Promise.reject(new Error('Token expired'))
          }
          
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  private async getAuthToken(
    context?: GetServerSidePropsContext
  ): Promise<{ token: string; tokenExpiration: string } | undefined> {
    if (typeof window !== 'undefined') {
      const session = await getSession()
      return session?.user ? {
        token: session.user.token,
        tokenExpiration: session.user.tokenExpiration
      } : undefined
    } else if (context) {
      const session = await getServerSession(
        context.req,
        context.res,
        authOptions
      )
      return session?.user ? {
        token: session.user.token,
        tokenExpiration: session.user.tokenExpiration
      } : undefined
    }
    return undefined
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    config: ExtendedAxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { data, status, statusText }: AxiosResponse<T> =
        await this.api.request({
          method,
          url,
          ...config,
        })

      return { data, status, statusText }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          data: error.response.data as T,
          status: error.response.status,
          statusText: error.response.statusText,
        }
      }
      throw error
    }
  }

  public async get<T>(
    url: string,
    config: ExtendedAxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, config)
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config: ExtendedAxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, { ...config, data })
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config: ExtendedAxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, { ...config, data })
  }

  public async delete<T>(
    url: string,
    config: ExtendedAxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, config)
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config: ExtendedAxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, { ...config, data })
  }
}

const apiService = new ApiService()
export default apiService
