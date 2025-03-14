import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DarkButton from "@/app/[locale]/custom-components/dark-button"
import { LucideIcon } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  confirmIcon?: LucideIcon
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmIcon: Icon
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-4 sm:justify-start">
          <DarkButton
            buttonText="Cancel"
            onClick={onClose}
            additionalProps={{
              className: "py-2 hover:bg-gray-300 hover:rounded-full"
            }}
          />
          <DarkButton
            buttonText={confirmText}
            buttonIcon={Icon && <Icon className="w-4 h-4 mr-2" />}
            onClick={() => {
              onConfirm()
              onClose()
            }}
           
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
