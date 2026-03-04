'use client'

import { useMemo } from 'react'
import { ShieldCheck, Zap } from "lucide-react"
import { AtividadesRecentesProps } from '@/types/atividadesRecentes'
// Ajuste o caminho se necessário

export default function AtividadesRecentes({ leads = [], clientes = [] }: AtividadesRecentesProps) {

  // Função auxiliar para calcular o tempo passado no formato "XX MIN", "XX HOR" ou "XX DIA"
  const calcularTempoDecorrido = (dataIso: string) => {
    if (!dataIso) return '-- MIN';
    
    const passado = new Date(dataIso).getTime();
    const agora = new Date().getTime();
    const diffEmMinutos = Math.floor((agora - passado) / (1000 * 60));

    if (diffEmMinutos < 1) return 'AGORA';
    if (diffEmMinutos < 60) return `${String(diffEmMinutos).padStart(2, '0')} MIN`;
    
    const diffEmHoras = Math.floor(diffEmMinutos / 60);
    if (diffEmHoras < 24) return `${String(diffEmHoras).padStart(2, '0')} HOR`;
    
    const diffEmDias = Math.floor(diffEmHoras / 24);
    return `${String(diffEmDias).padStart(2, '0')} DIA`;
  }

  // Lógica de negócio: Mapear, unir e ordenar as atividades
  const recentActivities = useMemo(() => {
    // 1. Mapear Leads
    const atividadesLeads = leads.map(lead => {
      // Usa a ultimaAtualizacao se existir, senão usa dataCadastro
      const dataAtividade = lead.ultimaAtualizacao || lead.dataCadastro;
      const isNovo = lead.dataCadastro === lead.ultimaAtualizacao || !lead.ultimaAtualizacao;

      return {
        id: `lead-${lead.id}`,
        action: isNovo ? 'Novo lead capturado' : 'Lead atualizado',
        name: lead.nome,
        date: new Date(dataAtividade),
        timeText: calcularTempoDecorrido(dataAtividade),
        type: 'lead' as const
      }
    });

    // 2. Mapear Clientes
    const atividadesClientes = clientes.map(cliente => {
      const dataAtividade = cliente.ultimaAtualizacao || cliente.dataCadastro;
      const isNovo = cliente.dataCadastro === cliente.ultimaAtualizacao || !cliente.ultimaAtualizacao;

      return {
        id: `cliente-${cliente.id}`,
        action: isNovo ? 'Novo cliente cadastrado' : 'Cliente atualizado',
        name: cliente.nome,
        date: new Date(dataAtividade),
        timeText: calcularTempoDecorrido(dataAtividade),
        type: 'client' as const
      }
    });

    // 3. Unir, ordenar pela data mais recente e extrair os 5 primeiros
    return [...atividadesLeads, ...atividadesClientes]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5); // Limita a 5 itens na timeline

  }, [leads, clientes]); // Recalcula apenas quando as listas mudarem

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
        {recentActivities.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500 text-sm font-mono tracking-widest text-center">Nenhuma atividade recente.</p>
          </div>
        ) : (
          recentActivities.map((activity, index) => (
            <div key={activity.id} className="relative flex items-start gap-4 group">
              {/* Linha vertical da timeline */}
              {index !== recentActivities.length - 1 && (
                <div className="absolute left-2 top-6 bottom-[-24px] w-px bg-zinc-800/80 group-hover:bg-zinc-700 transition-colors" />
              )}
              
              {/* Ponto / Bolinha da timeline */}
              <div className="relative mt-1 z-10">
                <div className={`w-4 h-4 rounded-full border-2 border-zinc-950 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                  activity.type === 'client' ? 'bg-blue-500 shadow-blue-500/20' : 
                  activity.type === 'lead' ? 'bg-orange-500 shadow-orange-500/20' : 'bg-green-500'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                </div>
              </div>
              
              {/* Conteúdo da Atividade */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm text-zinc-200 font-medium truncate pr-4">{activity.action}</p>
                  <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/50 flex-shrink-0">
                    {activity.timeText}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-zinc-600" />
                  {activity.name}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="w-full mt-6 py-2.5 text-xs font-mono text-zinc-400 hover:text-orange-400 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-lg transition-colors tracking-widest uppercase">
        Ver Logs Completos
      </button>
    </div>
  )
}
