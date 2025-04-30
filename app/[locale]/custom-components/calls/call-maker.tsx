'use client'

import { useState } from 'react'
import { CallControls } from './call-controls'

export default function CallDurationBadge() {
  const [isInCall, setIsInCall] = useState(true)
  return (
    //empty div to avoid errors and further styling
    <div className="">
      <CallControls
        initiallyInCall={isInCall}
        onCallStart={() => setIsInCall(true)}
        onCallEnd={() => setIsInCall(false)}
      />
    </div>
  )
}
