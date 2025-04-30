'use client'

import { useState, useEffect } from 'react'
import { Phone, PhoneOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCall } from '@/app/context/call-context'

interface CallControlsProps {
  onCallStart?: () => void
  onCallEnd?: (duration: number) => void
  initiallyInCall?: boolean
  className?: string
}

export function CallControls({
  onCallStart,
  onCallEnd,
  initiallyInCall = false,
  className,
}: CallControlsProps) {
  const { callOut, hangup } = useCall()
  const [isInCall, setIsInCall] = useState(initiallyInCall)
  const [duration, setDuration] = useState(0)

  const startCall = () => {
    callOut('1234567890') // Replace with actual destination
    setIsInCall(true)
    setDuration(0)
    onCallStart?.()
  }

  const endCall = () => {
    hangup()
    setIsInCall(false)
    onCallEnd?.(duration)
  }

  // Timer effect to update duration
  useEffect(() => {
    if (!isInCall) return

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isInCall])

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {isInCall ? (
        <>
          <div className="flex-shrink-0 bg-green-600 text-white text-xs font-medium inline-flex items-center h-[30px] rounded-full px-2">
            <Phone className="w-3 h-3 mr-1" />
            <span>IN CALL: {formatDuration(duration)}</span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700"
            onClick={endCall}
            aria-label="End call"
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="default"
          size="sm"
          className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700"
          onClick={startCall}
          aria-label="Start call"
        >
          <Phone className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
