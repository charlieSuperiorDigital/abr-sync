import React from 'react'
import { TenantRegistrationProvider } from './context/tenant-registration.context'
import RegistrationTenant from './components/registration-tenant'

const page = () => {
  return (
    <TenantRegistrationProvider>
      <RegistrationTenant />
    </TenantRegistrationProvider>
  )
}

export default page
