import { LayoutDashboard, Target, Store, Users, FolderKanban, Layers, Briefcase, Shield, Settings } from 'lucide-react'       
       


export const navegacao = [
  // Menu Principal
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'OWNER', 'USER'] },
  { name: 'Leads (CRM)', href: '/crm', icon: Target, roles: ['ADMIN', 'OWNER', 'USER'] },
  { name: 'Lojas/Unidades', href: '/lojas', icon: Store, roles: ['ADMIN', 'OWNER', 'USER'] },
  { name: 'Clientes', href: '/clientes', icon: Users, roles: ['ADMIN', 'OWNER', 'USER'] },
  { name: 'Processos', href: '/processos', icon: FolderKanban, roles: ['ADMIN', 'OWNER'] },
  
  // Menu de Estrutura Organizacional
  { name: 'Segmentos', href: '/segmentos', icon: Layers, roles: ['ADMIN', 'OWNER'] },
  { name: 'Setores', href: '/setores', icon: Briefcase, roles: ['ADMIN', 'OWNER'] },
  
  // Menu de Segurança e Acessos
{ name: 'Acessos e Permissões', href: '/acessos', icon: Shield, roles: ['ADMIN', 'OWNER'] },
  
  // Configurações Gerais
  { name: 'Configurações', href: '/configuracoes', icon: Settings, roles: ['ADMIN', 'OWNER'] },
]
