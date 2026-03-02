'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, Target, Check, ArrowRight, Loader2 } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Informações da Empresa',
    description: 'Conte-nos sobre sua organização',
    icon: Building2,
  },
  {
    id: 2,
    title: 'Configurar Equipe',
    description: 'Adicione membros da sua equipe',
    icon: Users,
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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-neutral-900">
      {/* Sidebar */}
      <div className="w-80 bg-neutral-800 border-r border-neutral-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo!</h1>
        <p className="text-neutral-400 mb-8">Configure sua conta em poucos passos</p>

        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                  isActive ? 'bg-orange-500/10 border border-orange-500/30' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-orange-500 text-white'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div>
                  <h3
                    className={`font-medium ${
                      isActive ? 'text-white' : 'text-neutral-400'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-500">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-neutral-400">{steps[currentStep - 1].description}</p>
          </div>

          {/* Step Content */}
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 p-8 mb-8">
            {currentStep === 1 && <Step1Content />}
            {currentStep === 2 && <Step2Content />}
            {currentStep === 3 && <Step3Content />}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {currentStep === steps.length ? 'Finalizar' : 'Próximo'}
              {!loading && currentStep < steps.length && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step1Content() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Nome da Empresa
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Origin Data"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">CNPJ</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="00.000.000/0000-00"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Setor</label>
        <select className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option>Tecnologia</option>
          <option>Consultoria</option>
          <option>Varejo</option>
          <option>Serviços</option>
        </select>
      </div>
    </div>
  )
}

function Step2Content() {
  return (
    <div className="space-y-4">
      <p className="text-neutral-400 mb-4">
        Adicione membros da equipe que terão acesso à plataforma
      </p>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Email do membro
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            className="flex-1 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="email@exemplo.com"
          />
          <button className="px-6 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors">
            Convidar
          </button>
        </div>
      </div>
    </div>
  )
}

function Step3Content() {
  return (
    <div className="space-y-4">
      <p className="text-neutral-400 mb-4">
        Selecione os principais objetivos para usar a plataforma
      </p>
      {['Gestão de Clientes', 'CRM e Vendas', 'Controle de Processos', 'Gestão de Equipe'].map(
        (goal) => (
          <label key={goal} className="flex items-center gap-3 p-4 rounded-lg border border-neutral-700 hover:bg-neutral-900 cursor-pointer transition-colors">
            <input type="checkbox" className="w-5 h-5 rounded border-neutral-600 text-orange-500 focus:ring-orange-500" />
            <span className="text-white">{goal}</span>
          </label>
        )
      )}
    </div>
  )
}
