'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, UserCircle, Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { api } from '@/services/api'
import { Step1Company } from './components/Step1Company'
import { Step2Client } from './components/Step2Client'

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
    complementoEndereco: '',
    segmentoId: '', 
    setoresIds: [] as number[] 
  })

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.empresaMae && user.empresaMae.id) {
          setEmpresaId(user.empresaMae.id)
          setEmpresaData({
            cnpj: user.empresaMae.cnpj || '',
            razaoSocial: user.empresaMae.razaoSocial || '',
            nomeFantasia: user.empresaMae.nomeFantasia || ''
          })
          setCurrentStep(2)
        }
      } catch (e) {
        console.error("Erro ao ler dados do usuário", e)
      }
    }
  }, [])

  const handleNext = async () => {
    setError('')

    if (currentStep === 1) {
      if (!empresaData.cnpj || !empresaData.razaoSocial) {
        setError('Preencha o CNPJ e a Razão Social para continuar.')
        return
      }

      setLoading(true)
      try {
        const cnpjLimpo = empresaData.cnpj.replace(/\D/g, '')

        if (!empresaId) {
          const response = await api.post('/api/empresas', {
            cnpj: cnpjLimpo,
            razaoSocial: empresaData.razaoSocial,
            nomeFantasia: empresaData.nomeFantasia || empresaData.razaoSocial
          })

          if (response.data && response.data.id) {
            setEmpresaId(response.data.id)
          }
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

        await api.post('/api/clientes', {
          nome: clienteData.nome,
          empresaId: empresaId,
          status: clienteData.status,
          cep: cepLimpo,
          numeroEndereco: clienteData.numeroEndereco,
          complementoEndereco: clienteData.complementoEndereco,
          setoresIds: clienteData.setoresIds 
        })

        handleFinish()
      } catch (err: any) {
        console.error('Erro ao criar cliente:', err)
        setError(err.response?.data?.message || 'Erro ao registrar cliente e setores. Verifique o servidor.')
        setLoading(false)
      }
      return
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
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
              <Step1Company 
                data={empresaData} 
                onChange={(newData) => setEmpresaData(prev => ({...prev, ...newData}))} 
              />
            )}
            {currentStep === 2 && (
              <Step2Client 
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