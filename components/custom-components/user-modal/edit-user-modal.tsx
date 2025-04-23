'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { EditUserFormData, editUserFormSchema, UserRoleOptions, LanguageOptions, NotificationTypeOptions } from './schema'
import { useUpdateUser } from '@/app/api/hooks/useUpdateUser';
import { UpdateUserRequest } from '@/app/api/functions/user';
import { useFileUpload } from '@/app/api/hooks/useFileUpload'

import { CustomInput } from '../inputs/custom-input'
import { CustomSelect } from '../selects/custom-select'
import { CustomButtonSelect, CustomButtonSelectField } from '../selects/custom-button-select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/app/stores/user-store'
import { User, ModuleAccess, CommunicationAccess, NotificationCategory, Language, NotificationType, Location } from '@/app/types/user'
import { Pencil, Upload, X, Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserCircle2 } from 'lucide-react'
import { CustomMaskedInput } from '../inputs/custom-masked-input'
import { useTenant } from '@/app/context/TenantProvider'
import Image from 'next/image'


enum UserModules {
  None = 0,                     // 0000 0000
  Workfiles = 1,                // 0000 0001
  Users = 2,                    // 0000 0010
  Locations = 4,                // 0000 0100
  Opportunities = 8,            // 0000 1000
  Parts = 16,                   // 0001 0000
  Settings = 32,                // 0010 0000
  InsuranceVehicleOwners = 64,  // 0100 0000
  All = ~0                      // 1111 1111
}

enum UserCommunication {
  None = 0,                // 0000 0000
  Vendors = 1,             // 0000 0001
  Insurances = 2,          // 0000 0010
  VehicleOwners = 4,       // 0000 0100
  All = ~0                 // 1111 1111
}


interface EditUserModalProps {
  children?: React.ReactNode
  title: string
  user: User
}

