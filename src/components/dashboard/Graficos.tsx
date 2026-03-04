'use client'

import { useMemo } from 'react'
import { Activity, BarChart3, Calendar } from "lucide-react"

// Importamos as tipagens exatas do seu novo api.ts
import { LeadResponseDTO, ClienteResponseDTO } from '@/types/api'

interface GraficosProps {
  leads: LeadResponseDTO[];
  clientes: ClienteResponseDTO[];
}

export default function Graficos({ leads = [], clientes = [] }: GraficosProps) {
  
  // 1. Lógica de Processamento de Dados (Telemetria)
  // Agrupa a quantidade de Leads e Clientes por dia (com base na dataCadastro)
  const dadosDoGrafico = useMemo(() => {
    const mapaDias = new Map<string, { data: string; leads: number; clientes: number }>()

    // Função auxiliar para extrair apenas a data (YYYY-MM-DD) da string ISO
    const extrairData = (isoString: string) => {
      if (!isoString) return null
      return new Date(isoString).toISOString().split('T')[0]
    }

    // Processar Leads
    leads.forEach(lead => {
      const data = extrairData(lead.dataCadastro)
      if (data) {
        const registro = mapaDias.get(data) || { data, leads: 0, clientes: 0 }
        registro.leads += 1
        mapaDias.set(data, registro)
      }
    })

    // Processar Clientes
    clientes.forEach(cliente => {
      const data = extrairData(cliente.dataCadastro)
      if (data) {
        const registro = mapaDias.get(data) || { data, leads: 0, clientes: 0 }
        registro.clientes += 1
        mapaDias.set(data, registro)
      }
    })

    // Converter Map para Array e ordenar por data (mais antigo para mais recente)
    return Array.from(mapaDias.values()).sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    )
  }, [leads, clientes])

  return (
    <div className="lg:col-span-2 relative bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-xl overflow-hidden flex flex-col">
      {/* Efeitos visuais de fundo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Cabeçalho do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800">
            <Activity className="w-4 h-4 text-orange-500" />
          </div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Evolução de Cadastros
          </h2>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono hover:text-white hover:border-zinc-700 transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          <span>ÚLTIMOS DIAS</span>
        </button>
      </div>
      
      {/* Área do Gráfico */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] border border-dashed border-zinc-800/80 rounded-lg relative z-10 bg-zinc-900/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        {/* Placeholder enquanto não instala uma biblioteca de gráficos */}
        <div className="flex flex-col items-center relative z-20">
          <BarChart3 className="w-12 h-12 text-zinc-700 mb-4" />
          <p className="text-zinc-500 text-sm font-mono tracking-widest text-center">
            {dadosDoGrafico.length > 0 
              ? `Dados processados para ${dadosDoGrafico.length} dias distintos.` 
              : 'A aguardar telemetria de dados...'}
          </p>
          {dadosDoGrafico.length > 0 && (
             <p className="text-zinc-600 text-xs mt-2">Pronto para renderizar com Recharts/Chart.js</p>
          )}
        </div>

        {/* EXEMPLO DE INTEGRAÇÃO COM RECHARTS (npm install recharts):
          
          import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

          <div className="w-full h-full min-h-[250px] relative z-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosDoGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="data" stroke="#52525b" fontSize={12} tickFormatter={(tick) => tick.split('-').reverse().slice(0,2).join('/')} />
                <YAxis stroke="#52525b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
                <Legend />
                <Bar dataKey="leads" name="Leads" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clientes" name="Clientes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        */}
      </div>
    </div>
  )
}