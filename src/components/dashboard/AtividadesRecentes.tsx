import { ShieldCheck, Zap } from "lucide-react";

export default function AtividadesRecentes() {

  const recentActivities = [
    { id: 1, action: 'Novo cliente cadastrado', name: 'Maria Santos', time: '05 MIN', type: 'client' },
    { id: 2, action: 'Lead convertido', name: 'João Silva', time: '12 MIN', type: 'lead' },
    { id: 3, action: 'Processo finalizado', name: 'Processo #1234', time: '01 HOR', type: 'process' },
    { id: 4, action: 'Novo lead capturado', name: 'Ana Costa', time: '02 HOR', type: 'lead' },
    { id: 5, action: 'Cliente atualizado', name: 'Pedro Oliveira', time: '03 HOR', type: 'client' },
  ]

  return (
    <div className="relative bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800">
            <Zap className="w-4 h-4 text-orange-500" />
          </div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Fluxo Recente</h2>
        </div>
      </div>
      <div className="space-y-6 flex-1">
        {recentActivities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-start gap-4">
            {/* Linha de conexão visual */}
            {index !== recentActivities.length - 1 && (
              <div className="absolute left-2 top-6 bottom-[-24px] w-px bg-zinc-800/80" />
            )}
            <div className="relative mt-1 z-10">
              <div className={`w-4 h-4 rounded-full border-2 border-zinc-950 flex items-center justify-center ${
                activity.type === 'client' ? 'bg-blue-500' : 
                activity.type === 'lead' ? 'bg-orange-500' : 'bg-green-500'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm text-zinc-200 font-medium truncate pr-4">{activity.action}</p>
                <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/50">
                  {activity.time}
                </span>
              </div>
              <p className="text-xs text-zinc-500 truncate flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                {activity.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2.5 text-xs font-mono text-zinc-400 hover:text-orange-400 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-lg transition-colors tracking-widest uppercase">
        Ver Logs Completos
      </button>
    </div>
  )
}