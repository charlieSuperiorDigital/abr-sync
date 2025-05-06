'use client'

import type { RegisterResponse } from '@/app/api/functions/authentication'
import { useFileUpload } from '@/app/api/hooks/useFileUpload'
import { useRegister } from '@/app/api/hooks/useRegister'
import { useUpdateUser } from '@/app/api/hooks/useUpdateUser'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CustomInput } from '../inputs/custom-input'
import { LanguageOptions, UserFormData, userFormSchema, UserRoleOptions } from './schema'

import { useTenant } from '@/app/context/TenantProvider'
import { CommunicationAccess, Language, ModuleAccess, NotificationType, User, UserCommunication, UserModules } from '@/app/types/user'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Plus, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { CustomMaskedInput } from '../inputs/custom-masked-input'
import { CustomButtonSelectField } from '../selects/custom-button-select'
import { CustomSelect } from '../selects/custom-select'

enum UserNotification{
  None = 0, // 0000 0000
  All = ~0, // 1111 1111
  WorkfileECD = 1 // 0000 0001
}

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
      notificationType: NotificationType.None,
      notification: 0,
      locations: []
    }
  })

  const toBinary = (num: number): number => {
    return parseInt(num.toString(2), 2);
  }

  const getModuleAccessValue = (selectedModules: ModuleAccess[]): number => {
    let value = toBinary(UserModules.None);
    const moduleMapping = [
      { flag: UserModules.Workfiles, access: ModuleAccess.Workfiles },
      { flag: UserModules.Users, access: ModuleAccess.Users },
      { flag: UserModules.Locations, access: ModuleAccess.Locations },
      { flag: UserModules.Opportunities, access: ModuleAccess.Opportunities },
      { flag: UserModules.Parts, access: ModuleAccess.Parts },
      { flag: UserModules.Settings, access: ModuleAccess.Settings },
      { flag: UserModules.InsuranceVehicleOwners, access: ModuleAccess.InsuranceVehicleOwners },
    ];

    if (selectedModules.includes(ModuleAccess.All)) {
      return toBinary(UserModules.All);
    }

    moduleMapping.forEach(({ flag, access }) => {
      if (selectedModules.includes(access)) {
        value |= toBinary(flag);
      }
    });

    return value;
  };

  const getCommunicationAccessValue = (selectedCommunications: CommunicationAccess[]): number => {
    let value = toBinary(UserCommunication.None);
    const communicationMapping = [
      { flag: UserCommunication.Vendors, access: CommunicationAccess.Vendors },
      { flag: UserCommunication.Insurances, access: CommunicationAccess.Insurances },
      { flag: UserCommunication.VehicleOwners, access: CommunicationAccess.VehicleOwners },
    ];

    if (selectedCommunications.includes(CommunicationAccess.All)) {
      return toBinary(UserCommunication.All);
    }

    communicationMapping.forEach(({ flag, access }) => {
      if (selectedCommunications.includes(access)) {
        value |= toBinary(flag);
      }
    });

    return value;
  };

  const hasNotification = (notificationAccess: number, notification: UserNotification): boolean => {
    return notification === UserNotification.All ? notificationAccess === UserNotification.All : (notificationAccess & notification) === notification;
  };

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
                modules: getModuleAccessValue(data.moduleAccess),
                communication: getCommunicationAccessValue(data.communicationAccess),
                notificationType: data.notificationType,
                notification: data.notification,
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
          className="flex justify-center items-center w-8 h-8 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
        >
          {children}
        </button>
      </div>

      {isOpen && (
        <div
          className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6">
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
                      <div onClick={handleLogoUpload} className="flex overflow-hidden justify-center items-center w-20 h-20 bg-gray-100 rounded-full border border-gray-200">
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
                              className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full transform translate-x-1/3 -translate-y-1/3"
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <Upload size={24} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    {uploadError !== null && <p className="mt-1 text-xs text-red-500">Upload failed. Please try again.</p>}
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
                    <Label className="font-semibold">Notifications</Label>
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
                      name="notification"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-all"
                              checked={hasNotification(field.value, UserNotification.All)}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? UserNotification.All : UserNotification.None)
                              }}
                            />
                            <Label htmlFor="notification-all">All</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-workfile"
                              checked={hasNotification(field.value, UserNotification.WorkfileECD)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || 0;
                                const newValue = checked
                                  ? currentValue | UserNotification.WorkfileECD
                                  : currentValue & ~UserNotification.WorkfileECD;
                                field.onChange(newValue);
                              }}
                            />
                            <Label htmlFor="notification-workfile">Workfile ECD</Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 justify-end mt-8">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="p-2 w-32 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      type="submit"
                      className="p-2 w-32 text-white bg-black rounded-full transition-colors duration-200 hover:bg-gray-800"
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
