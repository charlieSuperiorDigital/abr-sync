'use client'

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
  useRef,
} from 'react'
import { Device, Call } from '@twilio/voice-sdk'
import { useSession } from 'next-auth/react'
import { connectAgentHub } from '../socket/agent-socket'
import * as signalR from '@microsoft/signalr'

interface CallContextType {
  answerCall: (callSid: string) => void
  rejectCall: (callSid: string) => void
  toggleMute: () => void
  isMuted: boolean
  incomingCalls: Call[]
  status:
    | 'ringing'
    | 'connected'
    | 'idle'
    | 'ended'
    | 'Disconnected'
    | 'Unregistered'
    | 'Connection error'
    | 'Error on login'
    | 'Registered and ready'
    | 'calling'
  setStatus: React.Dispatch<
    React.SetStateAction<
      | 'ringing'
      | 'connected'
      | 'idle'
      | 'ended'
      | 'Disconnected'
      | 'Unregistered'
      | 'Connection error'
      | 'Error on login'
      | 'Registered and ready'
      | 'calling'
    >
  >
  callOut: (destination: string) => void
  hangup: () => void
}

const CallContext = createContext<CallContextType | undefined>(undefined)

interface CallProviderProps {
  children: ReactNode
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<
    | 'ringing'
    | 'connected'
    | 'idle'
    | 'ended'
    | 'Disconnected'
    | 'Unregistered'
    | 'Connection error'
    | 'Error on login'
    | 'Registered and ready'
    | 'calling'
  >('idle')
  const [isMuted, setIsMuted] = useState(false)
  const { data: session } = useSession()
  const [device, setDevice] = useState<any>(null)
  const [signalRConnection, setSignalRConnection] =
    useState<signalR.HubConnection | null>(null)
  const [incomingCalls, setIncomingCalls] = useState<Call[]>([])

  useEffect(() => {
    if (!session) return

    const init = async () => {
      try {
        // Connect to SignalR
        const conn = await connectAgentHub(session.user.lastName)
        setSignalRConnection(conn)

        // Get Twilio token
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TWILLIO_URL}/call/token?identity=${session.user.lastName}`,
          {
            headers: {
              Accept: 'application/json',
              'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json',
            },
          }
        )

        const res1 = await res.json()
        const token = res1.token

        const twilioDevice = new Device(token)

        twilioDevice.on('registered', () => {
          setStatus('Registered and ready')
        })

        twilioDevice.on('incoming', (call) => {
          console.log('📞 Incoming call...', call.parameters.CallSid)
          setIncomingCalls((prevCalls) => [...prevCalls, call])
          setStatus('ringing')
        })

        twilioDevice.on('disconnect', () => {
          setStatus('ended')
          conn.invoke('SetAgentState', 'available')
        })

        twilioDevice.on('unregistered', () => {
          setStatus('Unregistered')
        })

        twilioDevice.on('error', (error: any) => {
          console.error('❌ Error:', error)
          setStatus('Connection error')
        })

        conn.on('callAccepted', (callSid: string) => {
          // Reject all calls that weren't accepted
          setIncomingCalls((prevCalls) => {
            prevCalls.forEach((call) => {
              if (call.parameters.CallSid !== callSid) {
                call.reject()
              }
            })
            // Mantener solo la llamada aceptada
            return prevCalls.filter(
              (call) => call.parameters.CallSid !== callSid
            )
          })
          setStatus('connected')
        })

        await twilioDevice.register()
        setDevice(twilioDevice)
      } catch (error) {
        console.error('❌ Connection error:', error)
        setStatus('Error on login')
      }
    }

    init()

    return () => {
      if (device) {
        device.disconnectAll()
        device.destroy()
      }
      if (signalRConnection) {
        signalRConnection.stop()
      }
    }
  }, [session])

  const rejectCall = async (callSid: string) => {
    setIncomingCalls((prevCalls) => {
      const updatedCalls = prevCalls.filter((call) => {
        if (call.parameters.CallSid === callSid) {
          call.reject()
          // Reject the call
          signalRConnection?.invoke('SetAgentState', 'available')
          return false
        }
        return true
      })

      if (updatedCalls.length === 0) {
        setStatus('idle')
      }

      return updatedCalls
    })
  }

  const answerCall = (callSid: string) => {
    setIncomingCalls((prevCalls) => {
      const callToAnswer = prevCalls.find(
        (call) => call.parameters.CallSid === callSid
      )
      if (callToAnswer) {
        callToAnswer.accept()
        signalRConnection?.invoke('SetAgentState', 'busy')
        signalRConnection?.invoke('CallAccepted', callSid)
        setStatus('connected')
      }

      // Return empty array to clear all incoming calls
      return []
    })
  }

  const callOut = (destination: string) => {
    if (device) {
      const normalized = destination.trim().replace(/\s+/g, '')
      setStatus('calling')
      device.connect({ params: { To: normalized } })
      signalRConnection?.invoke('SetAgentState', 'busy')
    }
  }

  const hangup = () => {
    if (device) {
      device.disconnectAll()
      setStatus('ended')
      signalRConnection?.invoke('SetAgentState', 'available')
    }
  }

  const toggleMute = () => {
    if (device && incomingCalls.length > 0) {
      incomingCalls.forEach((call) => {
        call.mute(!isMuted)
      })
      setIsMuted(!isMuted)
    }
  }

  return (
    <CallContext.Provider
      value={{
        answerCall,
        rejectCall,
        toggleMute,
        isMuted,
        incomingCalls,
        status,
        setStatus,
        callOut,
        hangup,
      }}
    >
      {children}
    </CallContext.Provider>
  )
}

export const useCall = (): CallContextType => {
  const context = useContext(CallContext)
  if (!context) {
    throw new Error('useCall must be used within a CallProvider')
  }
  return context
}
