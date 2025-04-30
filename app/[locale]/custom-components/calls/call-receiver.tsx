'use client'

import { useState, useEffect, useRef } from 'react'
import { PhoneOff, Phone, Mic, MicOff, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCall } from '@/app/context/call-context'

interface CallReceiverProps {
  onAnswer?: (callSid: string) => void
  onEnd?: (callSid?: string) => void
  onMuteChange?: (isMuted: boolean) => void
  className?: string
}

export function CallReceiver({
  onAnswer,
  onEnd,
  onMuteChange,
  className,
}: CallReceiverProps) {
  const {
    status,
    setStatus,
    answerCall,
    hangup,
    incomingCalls,
    rejectCall,
    isMuted,

    toggleMute,
  } = useCall()

  const [duration, setDuration] = useState(0)
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null)

  const prevShowRef = useRef(status)
  const prevMutedRef = useRef(isMuted)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const vehicleInfo = {
    roNumber: '113945',
    year: '2017',
    make: 'Volkswagen',
    color: 'Blue',
    owner: 'Aiden Moore',
  }

  useEffect(() => {
    if (prevShowRef.current !== status) {
      if (status === 'idle') {
        setDuration(0)
        setActiveCallSid(null)
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
    if (activeCallSid) {
      rejectCall(activeCallSid)
    } else {
      hangup()
    }
    setStatus('idle')
    onEnd?.()
  }

  const handleAnswerCall = (callSid: string) => {
    answerCall(callSid)
    setActiveCallSid(callSid)
    setDuration(0)
    onAnswer?.(callSid)
  }

  if ((status === 'idle' || incomingCalls.length === 0) && !activeCallSid) {
    return null
  }

  return (
    <div className="w-full max-w-[1600px] px-4 space-y-2">
      {status === 'connected' && activeCallSid && (
        <div
          key={`active-${activeCallSid}`}
          className={cn(
            'flex items-center justify-between w-full bg-black text-white p-3 rounded-lg shadow-lg',
            'animate-fade-in-up animate-duration-300',
            className
          )}
        >
          <div className="flex items-center gap-3 h-16">
            <div className="h-9 w-9 bg-gray-700 rounded-md flex items-center justify-center">
              <Car className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">
                RO # {vehicleInfo.roNumber}
              </span>
              <span className="font-bold text-lg">
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.color}
              </span>
              <span className="font-medium text-lg text-gray-300">
                Owner: {vehicleInfo.owner}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-600 h-9 rounded-full text-white px-5 py-1 text-sm font-medium inline-flex items-center">
              <span>IN CALL: {formatDuration(duration)}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'rounded-full h-9 w-9 p-0 flex items-center justify-center bg-gray-200 text-black hover:bg-gray-300',
                isMuted && 'bg-gray-700 text-white'
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

            <Button
              variant="destructive"
              size="sm"
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700"
              onClick={handleEndCall}
              aria-label="End call"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Incoming calls */}
      {incomingCalls
        .filter((call) => call.parameters.CallSid !== activeCallSid)
        .map((call, index) => (
          <div
            key={call.parameters.CallSid}
            className={cn(
              'flex items-center justify-between w-full bg-gradient-to-r from-black to-gray-900 text-white p-3 rounded-lg shadow-lg border-l-4 border-yellow-500',
              'animate-fade-in-up animate-duration-300',
              className
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 h-16">
              <div className="h-9 w-9 bg-gray-700 rounded-md flex items-center justify-center animate-pulse">
                <Car className="h-5 w-5 text-gray-400" />
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                  RO # {vehicleInfo.roNumber}
                </span>
                <span className="font-bold text-lg">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.color}
                </span>
                <span className="font-medium text-lg text-gray-300">
                  Owner: {vehicleInfo.owner}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 text-white h-9 rounded-full px-5 py-1 text-sm font-medium inline-flex items-center animate-pulse">
                <span>INCOMING CALL</span>
              </div>

              <Button
                variant="default"
                size="sm"
                className="rounded-full h-9 w-9 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700 "
                onClick={() => handleAnswerCall(call.parameters.CallSid)}
                aria-label="Answer call"
              >
                <Phone className="h-4 w-4" />
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="rounded-full h-9 w-9 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700"
                onClick={() => {
                  rejectCall(call.parameters.CallSid)
                }}
                aria-label="Decline call"
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  )
}
