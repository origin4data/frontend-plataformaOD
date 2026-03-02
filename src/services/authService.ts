import { api, USE_MOCK_API } from './api';
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  UsuarioRequestDTO,
  UsuarioResponseDTO,
  UsuarioUpdateDTO,
  PasswordChangeDTO,
} from '../types/api';

// Mock de dados para desenvolvimento
const MOCK_USERS: Record<string, UsuarioResponseDTO> = {
  'admin@origindata.com.br': {
    id: '1',
    nome: 'Admin Origin Data',
    email: 'admin@origindata.com.br',
    ativo: true,
    dataCadastro: new Date().toISOString(),
    grupoAcesso: {
      id: 'grupo-1',
      nome: 'ADMIN',
      descricao: 'Administrador do sistema',
    },
    empresas: [
      {
        id: 'empresa-1',
        nome: 'Origin Data',
        ativa: true,
        dataCadastro: new Date().toISOString(),
      },
    ],
  },
  'user@origindata.com.br': {
    id: '2',
    nome: 'Usuário Teste',
    email: 'user@origindata.com.br',
    ativo: true,
    dataCadastro: new Date().toISOString(),
    grupoAcesso: {
      id: 'grupo-2',
      nome: 'USER',
      descricao: 'Usuário padrão',
    },
    empresas: [
      {
        id: 'empresa-1',
        nome: 'Origin Data',
        ativa: true,
        dataCadastro: new Date().toISOString(),
      },
    ],
  },
};

// Função auxiliar para criar usuário mockado dinamicamente
function createMockUser(email: string): UsuarioResponseDTO {
  // Determinar role baseado no email
  let role = 'USER';
  let roleDesc = 'Usuário padrão';
  
  if (email.includes('admin')) {
    role = 'ADMIN';
    roleDesc = 'Administrador do sistema';
  } else if (email.includes('owner') || email.includes('dono')) {
    role = 'OWNER';
    roleDesc = 'Proprietário';
  }
  
  // Extrair nome do email
  const userName = email.split('@')[0]
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  
  return {
    id: `mock-${Date.now()}`,
    nome: userName || 'Usuário Demo',
    email,
    ativo: true,
    dataCadastro: new Date().toISOString(),
    grupoAcesso: {
      id: `grupo-${Date.now()}`,
      nome: role,
      descricao: roleDesc,
    },
    empresas: [
      {
        id: 'empresa-1',
        nome: 'Origin Data',
        ativa: true,
        dataCadastro: new Date().toISOString(),
      },
    ],
  };
}

const MOCK_TOKEN = 'mock-jwt-token-12345';

export const authService = {
  // Autenticar usuário
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await api.post<LoginResponseDTO>('/api/auth/autenticar', credentials);
      
      // Salvar token no localStorage (API retorna "accessToken")
      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error: any) {
      // Fallback para modo mock em caso de erro de rede
      const errorMsg = error.response?.data?.message || error.message;
      console.warn('API indisponível, ativando modo demo...', errorMsg);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Validar que tem email e senha
      if (!credentials.email || !credentials.senha) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      // Tentar encontrar usuário mockado pré-definido
      let mockUser = MOCK_USERS[credentials.email as keyof typeof MOCK_USERS];
      
      // Se não encontrar e for modo demo (senha demo123), criar usuário dinamicamente
      if (!mockUser && credentials.senha === 'demo123') {
        console.info('Criando usuário demo temporário para:', credentials.email);
        mockUser = createMockUser(credentials.email);
      }
      
      // Se ainda não tiver usuário, rejeitar
      if (!mockUser) {
        throw new Error('API indisponível. Use senha "demo123" para entrar no modo demonstração ou aguarde a API voltar.');
      }
      
      const mockResponse: LoginResponseDTO = {
        accessToken: MOCK_TOKEN, // Usar accessToken em vez de token
        usuario: mockUser,
      };
      
      // Salvar token no localStorage
      localStorage.setItem('authToken', mockResponse.accessToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.usuario));
      
      return mockResponse;
    }
  },

  // Registrar novo usuário
  async register(userData: UsuarioRequestDTO): Promise<UsuarioResponseDTO> {
    const response = await api.post<UsuarioResponseDTO>('/api/usuarios/registrar', userData);
    return response.data;
  },

  // Solicitar recuperação de senha
  async requestPasswordRecovery(email: string): Promise<void> {
    await api.post('/api/auth/recuperar-senha', { email });
  },

  // Redefinir senha com token
  async resetPassword(token: string, novaSenha: string): Promise<void> {
    await api.post('/api/auth/redefinir-senha', { token, novaSenha });
  },

  // Atualizar perfil do usuário autenticado
  async updateProfile(data: UsuarioUpdateDTO, foto?: File): Promise<UsuarioResponseDTO> {
    const formData = new FormData();
    formData.append('dados', JSON.stringify(data));
    if (foto) {
      formData.append('foto', foto);
    }

    const response = await api.put<UsuarioResponseDTO>('/api/usuarios/atualizar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Atualizar usuário no localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  },

  // Alterar senha
  async changePassword(data: PasswordChangeDTO): Promise<void> {
    await api.patch('/api/usuarios/senha', data);
  },

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Obter usuário atual do localStorage
  getCurrentUser(): UsuarioResponseDTO | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
};