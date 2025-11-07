import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Project Not Found</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/projects">
          <Button size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    </div>
  )
}