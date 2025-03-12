'use client'

import { CustomButton } from '@/components/custom-components/buttons/custom-button'

export default function PlatformFees() {
  const handleGoBack = () => {
    console.log('Going back...')
  }

  const handleContinue = () => {
    console.log('Continuing...')
  }

  return (
    <div className="w-full max-w-[630px] mx-auto p-6">
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold tracking-tight">Platform Fees</h1>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Location Fee</h2>
            <span className="text-lg">$x per location / mo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Location fee is automatic based on the locations.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Reports Chat</h2>
            <span className="text-lg">$0</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You will automatically have a one-month trial. Afterward, you can
            choose to continue manually.
          </p>
        </div>

        <div className="flex justify-between items-center pt-4">
          <CustomButton type="button" variant="ghost" onClick={handleGoBack}>
            Go back
          </CustomButton>
          <CustomButton type="button" onClick={handleContinue}>
            Continue
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
