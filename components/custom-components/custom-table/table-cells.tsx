import { format, differenceInDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '../status-badge/status-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Archive,
  Car,
  FileText,
  Mail,
  MessageSquareMore,
  MessagesSquare,
  Phone,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface StatusBadgeProps {
  status: string
  variant?:
    | 'default'
    | 'danger'
    | 'warning'
    | 'neutral'
    | 'slate'
    | 'info'
    | 'success'
    | 'forest'
    | 'dark'
}

export function StatusBadgeCell({ status, variant }: StatusBadgeProps) {
  return (
    <StatusBadge variant={variant || 'default'} className="whitespace-nowrap">
      {status}
    </StatusBadge>
  )
}

interface DateCellProps {
  date: string | Date
  format?: Intl.DateTimeFormatOptions
}

export function DateCell({
  date,
  format = {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  },
}: DateCellProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', format)
  return <span className="whitespace-nowrap">{formattedDate}</span>
}

interface VehicleCellProps {
  make: string
  model: string
  year: number
  imageUrl?: string
}

export function VehicleCell({ make, model, year, imageUrl }: VehicleCellProps) {
  return (
    <div className="flex items-center gap-3">
      {imageUrl && (
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={`${year} ${make} ${model}`}
          className="h-10 w-10 rounded-md object-cover"
        />
      )}
      <span className="whitespace-nowrap">
        {year} {make} {model}
      </span>
    </div>
  )
}

interface ActionsCellProps {
  actions: {
    label: string
    onClick: () => void
    variant?: 'default' | 'secondary' | 'destructive'
  }[]
}

export function ActionsCell({ actions }: ActionsCellProps) {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'secondary'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            action.onClick()
          }}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}
interface ContactMethodCellProps {
  email?: string
  phone?: string
  messages?: string
}

interface ContactMethodCellProps {
  email?: string
  phone?: string
  messages?: string
}

export function ContactMethodCell({
  email,
  phone,
  messages,
}: ContactMethodCellProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full transition-colors hover:bg-black ${
                !messages ? 'text-gray-400' : 'text-black'
              } hover:text-white`}
              onClick={(e) => {
                e.stopPropagation()
                console.log('Messages clicked')
              }}
            >
              <MessagesSquare className="h-4 w-4" />
              {messages && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white">
                  27
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Messages</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full transition-colors hover:bg-black ${
                !email ? 'text-gray-400' : 'text-black'
              } hover:text-white`}
              onClick={(e) => {
                e.stopPropagation()
                console.log('Email clicked')
              }}
            >
              <Mail className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send Email</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full transition-colors hover:bg-black ${
                !phone ? 'text-gray-400' : 'text-black'
              } hover:text-white`}
              onClick={(e) => {
                e.stopPropagation()
                console.log('Phone clicked')
              }}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Call</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export function AutoCell() {
  return (
    <div className="flex ">
      <Car className="h-5 w-5 text-green-500" />
    </div>
  )
}

interface UploadTimeCellProps {
  deadline: string
}

export function UploadTimeCell({ deadline }: UploadTimeCellProps) {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  const daysRemaining = differenceInDays(deadlineDate, today)

  let textColor = 'text-black'
  if (daysRemaining > 10) {
    textColor = 'text-gray-500'
  } else if (daysRemaining <= 3) {
    textColor = 'text-red-500'
  }

  return (
    <div className="flex flex-col">
      <span className={`text-sm text-muted-foreground ${textColor}`}>
        {daysRemaining > 0
          ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`
          : 'Overdue'}
      </span>
    </div>
  )
}

export function SummaryCell() {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log('Summary clicked')}
      >
        <MessageSquareMore className="h-5 w-5" />
      </Button>
    </>
  )
}
interface DocumentCellProps {
  fileName: string
  onClick?: () => void
}

export function DocumentCell({ fileName, onClick }: DocumentCellProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="h-8 flex items-center gap-2 px-3 hover:bg-black hover:text-white rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">{fileName}</span>
        </Button>
      </div>
    </TooltipProvider>
  )
}
interface UserAvatarCellProps {
  name: string
  avatarUrl: string
}

export function UserAvatarCell({ name, avatarUrl }: UserAvatarCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}

interface ArchiveButtonCellProps {
  onClick: () => void
  archive: boolean
}

export function ArchiveButtonCell({
  onClick,
  archive,
}: ArchiveButtonCellProps) {
  return (
    <Button
      variant="default"
      size="sm"
      className="bg-black hover:bg-black/90 text-white rounded-full flex items-center gap-2"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <Archive className="h-4 w-4" />
      <span>{archive ? 'Archive ' : 'Unarchive'}</span>
    </Button>
  )
}
