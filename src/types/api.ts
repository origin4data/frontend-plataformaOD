// src/types/api.ts

// ==================== AUTENTICAÇÃO ====================
export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface LoginResponseDTO {
  accessToken: string; 
  expiresIn?: number;
  usuario: UsuarioResponseDTO;
  setupEmpresaPendente?: boolean;
}

// ==================== USUÁRIOS ====================
export interface UsuarioResponseDTO {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  dataCadastro: string;
  fotoUrl?: string;
  grupoAcesso?: GrupoAcessoResponseDTO;
  empresas?: EmpresaResponseDTO[];
}

export interface UsuarioRequestDTO {
  nome: string;
  email: string;
  senha: string;
  grupoAcessoId: string;
  empresaId: string;
}

export interface UsuarioUpdateDTO {
  nome?: string;
  email?: string;
  grupoAcessoId?: string;
}

export interface PasswordChangeDTO {
  senhaAtual: string;
  novaSenha: string;
}

// ==================== EMPRESAS ====================
export interface EmpresaResponseDTO {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativa: boolean;
  dataCadastro: string;
}

export interface EmpresaRequestDTO {
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface EmpresaUpdateDTO {
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativa?: boolean;
}

// ==================== GRUPOS DE ACESSO ====================
export interface GrupoAcessoResponseDTO {
  id: string;
  nome: string;
  descricao?: string;
  permissoes?: PermissaoResponseDTO[];
}

export interface GrupoAcessoRequestDTO {
  nome: string;
  descricao?: string;
  permissaoIds: string[];
}

export interface GrupoAcessoUpdateDTO {
  nome?: string;
  descricao?: string;
  permissaoIds?: string[];
}

export interface PermissaoResponseDTO {
  id: string;
  nome: string;
  descricao?: string;
  recurso: string;
}

// ==================== CLIENTES ====================
export interface ClienteResponseDTO {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  status: string;
  empresaId: string;
  dataCadastro: string;
  ultimaAtualizacao: string;
}

export interface ClienteRequestDTO {
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  empresaId: string;
}

export interface ClienteUpdateDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  status?: string;
}

// ==================== LEADS ====================
export interface LeadResponseDTO {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  clienteId?: string;
  statusLeadId: number;
  valor?: number;
  observacoes?: string;
  origem?: string;
  dataCadastro: string;
  ultimaAtualizacao: string;
}

export interface LeadRequestDTO {
  nome: string;
  email?: string;
  telefone?: string;
  clienteId?: string;
  statusLeadId: number;
  valor?: number;
  observacoes?: string;
  origem?: string;
}

export interface LeadUpdateDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  statusLeadId?: number;
  valor?: number;
  observacoes?: string;
}

// ==================== FUNIL ====================
export interface FunilResponseDTO {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  posicao: number;
  empresaId: string;
  dataCadastro: string;
}

export interface FunilRequestDTO {
  nome: string;
  descricao?: string;
  posicao: number;
  empresaId: string;
}

export interface StatusFunilResponseDTO {
  id: number;
  nome: string;
  cor: string;
  posicao: number;
  funilId: string;
}

export interface StatusFunilRequestDTO {
  nome: string;
  cor: string;
  posicao: number;
  funilId: string;
}

// ==================== MENSAGENS ====================
export interface MensagemResponseDTO {
  id: string;
  leadId: string;
  texto: string;
  tipo: 'BOT' | 'HUMANO' | 'LEAD';
  dataEnvio: string;
  remetenteId?: string;
  remetente?: {
    id: string;
    nome: string;
  };
}

export interface MensagemRequestDTO {
  leadId: string;
  texto: string;
  tipo: 'BOT' | 'HUMANO' | 'LEAD';
}

// ==================== UTM ====================
export interface UtmResponseDTO {
  id: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  leadId: string;
  dataCriacao: string;
}

export interface UtmRequestDTO {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  leadId: string;
}

// ✅ CORREÇÃO: Adicionado UtmUpdateDTO para resolver erro de build
export interface UtmUpdateDTO {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// ==================== WEBHOOKS ====================
export interface WebhookConfigResponseDTO {
  id: string;
  nome: string;
  url: string;
  ativo: boolean;
  eventos: string[];
  empresaId: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
}

export interface WebhookConfigRequestDTO {
  nome: string;
  url: string;
  ativo: boolean;
  eventos: string[];
  empresaId: string;
}

export interface WebhookConfigUpdateDTO {
  nome?: string;
  url?: string;
  ativo?: boolean;
  eventos?: string[];
}

// ==================== CAMPOS CUSTOMIZADOS ====================
export interface CampoCustomizadoResponseDTO {
  id: string;
  nome: string;
  tipo: 'TEXTO' | 'NUMERO' | 'DATA' | 'BOOLEAN' | 'LISTA';
  obrigatorio: boolean;
  opcoes?: string[];
  entidade: 'LEAD' | 'CLIENTE' | 'EMPRESA';
  empresaId: string;
  dataCriacao: string;
}

export interface CampoCustomizadoRequestDTO {
  nome: string;
  tipo: 'TEXTO' | 'NUMERO' | 'DATA' | 'BOOLEAN' | 'LISTA';
  obrigatorio: boolean;
  opcoes?: string[];
  entidade: 'LEAD' | 'CLIENTE' | 'EMPRESA';
  empresaId: string;
}

export interface ValorCampoRequestDTO {
  campoId: string;
  entidadeId: string;
  valor: string;
}

// ==================== COMPATIBILIDADE (Aliases) ====================
export type CampoResponseDTO = CampoCustomizadoResponseDTO;
export type CampoRequestDTO = CampoCustomizadoRequestDTO;
export type StatusLeadResponseDTO = StatusFunilResponseDTO;
export type StatusLeadRequestDTO = StatusFunilRequestDTO;

export interface CampoPersonalizadoResponseDTO {
  id: string;
  campoId: string;
  valor: string;
  entidadeId: string;
  campo?: CampoCustomizadoResponseDTO;
}

export interface CampoPersonalizadoRequestDTO {
  campoId: string;
  entidadeId: string;
  valor: string;
}