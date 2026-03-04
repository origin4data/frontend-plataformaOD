'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, UserCircle, Check, ArrowRight, Loader2, AlertCircle, Search, Info } from 'lucide-react'
import { api } from '@/services/api'

const steps = [
  {
    id: 1,
    title: 'Informações da Empresa',
    description: 'Configure os dados principais da organização',
    icon: Building2,
  },
  {
    id: 2,
    title: 'Cliente e Segmentação',
    description: 'Crie o perfil e defina o setor de atuação',
    icon: UserCircle,
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // IDs gerados durante o processo
  const [empresaId, setEmpresaId] = useState('')

  // Dados da Etapa 1: Empresa
  const [empresaData, setEmpresaData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: ''
  })

  // Dados da Etapa 2: Cliente + Segmentação
  const [clienteData, setClienteData] = useState({
    nome: '',
    status: 'ATIVO',
    cep: '',
    numeroEndereco: '',
    complementoEndereco: '',
    segmentoId: '', // Usado apenas para filtrar no Frontend
    setoresIds: [] as number[] // Enviado para a API
  })

  // Trava de Segurança: Impede acesso se já tiver empresa
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        // VERIFICAÇÃO CORRIGIDA: Look for empresaMae
        if (user.empresaMae && user.empresaMae.id) {
          router.replace('/dashboard')
        }
      } catch (e) {
        console.error("Erro ao ler dados do usuário", e)
      }
    }
  }, [router])

  const handleNext = async () => {
    setError('')

    // REGRAS DA ETAPA 1 (CRIAR EMPRESA)
    if (currentStep === 1) {
      if (!empresaData.cnpj || !empresaData.razaoSocial) {
        setError('Preencha o CNPJ e a Razão Social para continuar.')
        return
      }

      setLoading(true)
      try {
        const cnpjLimpo = empresaData.cnpj.replace(/\D/g, '')

        const response = await api.post('/api/empresas', {
          cnpj: cnpjLimpo,
          razaoSocial: empresaData.razaoSocial,
          nomeFantasia: empresaData.nomeFantasia || empresaData.razaoSocial
        })

        if (response.data && response.data.id) {
          setEmpresaId(response.data.id)
        }

        setCurrentStep(2)
      } catch (err: any) {
        console.error('Erro ao criar empresa:', err)
        setError(err.response?.data?.message || 'Erro ao registrar empresa. Verifique os dados.')
      } finally {
        setLoading(false)
      }
      return
    }

    // REGRAS DA ETAPA 2 (CRIAR CLIENTE COM SETORES)
    if (currentStep === 2) {
      if (!clienteData.nome) {
        setError('O Nome do cliente é obrigatório.')
        return
      }
      if (clienteData.setoresIds.length === 0) {
        setError('Por favor, selecione pelo menos um setor de atuação.')
        return
      }
      if (!empresaId) {
        setError('ID da empresa não encontrado. Volte ao passo anterior e tente novamente.')
        return
      }

      setLoading(true)
      try {
        const cepLimpo = clienteData.cep.replace(/\D/g, '')

        // Envia o cliente já com a lista de setores escolhida
        await api.post('/api/clientes', {
          nome: clienteData.nome,
          empresaId: empresaId,
          status: clienteData.status,
          cep: cepLimpo,
          numeroEndereco: clienteData.numeroEndereco,
          complementoEndereco: clienteData.complementoEndereco,
          setoresIds: clienteData.setoresIds 
        })

        // Finaliza o onboarding
        handleFinish()
      } catch (err: any) {
        console.error('Erro ao criar cliente:', err)
        setError(err.response?.data?.message || 'Erro ao registrar cliente e setores. Verifique o servidor.')
        setLoading(false) // Retira o loading caso dê erro para ele poder tentar de novo
      }
      return
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    
    // Atualiza o localStorage localmente para ele não cair no Onboarding de novo
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // SALVA CORRETAMENTE O FORMATO ESPERADO: empresaMae
      user.empresaMae = { 
        id: empresaId, 
        razaoSocial: empresaData.razaoSocial,
        nomeFantasia: empresaData.nomeFantasia || empresaData.razaoSocial,
        cnpj: empresaData.cnpj.replace(/\D/g, '')
      };
      localStorage.setItem('user', JSON.stringify(user));
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-black">
      
      {/* SIDEBAR DO ONBOARDING */}
      <div className="hidden md:flex flex-col w-[340px] bg-zinc-950 border-r border-zinc-800/60 p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-orange-500/5 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 mb-12">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <span className="text-xl font-black text-black">OD</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">Origin Data</h1>
          <p className="text-zinc-400 text-sm">Configure a sua conta corporativa em passos simples.</p>
        </div>

        <div className="space-y-6 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="relative">
                {index !== steps.length - 1 && (
                  <div className={`absolute left-5 top-12 bottom-[-24px] w-[2px] ${isCompleted ? 'bg-orange-500' : 'bg-zinc-800'}`} />
                )}

                <div className={`flex items-start gap-4 transition-colors ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                        : isActive
                        ? 'bg-zinc-800 border-2 border-orange-500 text-orange-500'
                        : 'bg-zinc-900 border-2 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="pt-2">
                    <h3 className={`text-sm font-semibold mb-1 ${isActive || isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-500">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 p-8 sm:p-12 lg:p-20 overflow-y-auto relative text-zinc-300">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-zinc-400">{steps[currentStep - 1].description}</p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex items-start gap-3 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800 p-8 sm:p-10 mb-8 shadow-2xl">
            {currentStep === 1 && (
              <Step1Content 
                data={empresaData} 
                onChange={(newData) => setEmpresaData(prev => ({...prev, ...newData}))} 
              />
            )}
            {currentStep === 2 && (
              <Step2Content 
                data={clienteData}
                onChange={(newData) => setClienteData(prev => ({...prev, ...newData}))}
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-zinc-800/50">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || loading}
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-0"
            >
              Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)]"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {currentStep === steps.length ? 'Finalizar Configuração' : 'Salvar e Continuar'}
              {!loading && currentStep < steps.length && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==============================================
// ETAPA 1: EMPRESA
// ==============================================
function Step1Content({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [cnpjNotFound, setCnpjNotFound] = useState(false)

  const buscarDadosCnpj = async (cnpjLimpo: string) => {
    setLoadingCnpj(true)
    setCnpjNotFound(false)
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
      if (!response.ok) throw new Error()
      const cnpjData = await response.json()
      onChange({
        razaoSocial: cnpjData.razao_social || '',
        nomeFantasia: cnpjData.nome_fantasia || cnpjData.razao_social || ''
      })
    } catch {
      setCnpjNotFound(true)
    } finally {
      setLoadingCnpj(false)
    }
  }

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpjNotFound(false)
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 14) value = value.slice(0, 14)
    if (value.length === 14) buscarDadosCnpj(value)
    
    const masked = value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
    onChange({ cnpj: masked })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-500 flex justify-between uppercase tracking-wider">
          <span>CNPJ da Empresa</span>
          {cnpjNotFound && <span className="text-yellow-500 text-[10px]">Não encontrado. Preencha manualmente.</span>}
        </label>
        <div className="relative group">
          <input
            type="text"
            value={data.cnpj}
            onChange={handleCnpjChange}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
            placeholder="00.000.000/0000-00"
          />
          <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${loadingCnpj ? 'text-orange-500 animate-spin' : 'text-zinc-600'}`} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Razão Social *</label>
          <input
            type="text"
            value={data.razaoSocial}
            onChange={(e) => onChange({ razaoSocial: e.target.value })}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
            placeholder="Razão Social"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nome Fantasia</label>
          <input
            type="text"
            value={data.nomeFantasia}
            onChange={(e) => onChange({ nomeFantasia: e.target.value })}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
            placeholder="Nome Fantasia"
          />
        </div>
      </div>
    </div>
  )
}

// ==============================================
// ETAPA 2: CLIENTE E SEGMENTAÇÃO
// ==============================================
function Step2Content({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const [segmentos, setSegmentos] = useState<any[]>([])
  const [todosSetores, setTodosSetores] = useState<any[]>([])
  const [loadingDados, setLoadingDados] = useState(true)

  // Busca os Segmentos e Setores da sua API assim que a etapa 2 abrir
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resSeg, resSet] = await Promise.all([
          api.get('/api/segmentos'),
          api.get('/api/setores')
        ])
        setSegmentos(resSeg.data)
        setTodosSetores(resSet.data)
      } catch (err) {
        console.error("Erro ao buscar segmentos e setores:", err)
      } finally {
        setLoadingDados(false)
      }
    }
    carregarDados()
  }, [])

  // Formatação de CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2')
    onChange({ cep: value })
  }

  // Lógica quando escolhe um Segmento (limpa os setores anteriores)
  const handleSegmentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ segmentoId: e.target.value, setoresIds: [] })
  }

  // Lógica de marcar/desmarcar Setores
  const toggleSetor = (setorId: number) => {
    const isSelected = data.setoresIds.includes(setorId)
    if (isSelected) {
      onChange({ setoresIds: data.setoresIds.filter((id: number) => id !== setorId) })
    } else {
      onChange({ setoresIds: [...data.setoresIds, setorId] })
    }
  }

  // Filtra os setores para exibir na tela APENAS os do segmento escolhido
  const setoresDisponiveis = todosSetores.filter((s: any) => s.segmento?.id?.toString() === data.segmentoId?.toString())

  return (
    <div className="space-y-8">
      
      {/* BLOCO 1: DADOS DO CLIENTE */}
      <div className="space-y-6">
        <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">1. Dados Principais</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nome do Cliente *</label>
            <input
              type="text"
              value={data.nome}
              onChange={(e) => onChange({ nome: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 outline-none transition-all"
              placeholder="Nome Completo / Filial"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</label>
            <select
              value={data.status}
              onChange={(e) => onChange({ status: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 outline-none transition-all appearance-none"
            >
              <option value="ATIVO">Ativo</option>
              <option value="PENDENTE">Pendente</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CEP</label>
            <input type="text" value={data.cep} onChange={handleCepChange} className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white font-mono rounded-xl focus:border-orange-500/50 outline-none" placeholder="00000-000" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Número</label>
            <input type="text" value={data.numeroEndereco} onChange={(e) => onChange({ numeroEndereco: e.target.value })} className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-xl focus:border-orange-500/50 outline-none" placeholder="123" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Complemento</label>
            <input type="text" value={data.complementoEndereco} onChange={(e) => onChange({ complementoEndereco: e.target.value })} className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-xl focus:border-orange-500/50 outline-none" placeholder="Sala 1" />
          </div>
        </div>
      </div>

      {/* BLOCO 2: SEGMENTAÇÃO (Puxado do Banco) */}
      <div className="space-y-6 pt-4">
        <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">2. Segmentação de Mercado</h4>

        {/* ALERTA DE BOA PRÁTICA */}
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl flex gap-3 text-orange-200">
          <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <strong>Dica:</strong> Você pode criar um Cliente para cada Setor para evitar confusões de atendimento no CRM, 
            ou manter setores diferentes dentro deste mesmo Cliente (a organização dependerá das UTMs).
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Qual o Segmento?</label>
          <select 
            value={data.segmentoId} 
            onChange={handleSegmentoChange}
            disabled={loadingDados}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 outline-none appearance-none"
          >
            <option value="">{loadingDados ? 'Carregando banco de dados...' : 'Selecione um segmento...'}</option>
            {segmentos.map(seg => (
              <option key={seg.id} value={seg.id}>{seg.nome}</option>
            ))}
          </select>
        </div>

        {data.segmentoId && (
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Selecione os Setores (Pode escolher mais de um) *</label>
            {setoresDisponiveis.length === 0 ? (
              <p className="text-zinc-500 text-sm py-2">Nenhum setor cadastrado para este segmento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {setoresDisponiveis.map(setor => (
                  <label 
                    key={setor.id} 
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${data.setoresIds.includes(setor.id) ? 'bg-zinc-900 border-orange-500' : 'bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900'}`}
                  >
                    <input 
                      type="checkbox" 
                      checked={data.setoresIds.includes(setor.id)}
                      onChange={() => toggleSetor(setor.id)}
                      className="w-5 h-5 mt-0.5 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500/50" 
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{setor.nome}</p>
                      {setor.descricao && <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{setor.descricao}</p>}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}