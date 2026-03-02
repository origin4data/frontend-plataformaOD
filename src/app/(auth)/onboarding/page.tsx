'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, UserCircle, Target, Check, ArrowRight, Loader2, AlertCircle, Search } from 'lucide-react'
import { api } from '@/services/api'

const steps = [
  {
    id: 1,
    title: 'Informações da Empresa',
    description: 'Configure os dados principais da sua organização',
    icon: Building2,
  },
  {
    id: 2,
    title: 'Dados do Cliente',
    description: 'Crie o perfil do cliente vinculado à empresa',
    icon: UserCircle,
  },
  {
    id: 3,
    title: 'Objetivos',
    description: 'Defina suas metas principais',
    icon: Target,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [empresaId, setEmpresaId] = useState('')

  const [empresaData, setEmpresaData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: ''
  })

  const [clienteData, setClienteData] = useState({
    nome: '',
    status: 'ATIVO',
    cep: '',
    numeroEndereco: '',
    complementoEndereco: ''
  })

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
        setError(err.response?.data?.message || 'Ocorreu um erro ao registar a empresa. Verifique os dados.')
      } finally {
        setLoading(false)
      }
      return
    }

    // REGRAS DA ETAPA 2 (CRIAR CLIENTE)
    if (currentStep === 2) {
      if (!clienteData.nome) {
        setError('O Nome do cliente é obrigatório.')
        return
      }

      if (!empresaId) {
        setError('ID da empresa não encontrado. Volte ao passo anterior e tente novamente.')
        return
      }

      setLoading(true)
      try {
        const cepLimpo = clienteData.cep.replace(/\D/g, '')

        await api.post('/api/clientes', {
          nome: clienteData.nome,
          empresaId: empresaId,
          status: clienteData.status,
          cep: cepLimpo,
          numeroEndereco: clienteData.numeroEndereco,
          complementoEndereco: clienteData.complementoEndereco
        })

        setCurrentStep(3)
      } catch (err: any) {
        console.error('Erro ao criar cliente:', err)
        setError(err.response?.data?.message || 'Ocorreu um erro ao registar o cliente.')
      } finally {
        setLoading(false)
      }
      return
    }

    // FINALIZAR
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    setLoading(true)
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
          <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">Bem-vindo à Origin!</h1>
          <p className="text-zinc-400 text-sm">Configure a sua conta corporativa em poucos passos.</p>
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
        
        <div className="mt-auto relative z-10">
          <p className="text-xs text-zinc-600 font-mono">OD SYSTEM v2.0</p>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 p-8 sm:p-12 lg:p-20 overflow-y-auto relative">
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
            {currentStep === 3 && <Step3Content />}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-zinc-800/50">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || loading}
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors disabled:opacity-0"
            >
              Voltar passo
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

function Step1Content({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  
  // Transformei cnpjError num booleano de "Não Encontrado" em vez de mensagem de erro fixada
  const [cnpjNotFound, setCnpjNotFound] = useState(false)

  const buscarDadosCnpj = async (cnpjLimpo: string) => {
    setLoadingCnpj(true)
    setCnpjNotFound(false)
    
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
      
      if (!response.ok) {
        throw new Error('CNPJ não encontrado')
      }
      
      const cnpjData = await response.json()
      
      onChange({
        razaoSocial: cnpjData.razao_social || '',
        nomeFantasia: cnpjData.nome_fantasia || cnpjData.razao_social || ''
      })
    } catch (error) {
      // Se não achar, ativa o aviso visual, mas permite que o utilizador preencha manualmente
      setCnpjNotFound(true)
    } finally {
      setLoadingCnpj(false)
    }
  }

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Esconde o aviso se o utilizador voltar a apagar ou digitar números
    setCnpjNotFound(false) 

    let value = e.target.value.replace(/\D/g, '') 
    
    if (value.length > 14) value = value.slice(0, 14) 
    
    if (value.length === 14) {
      buscarDadosCnpj(value)
    }

    let maskedValue = value
    maskedValue = maskedValue.replace(/^(\d{2})(\d)/, '$1.$2')
    maskedValue = maskedValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    maskedValue = maskedValue.replace(/\.(\d{3})(\d)/, '.$1/$2')
    maskedValue = maskedValue.replace(/(\d{4})(\d)/, '$1-$2')

    onChange({ cnpj: maskedValue })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
          <span>CNPJ da Empresa</span>
          {loadingCnpj && <span className="text-orange-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> A buscar dados...</span>}
          {cnpjNotFound && <span className="text-yellow-500">Não encontrado. Pode preencher manualmente.</span>}
        </label>
        <div className="relative group">
          <input
            type="text"
            value={data.cnpj}
            onChange={handleCnpjChange}
            // Se não for encontrado, a borda fica amarelinha em vez de vermelho sangue
            className={`w-full px-5 py-4 rounded-xl bg-zinc-950 border ${cnpjNotFound ? 'border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-500/50' : 'border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/50'} text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all font-mono`}
            placeholder="00.000.000/0000-00"
          />
          <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${loadingCnpj ? 'text-orange-500 animate-pulse' : 'text-zinc-600'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Razão Social <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            value={data.razaoSocial}
            onChange={(e) => onChange({ razaoSocial: e.target.value })}
            className={`w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all ${loadingCnpj ? 'opacity-50' : ''}`}
            placeholder="Ex: Origin Data LTDA"
            readOnly={loadingCnpj}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Nome Fantasia <span className="text-zinc-700">(Opcional)</span>
          </label>
          <input
            type="text"
            value={data.nomeFantasia}
            onChange={(e) => onChange({ nomeFantasia: e.target.value })}
            className={`w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all ${loadingCnpj ? 'opacity-50' : ''}`}
            placeholder="Ex: Origin Platform"
            readOnly={loadingCnpj}
          />
        </div>
      </div>
    </div>
  )
}

function Step2Content({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2')
    }
    onChange({ cep: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Nome do Cliente <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            value={data.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
            placeholder="Nome do cliente ou parceiro"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Status Inicial
          </label>
          <select
            value={data.status}
            onChange={(e) => onChange({ status: e.target.value })}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none"
          >
            <option value="ATIVO">Ativo</option>
            <option value="PENDENTE">Pendente</option>
            <option value="INATIVO">Inativo</option>
            <option value="SUSPENSO">Suspenso</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800/50">
        <h4 className="text-sm font-medium text-white mb-4">Endereço do Cliente</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2 sm:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              CEP
            </label>
            <input
              type="text"
              value={data.cep}
              onChange={handleCepChange}
              className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono"
              placeholder="00000-000"
            />
          </div>

          <div className="space-y-2 sm:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Número
            </label>
            <input
              type="text"
              value={data.numeroEndereco}
              onChange={(e) => onChange({ numeroEndereco: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
              placeholder="Ex: 123"
            />
          </div>

          <div className="space-y-2 sm:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Complemento
            </label>
            <input
              type="text"
              value={data.complementoEndereco}
              onChange={(e) => onChange({ complementoEndereco: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
              placeholder="Ex: Sala 2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Step3Content() {
  const objetivos = ['Gestão de Clientes', 'CRM e Vendas', 'Controlo de Processos', 'Gestão de Equipa']
  
  return (
    <div className="space-y-4">
      <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
        Selecione os principais objetivos para personalizar a sua experiência inicial na plataforma.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {objetivos.map((goal) => (
          <label key={goal} className="flex items-center gap-4 p-5 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-zinc-700 cursor-pointer transition-all group">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500/50 focus:ring-offset-0 focus:ring-1" 
            />
            <span className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">{goal}</span>
          </label>
        ))}
      </div>
    </div>
  )
}