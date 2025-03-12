import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CustomButton } from './custom-button'

// Mock the Loader2 component
jest.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader" />,
}))

describe('CustomButton', () => {
  it('renders with default props', () => {
    render(<CustomButton>Click me</CustomButton>)
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument()
  })

  it('applies correct classes for different variants', () => {
    const { rerender } = render(
      <CustomButton variant="filled">Filled</CustomButton>
    )
    expect(screen.getByRole('button')).toHaveClass('bg-black text-white')

    rerender(<CustomButton variant="outlined">Outlined</CustomButton>)
    expect(screen.getByRole('button')).toHaveClass(
      'bg-white border-2 border-black text-black'
    )

    rerender(<CustomButton variant="gray">Gray</CustomButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-400 text-white')

    rerender(<CustomButton variant="ghost">Ghost</CustomButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent text-black')

    rerender(<CustomButton variant="underlined">Underlined</CustomButton>)
    expect(screen.getByRole('button')).toHaveClass(
      'bg-transparent text-black underline'
    )
  })

  it('shows loading state', () => {
    render(<CustomButton loading>Click me</CustomButton>)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toHaveClass('opacity-0')
  })

  it('disables button when loading or disabled prop is true', () => {
    const { rerender } = render(<CustomButton loading>Click me</CustomButton>)
    expect(screen.getByRole('button')).toBeDisabled()

    rerender(<CustomButton disabled>Click me</CustomButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<CustomButton onClick={handleClick}>Click me</CustomButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(
      <CustomButton onClick={handleClick} disabled>
        Click me
      </CustomButton>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<CustomButton className="custom-class">Click me</CustomButton>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
