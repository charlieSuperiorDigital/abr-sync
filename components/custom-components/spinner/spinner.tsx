import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white'
  className?: string
}

export function Spinner({
  size = 'md',
  color = 'primary',
  className,
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const colorClasses = {
    primary: 'border-t-[#212326]',
    white: 'border-t-white',
  }

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
      <div
        className={cn(
          'absolute inset-0 rounded-full border-4 animate-spin',
          colorClasses[color]
        )}
      ></div>
    </div>
  )
}
