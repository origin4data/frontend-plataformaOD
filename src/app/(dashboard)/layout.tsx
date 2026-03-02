'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-neutral-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