export function EditUserModal({
  children,
  title,
  user
}: EditUserModalProps) {
  const { tenant } = useTenant()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('User')
  const updateUserInStore = useUserStore((state) => state.updateUser)

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

  const hasFlag = <T extends number>(access: number, flag: T): boolean => {
    // Convert decimal to binary string and back to decimal to handle the input correctly
    const binaryStr = access.toString().padStart(8, '0');
    const normalizedAccess = parseInt(binaryStr, 2);
    
    console.log('Access (binary):', binaryStr);
    console.log('Flag:', flag.toString(2).padStart(8, '0'));
    
    // Check if any bits are set
    const result = (normalizedAccess & flag) !== 0;
    console.log('Has flag:', result);
    return result;
  }

  const hasModule = (moduleAccess: number, module: UserModules): boolean => {
    return hasFlag(moduleAccess, module);
  }

  const hasCommunication = (communicationAccess: number, communication: UserCommunication): boolean => {
    return hasFlag(communicationAccess, communication);
  }

  const validationMessage = useTranslations('Validation')

  // Extract first and last name from full name
  const getNameParts = (fullName: string) => {
    const nameParts = fullName.trim().split(/\\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    return { firstName, lastName }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
    setValue,
    control
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',

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

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      // Parse roles from JSON string
      const userRoles = user.roles ? JSON.parse(user.roles) : [];
      const primaryRole = userRoles.length > 0 ? userRoles[0] : '';

      console.log('user', user)

      // Convert moduleAccess number to array of selected modules
      const selectedModules: ModuleAccess[] = [];
      // Handle module access
      const moduleAccessValue = user.modules;
      const moduleMapping = [
        { flag: UserModules.Workfiles, access: ModuleAccess.Workfiles },
        { flag: UserModules.Users, access: ModuleAccess.Users },
        { flag: UserModules.Locations, access: ModuleAccess.Locations },
        { flag: UserModules.Opportunities, access: ModuleAccess.Opportunities },
        { flag: UserModules.Parts, access: ModuleAccess.Parts },
        { flag: UserModules.Settings, access: ModuleAccess.Settings },
        { flag: UserModules.InsuranceVehicleOwners, access: ModuleAccess.InsuranceVehicleOwners },
      ];

      moduleMapping.forEach(({ flag, access }) => {
        if (hasModule(moduleAccessValue, flag)) {
          selectedModules.push(access);
        }
      });

      // Handle communication access
      const communicationAccessValue = user.communication      ;
      console.log('Communication Access Raw Value:', communicationAccessValue);
      console.log('Communication Access Type:', typeof communicationAccessValue);

      const selectedCommunications: CommunicationAccess[] = [];
      const communicationMapping = [
        { flag: UserCommunication.Vendors, access: CommunicationAccess.Vendors },
        { flag: UserCommunication.Insurances, access: CommunicationAccess.Insurances },
        { flag: UserCommunication.VehicleOwners, access: CommunicationAccess.VehicleOwners },
      ];

      console.log('Communication Mapping:', communicationMapping);

      communicationMapping.forEach(({ flag, access }) => {
        if (hasCommunication(communicationAccessValue, flag)) {
          selectedCommunications.push(access);
        }
      });

      console.log('Final Selected Communications:', selectedCommunications);


      reset({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        role: primaryRole,
        hourlyRate: user.hourlyRate || 0,
        isActive: user.isActive,
        preferredLanguage: user.preferredLanguage as Language || Language.English,
        moduleAccess: selectedModules,
        communicationAccess: selectedCommunications,
        notificationType: user.notificationType,
        notificationCategories: user.notificationCategories || [],
        locations: user.locations || []
      });

      if (user.profilePicture) {

        setProfilePictureUrl(user.profilePicture);
        setLogoPreview(user.profilePicture)


      }
    }
  }, [isOpen, user, setValue])

  const { updateUser } = useUpdateUser()

  const onSubmit = async (data: EditUserFormData) => {
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
          const namePrefix = data.fullName.replace(/\s+/g, '-').toLowerCase() || 'user-profile';
          console.log(`Uploading profile picture with prefix: ${namePrefix}`);

          const uploadResult = await uploadFile(logoFile, namePrefix);

          if (uploadResult) {
            profilePictureURL = uploadResult.fileUrl;
            console.log(`Profile picture uploaded successfully. URL: ${profilePictureURL}`);
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          // Continue with user update even if profile picture upload fails
        }
      }

      // Only include fields that have been changed
      const updateData: UpdateUserRequest = {};

      // Check each field in dirtyFields and add to updateData if changed
      if (dirtyFields.fullName) {
        const { firstName, lastName } = getNameParts(data.fullName);
        updateData.firstName = firstName;
        updateData.lastName = lastName;
      }
      if (dirtyFields.email) updateData.email = data.email;
      if (dirtyFields.phoneNumber) updateData.phoneNumber = data.phoneNumber;
      if (dirtyFields.hourlyRate) updateData.hourlyRate = data.hourlyRate;
      if (dirtyFields.preferredLanguage) updateData.preferredLanguage = data.preferredLanguage || undefined;
      if (dirtyFields.role) {
        // Convert role to JSON string array
        updateData.roles = JSON.stringify([data.role]);
      }

      // Add profile picture if it was changed
      if (profilePictureURL) {
        updateData.profilePicture = profilePictureURL;
      }

      // Only proceed with update if there are changes
      if (Object.keys(updateData).length === 0) {
        setIsLoading(false);
        setIsOpen(false);
        return;
      }

      // Update user
      updateUser(
        {
          userId: user.id,
          data: updateData
        },
        {
          onSuccess: () => {
            console.log('User updated successfully');
            setIsOpen(false);
            reset();
            // Update user in store with only the changed fields
            updateUserInStore({
              ...user,
              ...updateData
            });
          },
          onError: (error) => {
            console.error('Error updating user:', error);
            throw error;
          }
        }
      );

      setIsLoading(false);
    } catch (error) {
      console.error('Error updating user:', error)
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

    console.log('File selected:', file.name, file.type, file.size);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    setProfilePictureUrl(null);
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
          <span className="p-2 group-hover:text-white">
            <Pencil className="w-4 h-4" />
          </span>
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
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
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
                              unoptimized={true}
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
                        value={field.value || ''}
                        onChange={field.onChange}
                        error={errors.phoneNumber?.message}
                        mask="(999) 999-9999"
                      />
                    )}
                  />

                  <div className="space-y-2">
                    <Label>{t('role')}</Label>
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
                  </div>

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
                        <CustomButtonSelect
                          options={LanguageOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is-active"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="is-active">Active Access</Label>
                        </div>
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
                            <div
                              key={module}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`module-${module}`}
                                checked={field.value.includes(module)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, module]
                                    : field.value.filter((m) => m !== module)
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
                    <Label className="font-semibold">Communication</Label>
                    <Controller
                      name="communicationAccess"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(CommunicationAccess).map((comm) => (
                            <div
                              key={comm}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`comm-${comm}`}
                                checked={field.value.includes(comm)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, comm]
                                    : field.value.filter((c) => c !== comm)
                                  field.onChange(newValue)
                                }}
                              />
                              <Label htmlFor={`comm-${comm}`}>{comm}</Label>
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
                              checked={
                                field.value === NotificationType.SMS ||
                                field.value === NotificationType.Both
                              }
                              onCheckedChange={(checked) => {
                                const emailChecked =
                                  field.value === NotificationType.Email ||
                                  field.value === NotificationType.Both
                                if (checked) {
                                  field.onChange(
                                    emailChecked
                                      ? NotificationType.Both
                                      : NotificationType.SMS
                                  )
                                } else {
                                  field.onChange(
                                    emailChecked
                                      ? NotificationType.Email
                                      : ''
                                  )
                                }
                              }}
                            />
                            <Label htmlFor="notification-sms">SMS</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-email"
                              checked={
                                field.value === NotificationType.Email ||
                                field.value === NotificationType.Both
                              }
                              onCheckedChange={(checked) => {
                                const smsChecked =
                                  field.value === NotificationType.SMS ||
                                  field.value === NotificationType.Both
                                if (checked) {
                                  field.onChange(
                                    smsChecked
                                      ? NotificationType.Both
                                      : NotificationType.Email
                                  )
                                } else {
                                  field.onChange(
                                    smsChecked ? NotificationType.SMS : ''
                                  )
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
