'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/dashboard/Header'
import Perfil from '@/components/dashboard/Perfil'
import CardsEstatisticas from '@/components/dashboard/CardsEstatisticas'
import AtividadesRecentes from '@/components/dashboard/AtividadesRecentes'
import Graficos from '@/components/dashboard/Graficos'

// Tipagens atualizadas do api.ts
import { LeadResponseDTO, ClienteResponseDTO } from '@/types/api'

// Importe os seus services reais quando estiverem prontos
// import { leadService } from '@/services/leadService'
// import { clienteService } from '@/services/clienteService'

export default function DashboardPage() {
  // 1. Estados para armazenar os dados da API
  const [leads, setLeads] = useState<LeadResponseDTO[]>([])
  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 2. Busca de dados (Data Fetching)
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true)
        
        // Exemplo de como chamará a API em paralelo para máxima performance:
        // const [dadosLeads, dadosClientes] = await Promise.all([
        //   leadService.listarTodos(),
        //   clienteService.listarTodos()
        // ])
        
        // Mock temporário: arrays vazios até a integração real com o backend
        setLeads([]) 
        setClientes([])

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    carregarDados()
  }, [])

  // 3. Lógica de Negócio: Cálculo de Crescimento e Métricas
  const calcularCrescimento = (atual: number, anterior: number): { texto: string, tipo: 'positive' | 'negative' | 'neutral' } => {
    if (anterior === 0) return { texto: atual > 0 ? '+100%' : '0%', tipo: atual > 0 ? 'positive' : 'neutral' };
    
    const percentagem = Math.round(((atual - anterior) / anterior) * 100);
    
    if (percentagem > 0) return { texto: `+${percentagem}%`, tipo: 'positive' };
    if (percentagem < 0) return { texto: `${percentagem}%`, tipo: 'negative' };
    return { texto: '0%', tipo: 'neutral' };
  }

  // Definição das datas de corte
  const hoje = new Date();
  const trintaDiasAtras = new Date(new Date().setDate(hoje.getDate() - 30));
  const sessentaDiasAtras = new Date(new Date().setDate(hoje.getDate() - 60));

  // Cálculos dinâmicos: Leads
  const leadsUltimos30 = leads.filter(l => new Date(l.dataCadastro) >= trintaDiasAtras);
  const leadsAnteriores30 = leads.filter(l => new Date(l.dataCadastro) >= sessentaDiasAtras && new Date(l.dataCadastro) < trintaDiasAtras);
  const varLeads = calcularCrescimento(leadsUltimos30.length, leadsAnteriores30.length);

  // Cálculos dinâmicos: Receita Pipeline (Soma o campo 'valor')
  const receitaUltimos30 = leadsUltimos30.reduce((acc, lead) => acc + (lead.valor || 0), 0);
  const receitaAnteriores30 = leadsAnteriores30.reduce((acc, lead) => acc + (lead.valor || 0), 0);
  const varReceita = calcularCrescimento(receitaUltimos30, receitaAnteriores30);

  // Cálculos dinâmicos: Clientes
  const clientesUltimos30 = clientes.filter(c => new Date(c.dataCadastro) >= trintaDiasAtras);
  const clientesAnteriores30 = clientes.filter(c => new Date(c.dataCadastro) >= sessentaDiasAtras && new Date(c.dataCadastro) < trintaDiasAtras);
  const varClientes = calcularCrescimento(clientesUltimos30.length, clientesAnteriores30.length);

  // Cálculos dinâmicos: Clientes Ativos
  const clientesAtivosAtuais = clientes.filter(c => c.status?.toUpperCase() === 'ATIVO').length;
  const varClientesAtivos = { texto: 'Estável', tipo: 'neutral' as const }; // Assumimos neutro sem histórico de status

  // 4. Montagem do Objeto de Métricas final
  const metricas = {
    totalLeads: {
      valor: leads.length,
      variacaoTexto: varLeads.texto,
      variacaoTipo: varLeads.tipo
    },
    receitaPipeline: {
      valor: leads.reduce((acc, lead) => acc + (lead.valor || 0), 0),
      variacaoTexto: varReceita.texto,
      variacaoTipo: varReceita.tipo
    },
    totalClientes: {
      valor: clientes.length,
      variacaoTexto: varClientes.texto,
      variacaoTipo: varClientes.tipo
    },
    clientesAtivos: {
      valor: clientesAtivosAtuais,
      variacaoTexto: varClientesAtivos.texto,
      variacaoTipo: varClientesAtivos.tipo
    }
  }

  // 5. Renderização da Interface
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden text-zinc-100">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 space-y-8 pb-8 px-6 pt-6">
        
        {/* Topo: Header e Perfil */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/50">
          <Header />
          <Perfil />
        </div>
        
        {/* Feedback visual durante o carregamento da API */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-zinc-500 text-sm font-mono tracking-widest uppercase">A sincronizar dados...</span>
          </div>
        ) : (
          <>
            {/* Cards passam a receber o objeto estruturado com totais e variações */}
            <CardsEstatisticas metricas={metricas} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gráficos recebem as listas para agrupar as datas no Frontend */}
              <Graficos leads={leads} clientes={clientes} />
              
              {/* Timeline de atividades recentes */}
              <AtividadesRecentes />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
