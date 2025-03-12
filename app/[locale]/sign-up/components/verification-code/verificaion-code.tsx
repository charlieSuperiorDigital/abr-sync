'use client'

import { CustomButton } from '@/components/custom-components/buttons/custom-button'
import { CustomInput } from '@/components/custom-components/inputs/custom-input'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTenantRegistration } from '../../context/tenant-registration.context'

const verificationSchema = z.object({
  code: z.string().min(1, { message: 'Verification code is required' }),
})

type VerificationFormData = z.infer<typeof verificationSchema>

export default function EmailVerification() {
  const [isResending, setIsResending] = useState(false)
  const { setActiveTab } = useTenantRegistration()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = (data: VerificationFormData) => {
    console.log('Submitting code:', data.code)
    setActiveTab(2)
  }

  const handleResend = () => {
    setIsResending(true)
    // Handle resend logic here
    console.log('Resending code...')
    setTimeout(() => setIsResending(false), 2000) // Simulate API call
  }

  const handleGoBack = () => {
    setActiveTab(0)
    console.log('Going back...')
  }

  return (
    <div className="w-full max-w-[630px] mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-h2 font-semibold tracking-tight">
            Email Verification
          </h1>
          <p className="">Please enter the code received by email.</p>
        </div>

        <div className="space-y-4">
          <CustomInput
            label="Verification Code"
            {...register('code')}
            placeholder="Enter verification code"
            className="text-lg tracking-wider"
            error={errors.code?.message}
          />

          <div className="text-sm">
            <span className="text-muted-foreground">Didn&apos;t get it?</span>{' '}
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:underline font-medium"
              disabled={isResending}
            >
              {isResending ? 'Resending...' : 'Resend'}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <CustomButton type="button" variant="ghost" onClick={handleGoBack}>
            Go back
          </CustomButton>
          <CustomButton type="submit">Continue</CustomButton>
        </div>
      </form>
    </div>
  )
}
