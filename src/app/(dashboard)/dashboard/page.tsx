'use client'

import { 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Calendar
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user, setUserRole } = useAuth()

  const stats = [
    {
      name: 'Total de Clientes',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Leads Ativos',
      value: '342',
      change: '+8.2%',
      changeType: 'positive',
      icon: Target,
    },
    {
      name: 'Taxa de Conversão',
      value: '24.3%',
      change: '-2.1%',
      changeType: 'negative',
      icon: TrendingUp,
    },
    {
      name: 'Receita do Mês',
      value: 'R$ 142.5k',
      change: '+18.7%',
      changeType: 'positive',
      icon: DollarSign,
    },
  ]

  const recentActivities = [
    { id: 1, action: 'Novo cliente cadastrado', name: 'Maria Santos', time: '5 min atrás', type: 'client' },
    { id: 2, action: 'Lead convertido', name: 'João Silva', time: '12 min atrás', type: 'lead' },
    { id: 3, action: 'Processo finalizado', name: 'Processo #1234', time: '1 hora atrás', type: 'process' },
    { id: 4, action: 'Novo lead capturado', name: 'Ana Costa', time: '2 horas atrás', type: 'lead' },
    { id: 5, action: 'Cliente atualizado', name: 'Pedro Oliveira', time: '3 horas atrás', type: 'client' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bem-vindo, {user?.name} 👋
          </h1>
          <p className="text-neutral-400 mt-1">
            Aqui está um resumo do que está acontecendo hoje
          </p>
        </div>
        
        {/* Role Switcher (Demo purposes) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Simular perfil:</span>
          <select
            value={user?.role}
            onChange={(e) => setUserRole(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="OWNER">OWNER</option>
            <option value="USER">USER</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <stat.icon className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <p className="text-sm text-neutral-400 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Visão Geral de Vendas</h2>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-700 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors">
              <Calendar className="w-4 h-4" />
              Últimos 7 dias
            </button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <BarChart3 className="w-16 h-16 text-neutral-700" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Atividade Recente</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-neutral-800 last:border-0 last:pb-0"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'client'
                      ? 'bg-blue-500'
                      : activity.type === 'lead'
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{activity.action}</p>
                  <p className="text-sm text-neutral-400 truncate">{activity.name}</p>
                </div>
                <span className="text-xs text-neutral-500 whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
