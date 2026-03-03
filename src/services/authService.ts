import { api } from './api';
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  UsuarioResponseDTO,
  UsuarioUpdateDTO,
  UsuarioRequestDTO,
  PasswordChangeDTO,
} from '../types/api';

// Token com prefixo claro para o sistema saber que não deve enviar para o servidor real
const MOCK_TOKEN = 'mock-demo-session-token';

export const authService = {
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      // 1. Tentativa real no servidor
      const response = await api.post<LoginResponseDTO>('/api/auth/autenticar', credentials);
      
      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error: any) {
      // 2. Se o erro for 401 (Senha errada), não entra em modo demo. Avisa o usuário.
      if (error.response?.status === 401) {
        throw new Error('E-mail ou senha incorretos.');
      }

      // 3. MODO DEMO: Só ativa se a senha for a secreta ou a API estiver fora do ar
      if (credentials.senha === 'demo123') {
        console.warn('Entrando em modo demonstração...');
        
        const mockUser: UsuarioResponseDTO = {
          id: 'demo-id',
          nome: 'Usuário Demo',
          email: credentials.email,
          ativo: true,
          dataCadastro: new Date().toISOString(),
          grupoAcesso: { id: '1', nome: 'ADMIN', descricao: 'Admin' },
          empresas: []
        };

        localStorage.setItem('authToken', MOCK_TOKEN);
        localStorage.setItem('user', JSON.stringify(mockUser));

        return { accessToken: MOCK_TOKEN, usuario: mockUser };
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao conectar com o servidor.');
    }
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser(): UsuarioResponseDTO | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  // Mantendo os outros métodos conforme seu código original...
  async register(userData: UsuarioRequestDTO): Promise<UsuarioResponseDTO> {
    const response = await api.post<UsuarioResponseDTO>('/api/usuarios/registrar', userData);
    return response.data;
  },
  async requestPasswordRecovery(email: string): Promise<void> {
    await api.post('/api/auth/recuperar-senha', { email });
  },
  async resetPassword(token: string, novaSenha: string): Promise<void> {
    await api.post('/api/auth/redefinir-senha', { token, novaSenha });
  },
  async updateProfile(data: UsuarioUpdateDTO, foto?: File): Promise<UsuarioResponseDTO> {
    const formData = new FormData();
    formData.append('dados', JSON.stringify(data));
    if (foto) formData.append('foto', foto);
    const response = await api.put<UsuarioResponseDTO>('/api/usuarios/atualizar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },
  async changePassword(data: PasswordChangeDTO): Promise<void> {
    await api.patch('/api/usuarios/senha', data);
  },
};