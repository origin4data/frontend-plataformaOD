import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { stats } from '@/mock/stats'
export default function CardsEstatisticas() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="group relative bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-xl overflow-hidden hover:border-orange-500/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 shadow-inner group-hover:border-orange-500/20 group-hover:bg-orange-500/10 transition-colors">
                <stat.icon className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-mono font-medium px-2 py-1 rounded-md border ${
                  stat.changeType === 'positive' 
                    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                }`}
              >
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-white tracking-tight font-mono">{stat.value}</h3>
              <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wider font-semibold">{stat.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
