import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { getServerSession } from 'next-auth'
import OpportunitiesContent from './components/opportunities-content'

export default async function OpportunitiesPage() {
  const session = await getServerSession(authOptions)
  const tenantId = session?.user?.tenantId

  if (!tenantId) {
    return <div>Please Login</div>
  }

  return <OpportunitiesContent tenantId={tenantId} />
}
