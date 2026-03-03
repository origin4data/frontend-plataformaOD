'use client'

import Header from '@/components/dashboard/Header'
import Perfil from '@/components/dashboard/Perfil'
import CardsEstatisticas from '@/components/dashboard/CardsEstatisticas'
import AtividadesRecentes from '@/components/dashboard/AtividadesRecentes'
import Graficos from '@/components/dashboard/Graficos'

export default function DashboardPage() {

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden text-zinc-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 space-y-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/50">
          <Header />
          <Perfil />
        </div>
        <CardsEstatisticas />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Graficos />
          <AtividadesRecentes />
        </div>
      </div>
    </div>
  )
}
