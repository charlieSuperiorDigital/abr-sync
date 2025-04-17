'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CustomInput } from '@/components/custom-components/inputs/custom-input'
import { CustomButton } from '@/components/custom-components/buttons/custom-button'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from '@/components/custom-components/selects/locale-switcher'
import { getLoginFormSchema, LoginFormData } from './schema'
import { useSession } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const t = useTranslations('Login')
  const validationMessage = useTranslations('Validation')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      const roles = session?.user?.roles || [];
      const locale = window.location.pathname.split('/')[1];
      if (roles.includes('superadmin')) {
        router.replace(`/${locale}/super-admin/dashboard`);
      } else if (roles.includes('bodytech') || roles.includes('painttech')) {
        router.replace(`/${locale}/technician-painter/dashboard`);
      } else {
        router.replace(`/${locale}/shop-manager/dashboard`);
      }
    }
  }, [status, session, router]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(getLoginFormSchema(validationMessage)),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    console.log('Form errors:', errors)
  }, [errors])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })
      if (result?.ok) {
        // Fetch session to get the user roles
        const { getSession } = await import('next-auth/react');
        const session = await getSession();
        const roles = session?.user?.roles || [];
        const locale = window.location.pathname.split('/')[1];
        if (roles.includes('superadmin')) {
          router.push(`/${locale}/super-admin/dashboard`);
        } else if (roles.includes('bodytech') || roles.includes('painttech')) {
          router.push(`/${locale}/technician-painter/dashboard`);
        } else {
          router.push(`/${locale}/shop-manager/dashboard`);
        }
      } else {
        console.error('Login failed:', result?.error)
      }
      console.log('Submitting form data:', data)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex h-screen">
      <div className="hidden lg:flex w-1/2 bg-[#000000] items-center justify-center p-8">
        <div className="relative w-[500px] h-[130px]">
          <Image
            src="/auto-360-logo.png"
            alt="Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 bg-[#e3e3e3] items-center justify-center p-8 relative">
        <div className="absolute top-4 right-4">
          <LocaleSwitcher />
        </div>
        <div className="space-y-8 w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#101010]">{t('title')}</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label={t('email')}
                  type="email"
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />

            <div className="space-y-1">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label={t('password')}
                    type="password"
                    error={errors.password?.message}
                    {...field}
                  />
                )}
              />
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#101010] hover:underline"
                >
                  {t('forgot')}
                </Link>
              </div>
            </div>

            <CustomButton
              type="submit"
              variant="filled"
              className="w-full bg-[#101010] hover:bg-[#101010]/90"
              loading={isLoading || isSubmitting}
              disabled={isSubmitting}
            >
              {isLoading || isSubmitting ? t('loading') : t('submit')}
            </CustomButton>
          </form>
        </div>
      </div>
    </main>
  )
}
