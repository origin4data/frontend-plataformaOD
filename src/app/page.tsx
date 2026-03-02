'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  )
}
