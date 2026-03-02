'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Target,
  Settings,
  Building2,
  Store
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'OWNER', 'USER'] },
  { name: 'Leads (CRM)', href: '/crm', icon: Target, roles: ['ADMIN', 'OWNER', 'USER'] },
  { name: 'Lojas/Unidades', href: '/lojas', icon: Store, roles: ['ADMIN', 'OWNER', 'USER'] },
  { name: 'Clientes', href: '/clientes', icon: Users, roles: ['ADMIN', 'OWNER', 'USER'] },
  { name: 'Processos', href: '/processos', icon: FolderKanban, roles: ['ADMIN', 'OWNER'] },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, roles: ['ADMIN', 'OWNER'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNav = navigation.filter(item => 
    item.roles.includes(user?.role || 'USER')
  )

  return (
    // ✅ CORREÇÃO: Removido lg:fixed e lg:inset-y-0. Adicionado lg:shrink-0
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-900 border-r border-neutral-800 px-6">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Origin Data</h1>
            <p className="text-xs text-neutral-500">{user?.companyName || 'Sua Empresa'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-1">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname?.startsWith(item.href))
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-orange-500/10 text-orange-500'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 shrink-0',
                        isActive ? 'text-orange-500' : 'text-neutral-500 group-hover:text-neutral-300'
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="mb-4 p-3 bg-neutral-800 rounded-lg border border-neutral-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-neutral-500">Seu perfil</p>
              <p className="text-sm font-medium text-white">{user?.name || 'Usuário'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}