// src/app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {/* Aqui dentro o Next.js vai injetar o DashboardLayout 
             automaticamente se você estiver na rota da dashboard.
          */}
          {children} 
        </AuthProvider>
      </body>
    </html>
  )
}