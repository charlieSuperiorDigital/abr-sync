'use client'

import * as React from 'react'
import { useState, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { UserFormData, userFormSchema, UserRoleOptions, LanguageOptions, NotificationTypeOptions } from './schema'
import { CustomInput } from '../inputs/custom-input'
import type { RegisterResponse } from '@/app/api/functions/authentication'
import { useRegister } from '@/app/api/hooks/useRegister'
import { useUpdateUser } from '@/app/api/hooks/useUpdateUser'
import { useFileUpload } from '@/app/api/hooks/useFileUpload'

import { CustomSelect } from '../selects/custom-select'
import { CustomButtonSelect, CustomButtonSelectField } from '../selects/custom-button-select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/app/stores/user-store'
import { User, ModuleAccess, CommunicationAccess, NotificationCategory, Language, NotificationType, Location } from '@/app/types/user'
import { Plus, Upload, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserCircle2 } from 'lucide-react'
import { CustomMaskedInput } from '../inputs/custom-masked-input'
import { useTenant } from '@/app/context/TenantProvider'
import Image from 'next/image'

interface NewUserModalProps {
  children: React.ReactNode
  title: string
}

export function NewUserModal({
  children,
  title
}: NewUserModalProps) {
  const { tenant } = useTenant()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('User')
  const addUser = useUserStore((state) => state.addUser)
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Profile picture state
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  
  // File upload hook
  const { uploadFile, isUploading, error: uploadError } = useFileUpload({
    onSuccess: (data) => {
      console.log('Profile picture uploaded successfully:', data)
      setProfilePictureUrl(data.fileUrl)
    },
    onError: (error) => {
      console.error('Profile picture upload failed:', error)
    }
  })

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  const validationMessage = useTranslations('Validation')
  

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: undefined,
      hourlyRate: 0,
      isActive: true,
      preferredLanguage: Language.English,
      moduleAccess: [],
      communicationAccess: [],
      notificationType: undefined,
      notificationCategories: [],
      locations: []
    }
  })

  const { register: registerUser } = useRegister()
  const { updateUser } = useUpdateUser()

  const onSubmit = async (data: UserFormData) => {
    console.log('Form submitted with data:', data)
    try {
      if (!tenant?.id) {
        throw new Error('No tenant selected. Please try again.')
      }
      setIsLoading(true)

      // Upload profile picture if selected
      let profilePictureURL = '';
      if (logoFile) {
        try {
          // Use user's name as the namePrefix for the file
          const namePrefix = data.fullName.replace(/\s+/g, '-').toLowerCase() || 'user-profile';
          console.log(`Uploading profile picture with prefix: ${namePrefix}`);
          
          const uploadResult = await uploadFile(logoFile, namePrefix);
          
          if (uploadResult) {
            profilePictureURL = uploadResult.fileUrl;
            console.log(`Profile picture uploaded successfully. URL: ${profilePictureURL}`);
          } else {
            console.warn('Profile picture upload returned no result');
          }
        } catch (uploadError) {
          console.error('Failed to upload profile picture:', uploadError);
          // Continue with user creation even if profile picture upload fails
        }
      }

      // Split full name into first and last name
      const nameParts = data.fullName.trim().split(/\s+/)
      if (nameParts.length < 2) {
        throw new Error('Please enter both first and last name')
      }
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ')

      // Validate name parts
      if (!firstName || !lastName) {
        throw new Error('Both first and last name are required')
      }

      // Register the user first
      console.log('Attempting to register user with:', { firstName, lastName, email: data.email, role: data.role })
      let registerResponse: RegisterResponse
      try {
        const registerResult = await new Promise<RegisterResponse>((resolve, reject) => {
          registerUser(
            {
              tenantId: tenant?.id,
              firstName,
              lastName,
              email: data.email,
              password: data.password,
              confirmPassword: data.password,
              ssoToken: '',
              roles: [data.role] // Convert the single role to an array
            },
            {
              onSuccess: (data) => resolve(data),
              onError: (error) => reject(error)
            }
          )
        })

        if (!registerResult || !registerResult.userId) {
          throw new Error('Registration failed - no user ID returned')
        }

        registerResponse = registerResult
        console.log('User registered successfully:', registerResponse)
      } catch (error) {
        console.error('Error registering user:', error)
        throw new Error('Failed to register user. Please try again.')
      }

      // Update the user with additional information
      try {
        if (!registerResponse?.userId) {
          throw new Error('User registration did not return a user ID')
        }

        // The updateUser hook expects a different parameter structure
        const updateResult = await new Promise<User>((resolve, reject) => {
          updateUser(
            {
              userId: registerResponse.userId,
              data: {
                firstName,
                lastName,
                email: data.email,
                preferredLanguage: data.preferredLanguage,
                phoneNumber: data.phoneNumber,
                hourlyRate: data.hourlyRate,
                modules: data.moduleAccess?.reduce((acc, curr) => acc | Number(curr), 0) || 0,
                communication: data.communicationAccess?.reduce((acc, curr) => acc | Number(curr), 0) || 0,
                notificationType: Number(data.notificationType || 0),
                notification: data.notificationCategories?.reduce((acc, curr) => acc | Number(curr), 0) || 0,
                profilePicture: profilePictureURL || undefined, // Add the profile picture URL
              }
            },
            {
              onSuccess: (data) => resolve(data),
              onError: (error) => reject(error)
            }
          )
        })

        console.log('User updated successfully with additional info:', updateResult)
      } catch (error) {
        console.error('Error updating user with additional info:', error)
        // Continue even if update fails, as the user has been created
      }

      // Log success
      console.log('User created and updated successfully')

      // Reset form
      reset()
      setIsOpen(false)
      setIsLoading(false)
    } catch (error) {
      console.error('Error creating user:', error)
      setIsLoading(false)
      // Re-throw the error to trigger form error state
      throw error
    }
  }

  const handleLogoUpload = () => {
    // Trigger the hidden file input
    console.log('Logo upload triggered');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Store the file for later upload
    setLogoFile(file);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    
    // In a real implementation, you would upload the file to your server here
    console.log('File selected:', file.name, file.type, file.size);
  };
  
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)
    return () => window.removeEventListener('keydown', handleEscapeKey)
  }, [])

  return (
    <>
      <div className="flex items-center h-full">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
        >
          {children}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 ">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleSubmit(
                onSubmit,
                (formErrors) => {
                  console.log('Form validation errors:', formErrors)
                }
              )} 
              className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {/* Profile picture preview or placeholder */}
                    <div className="relative" style={{ cursor: 'pointer' }}>
                      <div onClick={handleLogoUpload} className="flex items-center justify-center w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        {logoPreview ? (
                          <>
                            <Image 
                              src={logoPreview} 
                              alt="Profile picture preview" 
                              width={80} 
                              height={80} 
                              className="object-cover w-full h-full"
                            />
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveLogo();
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3"
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <Upload size={24} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    {uploadError !== null && <p className="text-xs text-red-500 mt-1">Upload failed. Please try again.</p>}
                  </div>

                  <CustomInput
                    label={t('full-name')}
                    type="text"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />

                  <CustomInput
                    label={t('email')}
                    type="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <CustomMaskedInput
                        label={t('phone')}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.phoneNumber?.message}
                      />
                    )}
                  />

                  <CustomInput
                    label={t('password')}
                    type="password"
                    error={errors.password?.message}
                    {...register('password')}
                  />

                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        placeholder={t('role')}
                        options={UserRoleOptions}
                        value={field.value ? [field.value] : []}
                        onChange={(values) => field.onChange(values[0])}
                        
                      />
                    )}
                  />

                  <CustomInput
                    label={t('hourly-rate')}
                    type="number"
                    min={0}
                    step={0.01}
                    {...register('hourlyRate', { valueAsNumber: true })}
                    error={errors.hourlyRate?.message}
                  />

                  <div className="space-y-2">
                    <Label className="font-semibold">Program Language</Label>
                    <Controller
                      name="preferredLanguage"
                      control={control}
                      render={({ field }) => (
                        <CustomButtonSelectField
                          field={field}
                          options={LanguageOptions}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Modules</Label>
                    <Controller
                      name="moduleAccess"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(ModuleAccess).map((module) => (
                            <div key={module} className="flex items-center space-x-2">
                              <Checkbox
                                id={`module-${module}`}
                                checked={field.value.includes(module)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, module]
                                    : field.value.filter((m: ModuleAccess) => m !== module)
                                  field.onChange(newValue)
                                }}
                              />
                              <Label htmlFor={`module-${module}`}>{module}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">{t('communication.title')}</Label>
                    <Controller
                      name="communicationAccess"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(CommunicationAccess).map((access) => (
                            <div key={access} className="flex items-center space-x-2">
                              <Checkbox
                                id={`communication-${access}`}
                                checked={field.value.includes(access)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, access]
                                    : field.value.filter((a: CommunicationAccess) => a !== access)
                                  field.onChange(newValue)
                                }}
                              />
                              <Label htmlFor={`communication-${access}`}>{access}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex flex-row space-x-4">
                    <Label className="font-semibold">{t('notifications.title')}</Label>
                    <Controller
                      name="notificationType"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-sms"
                              checked={field.value === NotificationType.SMS || field.value === NotificationType.Both}
                              onCheckedChange={(checked) => {
                                const emailChecked = field.value === NotificationType.Email || field.value === NotificationType.Both
                                if (checked) {
                                  field.onChange(emailChecked ? NotificationType.Both : NotificationType.SMS)
                                } else {
                                  field.onChange(emailChecked ? NotificationType.Email : '')
                                }
                              }}
                            />
                            <Label htmlFor="notification-sms">SMS</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-email"
                              checked={field.value === NotificationType.Email || field.value === NotificationType.Both}
                              onCheckedChange={(checked) => {
                                const smsChecked = field.value === NotificationType.SMS || field.value === NotificationType.Both
                                if (checked) {
                                  field.onChange(smsChecked ? NotificationType.Both : NotificationType.Email)
                                } else {
                                  field.onChange(smsChecked ? NotificationType.SMS : '')
                                }
                              }}
                            />
                            <Label htmlFor="notification-email">Email</Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Controller
                      name="notificationCategories"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-all"
                              checked={field.value.includes(NotificationCategory.All)}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? [NotificationCategory.All] : [])
                              }}
                            />
                            <Label htmlFor="notification-all">All</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-workfile"
                              checked={field.value.includes(NotificationCategory.WorkfileECD)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value.filter((cat: NotificationCategory) => cat !== NotificationCategory.All), NotificationCategory.WorkfileECD]
                                  : field.value.filter((cat: NotificationCategory) => cat !== NotificationCategory.WorkfileECD)
                                field.onChange(newValue)
                              }}
                            />
                            <Label htmlFor="notification-workfile">Workfile ECD</Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full transition-colors duration-200 hover:bg-black hover:text-white w-32"
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      type="submit"
                      className="p-2 rounded-full transition-colors duration-200 bg-black text-white hover:bg-gray-800 w-32"
                    >
                      {isLoading ? t('saving') : t('save')}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
