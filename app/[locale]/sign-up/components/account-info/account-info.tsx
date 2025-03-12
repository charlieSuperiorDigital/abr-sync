import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomInput } from '@/components/custom-components/inputs/custom-input'

import { CustomButton } from '@/components/custom-components/buttons/custom-button'
import Link from 'next/link'
import {
  accountFormSchema,
  type AccountFormValues,
} from './account-info-schema'
import { useTenantRegistration } from '../../context/tenant-registration.context'
import { CustomCheckbox } from '@/components/custom-components/checkbox/custom-checkbox'

const AccountInfo = () => {
  const { setAccountInfo, setActiveTab } = useTenantRegistration()
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      privacy: false,
      authorized: false,
    },
  })

  const onSubmit = (data: AccountFormValues) => {
    console.log(data)
    setAccountInfo(data)
    setActiveTab(1)
  }

  return (
    <div className="w-full mx-auto p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-h3 font-bold">Account Info</h1>

        <div className="space-y-4">
          <CustomInput
            label="Admin Full Name"
            {...form.register('fullName')}
            error={form.formState.errors.fullName?.message}
          />

          <CustomInput
            label="Admin Email"
            type="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />

          <CustomInput
            label="Create Password"
            type="password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />

          <CustomInput
            label="Confirm Password"
            type="password"
            {...form.register('confirmPassword')}
            error={form.formState.errors.confirmPassword?.message}
          />
        </div>

        <div className="space-y-3">
          <CustomCheckbox
            id="terms"
            label="I agree to Terms & Conditions"
            checked={form.watch('terms')}
            onCheckedChange={(checked) => {
              form.setValue(
                'terms',
                checked === 'indeterminate' ? false : checked
              )
            }}
            {...form.register('terms')}
            error={form.formState.errors.terms?.message}
          >
            <Link href="#" className="underline">
              Terms & Conditions
            </Link>
          </CustomCheckbox>

          <CustomCheckbox
            id="privacy"
            label="I accept Privacy Policy"
            {...form.register('privacy')}
            checked={form.watch('privacy')}
            onCheckedChange={(checked) => {
              form.setValue(
                'privacy',
                checked === 'indeterminate' ? false : checked
              )
            }}
            error={form.formState.errors.privacy?.message}
          >
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
          </CustomCheckbox>

          <CustomCheckbox
            id="authorized"
            label="I'm an Authorized Officer with the authority to bind the company. CC: Legal"
            checked={form.watch('authorized')}
            onCheckedChange={(checked) => {
              form.setValue(
                'authorized',
                checked === 'indeterminate' ? false : checked
              )
            }}
            {...form.register('authorized')}
            error={form.formState.errors.authorized?.message}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <CustomButton
            variant="underlined"
            className="text-gray-600 p-0 h-auto"
          >
            Go back
          </CustomButton>
          <CustomButton
            type="submit"
            className="px-8"
            disabled={form.formState.isSubmitting}
          >
            Continue
          </CustomButton>
        </div>
      </form>
    </div>
  )
}

export default AccountInfo
