'use client'

import React, { ReactNode, useContext, useState, createContext } from 'react'
import { AccountFormValues } from '../components/account-info/account-info-schema'

interface TenantRegistratationContextProps {
  activeTab: number
  setActiveTab: (index: number) => void
  accountInfo: AccountFormValues | null
  setAccountInfo: (info: AccountFormValues) => void
}

export const TenantRegistrationContext = createContext<
  TenantRegistratationContextProps | undefined
>(undefined)

export const TenantRegistrationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [accountInfo, setAccountInfo] = useState<AccountFormValues | null>(null)

  const contextValue: TenantRegistratationContextProps = {
    activeTab,
    setActiveTab,
    accountInfo,
    setAccountInfo,
  }
  return (
    <TenantRegistrationContext.Provider value={contextValue}>
      {children}
    </TenantRegistrationContext.Provider>
  )
}
export const useTenantRegistration = () => {
  const context = useContext(TenantRegistrationContext)
  if (!context) {
    throw new Error(
      'TenantRegistrationContext must be used within a ClientRegistrationProvider'
    )
  }
  return context
}
