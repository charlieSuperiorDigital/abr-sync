'use client'

import { useState, useEffect, useRef } from 'react'
import { PhoneOff, Phone, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Car } from 'lucide-react'
import { useCall } from '@/app/context/call-context'

interface CallReceiverProps {
  onAnswer?: () => void
  onEnd?: () => void
  onMuteChange?: (isMuted: boolean) => void
  className?: string
}

export function CallReceiver({
  onAnswer,
  onEnd,
  onMuteChange,
  className,
}: CallReceiverProps) {
  const vehicleInfo = {
    roNumber: '113945',
    year: '2017',
    make: 'Volkswagen',
    color: 'Blue',
    owner: 'Aiden Moore',
  }
  const { status, setStatus, answerCall, hangup } = useCall()

  const [duration, setDuration] = useState(0)

  const [isMuted, setIsMuted] = useState(false)

  const prevShowRef = useRef(status)
  const prevMutedRef = useRef(isMuted)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (prevShowRef.current !== status) {
      if (status === 'idle') {
        setDuration(0)
        setIsMuted(false)
      }
      prevShowRef.current = status
    }
  }, [status])

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (status === 'connected') {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [status])

  useEffect(() => {
    if (prevMutedRef.current !== isMuted) {
      onMuteChange?.(isMuted)
      prevMutedRef.current = isMuted
    }
  }, [isMuted, onMuteChange])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    hangup()
    setStatus('idle')
  }

  const handleAnswerCall = () => {
    answerCall()
    setDuration(0)
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  if (status !== 'ringing' && status !== 'connected') {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between w-full bg-black text-white p-2 rounded-md max-w-[1600px] shadow-md',
        className
      )}
    >
      <div className="flex items-center gap-3 h-16">
        <div className="h-8 w-8 bg-gray-700 rounded-sm flex items-center justify-center">
          <Car className="h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">RO # {vehicleInfo.roNumber}</span>
          <span className="font-bold text-xl">
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.color}
          </span>
          <span className="font-medium text-xl text-gray-300">
            Owner: {vehicleInfo.owner}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {status === 'connected' && (
          <div className="bg-green-600 h-[35px] rounded-full text-white px-5 py-1 text-xs font-medium inline-flex items-center">
            <span>IN CALL: {formatDuration(duration)}</span>
          </div>
        )}

        {status === 'ringing' && (
          <div className="bg-yellow-500 text-white h-[35px] rounded-full px-5 py-1 text-xs font-medium inline-flex items-center">
            <span>INCOMING CALL</span>
          </div>
        )}

        {status === 'connected' && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'rounded-full h-8 w-8 p-0 flex items-center justify-center bg-[#F0F0F0] text-black hover:bg-gray-700',
              isMuted && 'bg-gray-700'
            )}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute call' : 'Mute call'}
          >
            {isMuted ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        )}

        {status === 'ringing' ? (
          <>
            <Button
              variant="default"
              size="sm"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700"
              onClick={handleAnswerCall}
              aria-label="Answer call"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700"
              onClick={handleEndCall}
              aria-label="Decline call"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </>
        ) : (
          status === 'connected' && (
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700"
              onClick={handleEndCall}
              aria-label="End call"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          )
        )}
      </div>
    </div>
  )
}
