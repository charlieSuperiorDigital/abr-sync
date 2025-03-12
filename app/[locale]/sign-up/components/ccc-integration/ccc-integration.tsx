'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { CustomButton } from '@/components/custom-components/buttons/custom-button'
import { CustomInput } from '@/components/custom-components/inputs/custom-input'
import {
  CCCIntegrationFormData,
  cccIntegrationSchema,
} from './ccc-integration-schema'
import { useTenantRegistration } from '../../context/tenant-registration.context'

export default function CCCIntegration() {
  const { setActiveTab } = useTenantRegistration()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CCCIntegrationFormData>({
    resolver: zodResolver(cccIntegrationSchema),
    defaultValues: {
      apiKey: '',
      adminEmail: '',
      adminPassword: '',
    },
  })

  const onSubmit = (data: CCCIntegrationFormData) => {
    console.log('Form data:', data)
    setActiveTab(4)
    // Handle form submission
  }

  const handleGoBack = () => {
    setActiveTab(2)
    console.log('Going back...')
  }

  return (
    <div className="w-full max-w-[630px] mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-h3 font-semibold tracking-tight">
            CCC Integration
          </h1>
          <p className="text-sm text-muted-foreground">
            Integration will take up to 5 minutes.{' '}
            <Link
              href="/learn-more-ccc"
              className="text-primary underline-offset-4 hover:underline"
            >
              Learn more about CCC integration
            </Link>
          </p>
        </div>

        <div className="space-y-4">
          <CustomInput
            label="CCC API Key"
            {...register('apiKey')}
            placeholder="Enter API Key"
            error={errors.apiKey?.message}
          />

          <CustomInput
            label="Admin Email"
            {...register('adminEmail')}
            type="email"
            placeholder="Enter admin email"
            error={errors.adminEmail?.message}
          />

          <div className="relative">
            <CustomInput
              label="Admin Password"
              {...register('adminPassword')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter admin password"
              error={errors.adminPassword?.message}
            />
          </div>
        </div>

        <div className="rounded-lg bg-[#E3E3E3] p-4">
          <p className="text-sm text-muted-foreground">
            You&apos;ll have the option to add, edit, or remove locations on
            your shop admin locations dashboard.
          </p>
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
