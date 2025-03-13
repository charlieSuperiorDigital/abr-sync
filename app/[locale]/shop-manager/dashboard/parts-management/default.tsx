import { redirect } from 'next/navigation'

export default function Default({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/shop-manager/dashboard/parts-management/to-order`)
}
