'use client'
import { useTenantRegistration } from '../context/tenant-registration.context'
import AccountInfo from './account-info/account-info'
import EmailVerification from './verification-code/verificaion-code'
import ShopInfo from './shop-info/shop-info'
import CCCIntegration from './ccc-integration/ccc-integration'
import PaymentDetails from './payment/payment-details'
import Stepper from '@/components/custom-components/stepper/stepper'

const steps = [
  'Account Info',
  'Email Verification',
  'Shop Info',
  'CCC Integration',
  'Payment Details',
]

const RegistrationTenant = () => {
  const { activeTab, setActiveTab } = useTenantRegistration()

  const renderStep = () => {
    switch (activeTab) {
      case 0:
        return <AccountInfo />
      case 1:
        return <EmailVerification />
      case 2:
        return <ShopInfo />
      case 3:
        return <CCCIntegration />
      case 4:
        return <PaymentDetails />
      default:
        return <AccountInfo />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full p-6">
        <Stepper activeTab={activeTab} length={steps.length} />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-[663px] p-6">{renderStep()}</div>
      </div>
    </div>
  )
}

export default RegistrationTenant
