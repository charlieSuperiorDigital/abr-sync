import { render, screen } from '@testing-library/react'
import Stepper from './stepper'

describe('Stepper', () => {
  it('renders the correct number of steps', () => {
    const { container } = render(<Stepper activeTab={0} length={5} />)
    const steps = container.querySelectorAll('[class*="flex-1 h-1"]')
    expect(steps).toHaveLength(5)
  })

  it('applies the correct styles for active and inactive steps', () => {
    const { container } = render(<Stepper activeTab={2} length={5} />)
    const steps = container.querySelectorAll('[class*="flex-1 h-1"]')

    // First three steps should be active (black)
    expect(steps[0]).toHaveClass('bg-black')
    expect(steps[1]).toHaveClass('bg-black')
    expect(steps[2]).toHaveClass('bg-black')

    // Last two steps should be inactive (gray)
    expect(steps[3]).toHaveClass('bg-gray-300')
    expect(steps[4]).toHaveClass('bg-gray-300')
  })

  it('handles edge case: all steps active', () => {
    const { container } = render(<Stepper activeTab={5} length={5} />)
    const steps = container.querySelectorAll('[class*="flex-1 h-1"]')
    steps.forEach((step) => {
      expect(step).toHaveClass('bg-black')
    })
  })

  it('applies correct classes for flex and gap', () => {
    render(<Stepper activeTab={0} length={3} />)
    const container = screen.getByTestId('stepper-container')
    expect(container).toHaveClass('flex gap-2 w-full')
  })

  it('handles length equal to 0', () => {
    const { container } = render(<Stepper activeTab={0} length={0} />)
    const steps = container.querySelectorAll('[class*="flex-1 h-1"]')
    expect(steps).toHaveLength(0)
  })

  it('handles activeTab greater than length', () => {
    const { container } = render(<Stepper activeTab={6} length={5} />)
    const steps = container.querySelectorAll('[class*="flex-1 h-1"]')
    steps.forEach((step) => {
      expect(step).toHaveClass('bg-black')
    })
  })
})
