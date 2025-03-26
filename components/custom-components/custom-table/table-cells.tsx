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
  CircleAlert,
  Trash2 as Trash,
  Pencil as Edit,
  Check,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PriorityBadge } from '../priority-badge/priority-badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { act, useState } from 'react'
import { EditTaskModal } from '../task-modal/edit-task-modal'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import { getFriendlyDate, formatDateTime, formatDate } from '@/lib/utils/date'
import { OpportunityInfoCard } from '../opportunity-info-card/opportunity-info-card'

interface TitleCellProps {
  title: string
}

export function TitleCell({ title }: TitleCellProps) {
  return <span className="font-bold">{title}</span>
}

interface DescriptionCellProps {
  description: string
}

export function DescriptionCell({ description }: DescriptionCellProps) {
  return <span className=" max-w-96 line-clamp-2">{description}</span>
}

interface CreatedByCellProps {
  createdBy: string
  currentUser: string
}

export function CreatedByCell({ createdBy, currentUser }: CreatedByCellProps) {
  return <span>{createdBy === currentUser ? 'Me' : createdBy}</span>
}

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

interface PriorityBadgeProps {
  priority: string
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

export function PriorityBadgeCell({ priority, variant }: PriorityBadgeProps) {
  return (
    <PriorityBadge variant={variant || 'default'} className="whitespace-nowrap">
      {priority}
    </PriorityBadge>
  )
}

interface DateCellProps {
  date: string | Date
  showTime?: boolean
}

export function DateCell({ date, showTime = false }: DateCellProps) {
  return (
    <span className="whitespace-nowrap">
      {showTime ? formatDateTime(date) : formatDate(date)}
    </span>
  )
}

interface FriendlyDateCellProps {
  date: string | undefined
  variant?: 'due' | 'created'
}

export function FriendlyDateCell({ date, variant }: FriendlyDateCellProps) {
  if (!date) {
    return <span className="whitespace-nowrap">-</span>
  }

  const friendlyDate = getFriendlyDate(date)
  const isUrgent = variant === 'due' &&
    (friendlyDate === 'Today' || friendlyDate === 'Tomorrow')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`whitespace-nowrap ${isUrgent ? 'text-red-500 font-semibold' : ''}`}>
            {friendlyDate}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {formatDateTime(date)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
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
    icon?: 'edit' | 'delete'
    _component?: React.ReactNode
  }[]
}

export function ActionsCell({ actions }: ActionsCellProps) {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <div key={index}>
          <>{action._component}</>
        </div>

        // <Button
        //   key={index}
        //   variant={action.variant || 'secondary'}
        //   size="sm"
        //   className="center h-8 w-8 rounded-full transition-colors hover:bg-black hover:text-white"
        //   onClick={(e) => {
        //     e.stopPropagation()
        //     action.onClick()
        //   }}
        // >
        //   {action.icon === 'edit' && <Edit />}
        //   {action.icon === 'delete' && <Trash />}
        //   {!action.icon && action.label}
        // </Button>
      ))}
    </div>
  )
}

interface WarningCellProps {
  message: string
}

export function WarningCell({ message }: WarningCellProps) {
  return (
    message && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleAlert className="bg-red-600 text-white rounded-full border-0" />
          </TooltipTrigger>
          <TooltipContent align="start" className="bg-red-600 text-white">
            {message}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  )
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
              className={`h-8 w-8 rounded-full transition-colors hover:bg-black ${!messages ? 'text-gray-400' : 'text-black'
                } hover:text-white`}
              onClick={(e) => {
                e.stopPropagation()
                console.log('Messages clicked')
              }}
            >
              <MessagesSquare className="h-4 w-4" />
              {/* {messages && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white">
                  27
                </span>
              )} */}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Messages</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full transition-colors hover:bg-black ${!email ? 'text-gray-400' : 'text-black'
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
              className={`h-8 w-8 rounded-full transition-colors hover:bg-black ${!phone ? 'text-gray-400' : 'text-black'
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

export function SummaryCell({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center">
      <RoundButtonWithTooltip
        buttonIcon={<MessageSquareMore className="h-5 w-5" />}
        tooltipText={text}
      />
    </div>
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

interface ActionButtonCellProps {
  label: string
  onClick: () => void
}

export function ActionButtonCell({ label, onClick }: ActionButtonCellProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="bg-black text-white rounded-2xl flex items-center gap-2 w-20 h-8 justify-center hover:opacity-90 ">
          <Check className="h-4 w-4" />
          {label}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog</DialogTitle>
        </DialogHeader>
        <div>
          <p>Dialog content</p>
          <p>Dialog content</p>
        </div>
      </DialogContent>
    </Dialog>
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

interface RelatedToCellProps {
  relatedObjects: Array<{
    type: string;
    id: string;
  }>;
}

export function RelatedToCell({ relatedObjects }: RelatedToCellProps) {

  if (!relatedObjects || relatedObjects.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {relatedObjects.map((obj, index) => (
        <Popover key={`${obj.type}-${obj.id}-${index}`}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="p-0"
            >
              <span className="text-sm font-semibold underline" >
                #{obj.id}{index !== relatedObjects.length - 1 && ', '}
              </span>
              
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="left"
            sideOffset={5}
            className="w-[750px]"
          >
            <div>
              <h3 className="font-semibold mb-2">{`#${obj.id}`}</h3>
              {obj.type.toLowerCase() === 'opportunity' && (
                <OpportunityInfoCard opportunityId={obj.id} />
              )}
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
