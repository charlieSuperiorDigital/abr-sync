import { ClipboardCheck, Mail, Archive, Settings, Truck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { routing } from '@/i18n/routing';

type SideBarIconProps = {
    newNotificationsQuantity: number; //How many new notifications the icon should display
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; //A lucide-react icon
    hasWarning?: boolean; //Whether or not the icon should display a warning
}

type SideBarIconGroupProps = {
    icons: SideBarIconProps[]; //An array of icons
    link: keyof typeof routing.pathnames; //The link the icon group should go to
}

const SideBarIcon = ({ newNotificationsQuantity, Icon, hasWarning }: SideBarIconProps) => {
    return (
        <div className="flex flex-col items-center justify-between mb-3">
            <div className="relative">
                <Icon />
                {hasWarning && (
                    <span className="transition-all duration-200 border-[3px] border-[#1D1D1D] group-hover:border-white flex flex-col items-center justify-center absolute bottom-0 right-0 w-5 h-5 text-align-middle translate-x-2 translate-y-2 bg-red-500 rounded-full text-sm">
                        !
                    </span>
                )}
            </div>
            {newNotificationsQuantity > 0 && (
                <p className='mt-2 font-bold'>{newNotificationsQuantity}</p>
            )}
        </div>
    )
}

export default function SideBarIconGroup({ icons, link }: SideBarIconGroupProps) {
    return (
        <Link href={link} className="transition-all duration-200 group bg-[#1D1D1D] text-white hover:bg-white hover:text-black pt-3 px-3 rounded-full flex flex-col items-center justify-between">
            {icons.map((icon, index) => (
                <SideBarIcon key={index} {...icon} />
            ))}
        </Link>
    )
}