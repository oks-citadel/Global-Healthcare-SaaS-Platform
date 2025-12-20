interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 border-4',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-6',
    xl: 'h-24 w-24 border-8',
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        animate-spin rounded-full
        border-primary-600 border-t-transparent
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
