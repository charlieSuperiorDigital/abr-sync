import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CustomInput } from './custom-input'

// Mock the dynamic import of lucide-react
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon">Eye Icon</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff Icon</div>,
}))

describe('CustomInput', () => {
  it('renders with label and input', () => {
    render(<CustomInput label="Username" />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders error message when provided', () => {
    render(<CustomInput label="Email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.getByLabelText('Email').parentElement).toHaveClass(
      'border-red-500'
    )
  })

  it('toggles password visibility', async () => {
    render(<CustomInput label="Password" type="password" />)
    const input = screen.getByLabelText('Password') as HTMLInputElement
    expect(input.type).toBe('password')

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    expect(input.type).toBe('text')

    fireEvent.click(toggleButton)
    expect(input.type).toBe('password')
  })

  it('applies correct styles for password input', () => {
    render(<CustomInput label="Password" type="password" />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveClass('pr-10')
  })

  it('handles onChange event', () => {
    const handleChange = jest.fn()
    render(<CustomInput label="Test" onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders with placeholder', () => {
    render(<CustomInput label="Test" placeholder="Enter value" />)
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument()
  })

  it('passes through additional props', () => {
    render(<CustomInput label="Test" data-testid="custom-input" />)
    expect(screen.getByTestId('custom-input')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<CustomInput label="Custom" className="test-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('test-class')
  })

  it('renders disabled input', () => {
    render(<CustomInput label="Disabled" disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    render(
      <CustomInput label="Test" onFocus={handleFocus} onBlur={handleBlur} />
    )
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })
})
