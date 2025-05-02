import { ClipboardCheck, Mail, Archive, Settings, Truck } from 'lucide-react'
import { Link } from '@/i18n/routing'
import type { routing } from '@/i18n/routing'

type SideBarIconProps = {
  newNotificationsQuantity: number //How many new notifications the icon should display
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> //A lucide-react icon
  hasWarning?: boolean //Whether or not the icon should display a warning
  label?: string //Label for the icon when expanded in a group
}

type SideBarIconGroupProps = {
  icons: SideBarIconProps[] //An array of icons
  link: keyof typeof routing.pathnames //The link the icon group should go to
  label?: string // Optional label to display when expanded
  expanded?: boolean // Whether the sidebar is expanded
}

const SideBarIcon = ({
  newNotificationsQuantity,
  Icon,
  hasWarning,
}: SideBarIconProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative p-1">
        <Icon className="w-5 h-5 text-white group-hover:text-black" />
        {hasWarning && (
          <span className="border-[3px] border-[#1D1D1D] group-hover:border-white flex items-center justify-center absolute bottom-0 right-0 w-5 h-5 translate-x-2 translate-y-2 bg-red-500 rounded-full text-sm">
            !
          </span>
        )}
        {newNotificationsQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {newNotificationsQuantity}
          </span>
        )}
      </div>
    </div>
  )
}

export default function SideBarIconGroup({
  icons,
  link,
  label,
  expanded = false,
}: SideBarIconGroupProps) {
  const totalNotifications = icons.reduce(
    (sum, icon) => sum + icon.newNotificationsQuantity,
    0
  )
  const hasMultipleIcons = icons.length > 1

  const finalHref =
    link === '/shop-manager/dashboard/opportunities'
      ? { pathname: link, query: { tab: 'new-opportunities' } }
      : link // Usar la ruta base para otros enlaces
  //

  // If expanded and has multiple icons, we'll render each icon with its own label
  if (expanded && hasMultipleIcons) {
    return (
      <div className="w-full px-2 mb-2 group">
        <div className="bg-[#1D1D1D] rounded-[20px] p-3 w-full group-hover:bg-white">
          <div className="flex flex-col space-y-2">
            {icons.map((icon, index) => (
              <Link
                key={index}
                href={finalHref}
                className="flex items-center py-1 cursor-pointer"
              >
                <SideBarIcon {...icon} />
                <div className="ml-4 font-medium text-sm text-white group-hover:text-black whitespace-nowrap overflow-hidden">
                  {icon.label || `Item ${index + 1}`}
                  {icon.newNotificationsQuantity > 0 && (
                    <span className="ml-2 font-bold text-red-500">
                      {icon.newNotificationsQuantity}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Standard rendering for collapsed state or single icon
  return (
    <div className="w-full flex justify-center px-2 mb-2 group">
      {!expanded ? (
        // Collapsed state
        <Link
          href={finalHref}
          className={`group bg-[#1D1D1D] text-white hover:bg-white hover:text-black py-2 px-2 ${hasMultipleIcons ? 'rounded-[10px]' : 'rounded-full'} flex items-center w-full relative`}
        >
          <div className="flex items-center justify-center">
            {hasMultipleIcons ? (
              <div className="relative">
                <SideBarIcon {...icons[0]} />
                <div className="absolute -bottom-1 -right-1 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {icons.length}
                </div>
              </div>
            ) : (
              <SideBarIcon {...icons[0]} />
            )}
          </div>
        </Link>
      ) : (
        // Expanded state
        <Link
          href={link}
          className="bg-[#1D1D1D] rounded-full p-2 w-full group-hover:bg-white cursor-pointer"
        >
          <div className="flex items-center">
            <SideBarIcon {...icons[0]} />
            <div className="ml-4 font-medium text-base text-white group-hover:text-black whitespace-nowrap overflow-hidden">
              {label}
              {totalNotifications > 0 && (
                <span className="ml-2 font-bold text-red-500">
                  {totalNotifications}
                </span>
              )}
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
