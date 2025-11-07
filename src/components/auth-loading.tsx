export function AuthLoading() {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-blue-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}