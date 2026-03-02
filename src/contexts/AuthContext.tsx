'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@/services/authService'
import type { UsuarioResponseDTO, LoginRequestDTO } from '@/types/api'

type UserRole = 'ADMIN' | 'OWNER' | 'USER'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  companyId: string
  companyName: string
  fotoUrl?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  needsOnboarding: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  completeOnboarding: (companyName: string) => void
  setUserRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Converter UsuarioResponseDTO da API para User do contexto
function mapApiUserToContextUser(apiUser: UsuarioResponseDTO): User {
  // Mapear o grupo de acesso para o role
  let role: UserRole = 'USER'
  const grupoNome = apiUser.grupoAcesso?.nome?.toUpperCase()
  if (grupoNome?.includes('ADMIN')) {
    role = 'ADMIN'
  } else if (grupoNome?.includes('OWNER') || grupoNome?.includes('DONO')) {
    role = 'OWNER'
  }

  return {
    id: apiUser.id,
    name: apiUser.nome,
    email: apiUser.email,
    role,
    companyId: apiUser.empresas?.[0]?.id || '',
    companyName: apiUser.empresas?.[0]?.nome || '',
    fotoUrl: apiUser.fotoUrl,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    try {
      const apiUser = authService.getCurrentUser()
      if (apiUser) {
        const contextUser = mapApiUserToContextUser(apiUser)
        setUser(contextUser)
        
        // Verificar se precisa de onboarding (sem empresa)
        if (!contextUser.companyName) {
          setNeedsOnboarding(true)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      // Limpar dados corrompidos
      authService.logout()
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const credentials: LoginRequestDTO = {
        email,
        senha: password,
      }
      
      const response = await authService.login(credentials)
      const contextUser = mapApiUserToContextUser(response.usuario)
      
      setUser(contextUser)
      
      // Verificar se é primeiro acesso (sem empresa)
      if (!contextUser.companyName) {
        setNeedsOnboarding(true)
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error)
      // Propagar o erro original para melhor tratamento na UI
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const completeOnboarding = (companyName: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        companyId: 'comp-' + Date.now(),
        companyName,
      }
      setUser(updatedUser)
      
      // Atualizar no localStorage também
      const apiUser = authService.getCurrentUser()
      if (apiUser && apiUser.empresas) {
        apiUser.empresas[0] = {
          ...apiUser.empresas[0],
          nome: companyName,
        }
        localStorage.setItem('user', JSON.stringify(apiUser))
      }
      
      localStorage.setItem('hasCompany', 'true')
      setNeedsOnboarding(false)
    }
  }

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      
      // Atualizar no localStorage também (para demo)
      const apiUser = authService.getCurrentUser()
      if (apiUser && apiUser.grupoAcesso) {
        apiUser.grupoAcesso.nome = role
        localStorage.setItem('user', JSON.stringify(apiUser))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        needsOnboarding,
        loading,
        login,
        logout,
        completeOnboarding,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
