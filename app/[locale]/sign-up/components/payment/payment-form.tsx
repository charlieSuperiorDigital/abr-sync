'use client'

import type React from 'react'

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CustomButton } from '@/components/custom-components/buttons/custom-button'
import { useTenantRegistration } from '../../context/tenant-registration.context'
import { set } from 'zod'

export function PaymentForm() {
  const { setActiveTab } = useTenantRegistration()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const cardElement = elements.getElement(CardElement)

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (error) {
        setErrorMessage(error.message)
      } else if (paymentMethod) {
        console.log('PaymentMethod created:', paymentMethod)
        // Aquí deberías enviar el paymentMethod.id a tu servidor
        // para procesar el pago o guardar la información para uso futuro
      }
    }

    setIsProcessing(false)
  }

  const handleGoBack = () => {
    setActiveTab(3)
    console.log('Going back...')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Card Information</h2>
        <div className="rounded-md border bg-card p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="text-sm text-destructive">{errorMessage}</div>
      )}

      <div className="flex justify-between items-center pt-4">
        <CustomButton type="button" variant="ghost" onClick={handleGoBack}>
          Go back
        </CustomButton>
        <CustomButton type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay & Complete'}
        </CustomButton>
      </div>
    </form>
  )
}
