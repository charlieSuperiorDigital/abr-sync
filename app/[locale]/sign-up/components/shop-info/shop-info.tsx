'use client'

import type React from 'react'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { CustomButton } from '@/components/custom-components/buttons/custom-button'
import { CustomInput } from '@/components/custom-components/inputs/custom-input'
import { ShopInfoFormData, shopInfoSchema } from './shop-info-schema'
import { useTenantRegistration } from '../../context/tenant-registration.context'

export default function ShopInfo() {
  const { setActiveTab } = useTenantRegistration()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShopInfoFormData>({
    resolver: zodResolver(shopInfoSchema),
    defaultValues: {
      shopName: '',
      shopAddress: '',
      shopPhoneNo: '',
      shopEmail: '',
    },
  })

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('File must be an image')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        setValue('shopLogo', file)
      }
      reader.readAsDataURL(file)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('shopPhoneNo', formatted)
  }

  const onSubmit = (data: ShopInfoFormData) => {
    console.log('Form data:', data)
    setActiveTab(3)
  }

  const handleGoBack = () => {
    setActiveTab(1)
    console.log('Going back...')
  }

  return (
    <div className="w-full max-w-[630px] mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Shop Info</h1>
        </div>

        {/* Logo Upload */}
        <div className="flex items-center space-x-4">
          <p>Shop Logo</p>
          <div className="relative">
            <label
              htmlFor="logo-upload"
              className="block w-24 h-24 rounded-full bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
            >
              {logoPreview ? (
                <Image
                  src={logoPreview || '/placeholder.svg'}
                  alt="Shop logo preview"
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#E3E3E3] rounded-full">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <CustomInput
            label="Shop Name"
            {...register('shopName')}
            placeholder="Enter shop name"
            error={errors.shopName?.message}
          />

          <CustomInput
            label="Shop Address"
            {...register('shopAddress')}
            placeholder="Enter shop address"
            error={errors.shopAddress?.message}
          />

          <CustomInput
            label="Shop Phone No"
            {...register('shopPhoneNo')}
            placeholder="(XXX) XXX-XXXX"
            onChange={handlePhoneChange}
            error={errors.shopPhoneNo?.message}
          />

          <CustomInput
            label="Shop Email"
            {...register('shopEmail')}
            type="email"
            placeholder="Enter shop email"
            error={errors.shopEmail?.message}
          />
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
