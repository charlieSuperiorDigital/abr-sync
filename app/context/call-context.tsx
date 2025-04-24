'use client'

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from 'react'
import { Device, Call } from '@twilio/voice-sdk'
import { useSession } from 'next-auth/react'
import { connectAgentHub } from '../socket/agent-socket'
import * as signalR from '@microsoft/signalr'

interface CallContextType {
  answerCall: () => void
  rejectCall: () => void
  toggleMute: () => void
  isMuted: boolean
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
  const [incomingCall, setIncomingCall] = useState<Call | null>(null)

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
        console.log('Token:', res1)
        const token = res1.token

        const twilioDevice = new Device(token)

        twilioDevice.on('registered', () => {
          setStatus('Registered and ready')
        })

        twilioDevice.on('incoming', (call) => {
          console.log('📞 Incoming call...')
          setIncomingCall(call)
          setStatus('ringing')
          // call.accept()
          // conn.invoke('SetAgentState', 'busy')
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

        await twilioDevice.register()
        setDevice(twilioDevice)
      } catch (error) {
        console.error('❌ Connection error:', error)
        setStatus('Error on login')
      }
    }

    init()
  }, [session])

  const rejectCall = () => {
    if (incomingCall) {
      incomingCall.reject()
      setStatus('ended')
      setIncomingCall(null)
    }
  }

  const answerCall = () => {
    if (incomingCall) {
      incomingCall.accept()
      signalRConnection?.invoke('SetAgentState', 'busy')
      setStatus('connected')
      setIncomingCall(null)
    }
  }
  const callOut = (destination: string) => {
    if (device) {
      const normalized = destination.trim().replace(/\s+/g, '')
      setStatus('calling')
      device.connect({ params: { To: normalized } })
      // setStatus('📞 Outgoing call...')
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

  const logout = async () => {
    if (device) {
      device.disconnectAll()
      device.destroy()
      setDevice(null)
    }

    if (signalRConnection) {
      await signalRConnection.invoke('SetAgentState', 'available')
      await signalRConnection.stop()
      setSignalRConnection(null)
    }

    // setStatus("👤 Logged out");
  }

  return (
    <CallContext.Provider
      value={{
        answerCall,
        rejectCall,
        toggleMute: () => setIsMuted(!isMuted),
        isMuted,
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
