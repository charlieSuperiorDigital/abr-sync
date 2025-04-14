import { redirect } from 'next/navigation'
import { use } from 'react'

export default function Default({ paramsPromise }: { paramsPromise: Promise<{ locale: string }> }) {
  const params = use(paramsPromise)
  const { locale } = params

  redirect(`/${locale}/shop-manager/dashboard/parts-management/to-order`)
}
