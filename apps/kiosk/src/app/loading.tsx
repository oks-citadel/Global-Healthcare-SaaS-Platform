export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-24 w-24 border-8 border-primary-600 border-t-transparent mx-auto mb-6"></div>
        <p className="text-kiosk-lg font-semibold text-gray-700">
          Loading...
        </p>
      </div>
    </div>
  )
}
