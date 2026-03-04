'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

import logoOD from '../../../assets/logood.png'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      
      setLoginSuccess(true)
      
      setTimeout(() => {
        // --- INÍCIO DA VERIFICAÇÃO INTELIGENTE ---
        const userStr = localStorage.getItem('user')
        let hasEmpresas = false

        if (userStr) {
          const user = JSON.parse(userStr)
          // Verifica se o array de empresas existe e tem pelo menos 1 item
          if (user.empresas && user.empresas.length > 0) {
            hasEmpresas = true
          }
        }

        // Redireciona com base no status do usuário
        if (hasEmpresas) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
        // --- FIM DA VERIFICAÇÃO INTELIGENTE ---
      }, 2500)

    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
      setLoading(false)
    }
  }

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-all duration-700 ease-in-out ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="relative flex flex-col items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 blur-2xl rounded-full" />
          
          <img 
            src={logoOD.src} 
            alt="Origin Data" 
            className="w-20 h-20 object-contain mb-6 animate-pulse relative z-10"
          />
          <div className="flex items-center gap-3 text-zinc-500 text-sm font-medium tracking-widest uppercase">
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            Iniciando Plataforma
          </div>
        </div>
      </div>

      <div 
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-in-out ${
          loginSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative flex flex-col items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500/10 blur-[60px] rounded-full" />
          
          <img 
            src={logoOD.src} 
            alt="Origin Data" 
            className="w-24 h-24 object-contain mb-8 animate-pulse relative z-10"
          />
          
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="flex items-center gap-2 text-green-500 text-sm font-semibold tracking-widest uppercase">
              <ShieldCheck className="w-5 h-5" />
              Acesso Liberado
            </div>
            <div className="flex items-center gap-3 text-zinc-400 text-xs font-mono tracking-widest uppercase">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              Estabelecendo conexão segura...
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <div className="min-h-screen w-full flex bg-black">
        
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 z-10 relative bg-black overflow-hidden">
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-[540px] relative z-10 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col backdrop-blur-xl">
            
            <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center px-5 justify-between select-none">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 border border-red-500/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 border border-yellow-500/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 border border-green-500/50" />
              </div>

              <div className="flex items-center justify-center gap-2 px-6 py-2 bg-zinc-950 border border-zinc-800 rounded-md absolute left-1/2 -translate-x-1/2">
                <Lock className="w-3.5 h-3.5 text-green-500" />
                <span className="text-sm font-mono text-zinc-400">app.origindata.com</span>
              </div>

              <div className="w-16" />
            </div>

            <div className="p-8 sm:p-12 flex flex-col">
              
              <div className="mb-10 text-center flex flex-col items-center">
                <img 
                  src={logoOD.src} 
                  alt="Origin Data Logo" 
                  className="w-16 h-16 object-contain mb-6"
                />
                <h1 className="text-3xl font-semibold text-white mb-3 tracking-tight">
                  ORIGIN DATA
                </h1>
                <p className="text-zinc-400 text-sm lg:text-base leading-relaxed max-w-sm">
                  Autentique-se com suas credenciais para acessar o painel de controle.
                </p>
              </div>

              {error && (
                <div className="mb-8 p-4 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    E-mail Corporativo
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono text-sm"
                      placeholder="user@origindata.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Senha de Acesso
                    </label>
                    <a href="#" className="text-xs font-medium text-zinc-500 hover:text-orange-500 transition-colors">
                      Recuperar senha
                    </a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono text-sm tracking-widest"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 py-4 rounded-lg bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Autenticar Conexão
                      <ArrowRight className="w-5 h-5 ml-1 opacity-70" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="absolute bottom-8 w-full flex justify-between px-12 z-10 pointer-events-none opacity-50">
             <p className="text-zinc-500 text-xs font-mono">OD SYSTEM v2.0</p>
             <p className="text-zinc-500 text-xs">© 2024 Origin Data</p>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="Origin Data Platform" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-orange-500/5 mix-blend-overlay" />

          <div className="relative z-10 p-16 w-full max-w-2xl flex flex-col justify-center">
            <div className="flex gap-2 mb-6">
              <div className="w-12 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              <div className="w-3 h-1 bg-zinc-700 rounded-full" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 leading-[1.15] tracking-tight">
              A inteligência por trás<br />
              <span className="text-orange-500">dos seus processos.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md font-light">
              Plataforma unificada para controle de automações, gestão de fluxo e análise avançada de dados corporativos.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}