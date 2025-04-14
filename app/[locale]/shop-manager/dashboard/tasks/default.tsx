import { redirect } from 'next/navigation'

export default function Default({ params }: { params: { locale: string } }) {
  // Use the params object directly as it's already available in server components
  const { locale } = params
  redirect(`/${locale}/shop-manager/dashboard/tasks/my-tasks`)
}
