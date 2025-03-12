import { NextLayoutProps } from 'next'
import type { ReactNode } from 'react'

declare module 'next' {
  export interface NextLayoutProps {
    children: ReactNode
    params: Promise<{
      locale: string
    }>
  }
}

declare module 'next/app' {
  export interface AppLayoutProps<P = {}> extends NextLayoutProps {}
}
