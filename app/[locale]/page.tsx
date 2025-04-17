import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/auth-options'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/${locale}/login`)
  } else {
    const roles = session.user?.roles || []
    if (roles.includes('superadmin')) {
      redirect(`/${locale}/super-admin/dashboard`)
    } else if (roles.includes('bodytech') || roles.includes('painttech')) {
      redirect(`/${locale}/technician-painter/dashboard`)
    } else {
      redirect(`/${locale}/shop-manager/dashboard`)
    }
  }
  return null
}
