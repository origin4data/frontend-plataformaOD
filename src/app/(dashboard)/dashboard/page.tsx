'use client'

import { BarChart3, Calendar, Activity} from 'lucide-react'
import Header from '@/components/dashboard/Header'
import Perfil from '@/components/dashboard/Profile'
import CardsEstatisticas from '@/components/dashboard/CardsEstatisticas'
import AtividadesRecentes from '@/components/dashboard/AtividadesRecentes'

export default function DashboardPage() {

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden text-zinc-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 space-y-8 pb-8">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/50">
          <Header />
          {/* Seletor de Perfil (Visual Tecnológico) */}
          <Perfil />
        </div>
        {/* CARDS DE ESTATÍSTICAS */}
        <CardsEstatisticas />
        {/* SECÇÃO INFERIOR: GRÁFICO E ATIVIDADES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico */}
          <div className="lg:col-span-2 relative bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-xl overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800">
                  <Activity className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Desempenho da Operação</h2>
              </div>
              
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono hover:text-white hover:border-zinc-700 transition-colors">
                <Calendar className="w-3.5 h-3.5" />
                <span>ÚLTIMOS 7 DIAS</span>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] border border-dashed border-zinc-800/80 rounded-lg relative z-10 bg-zinc-900/20">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
              <BarChart3 className="w-12 h-12 text-zinc-700 mb-4" />
              <p className="text-zinc-500 text-sm font-mono tracking-widest">A aguardar telemetria de dados...</p>
            </div>
          </div>

          {/* Atividade Recente */}
          <AtividadesRecentes />
          
        </div>
      </div>
    </div>
  )
}
