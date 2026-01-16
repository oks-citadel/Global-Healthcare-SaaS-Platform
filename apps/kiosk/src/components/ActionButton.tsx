import { LucideIcon } from 'lucide-react'

interface ActionButtonProps {
  icon: LucideIcon
  label: string
  description: string
  color: 'primary' | 'secondary' | 'success' | 'accent'
  onClick: () => void
}

export function ActionButton({ icon: Icon, label, description, color, onClick }: ActionButtonProps) {
  const colorClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-900',
    success: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white',
    accent: 'bg-accent-600 hover:bg-accent-700 active:bg-accent-800 text-white',
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${colorClasses[color]}
        p-8 rounded-3xl shadow-xl
        transition-all duration-200 active:scale-95
        focus-visible:ring-4 focus-visible:ring-offset-2
        flex flex-col items-center gap-4
        min-h-[200px]
        group
      `}
    >
      <Icon className="w-16 h-16 group-hover:scale-110 transition-transform duration-200" />
      <div className="text-center">
        <h3 className="text-kiosk-lg font-bold mb-2">{label}</h3>
        <p className="text-kiosk-sm opacity-90">{description}</p>
      </div>
    </button>
  )
}
