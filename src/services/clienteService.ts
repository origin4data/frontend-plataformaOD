import { api } from './api';

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  documento?: string;
  tipo: 'PF' | 'PJ';
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'CANCELADO';
  dataCadastro: string;
  observacoes?: string;
  setores?: Array<{ id: number; nome: string }>;
  segmento?: { id: number; nome: string };
}

export interface ClienteCreateDTO {
  nome: string;
  email: string;
  telefone: string;
  documento?: string;
  tipo: 'PF' | 'PJ';
  observacoes?: string;
}

export interface ClienteUpdateDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  documento?: string;
  tipo?: 'PF' | 'PJ';
  observacoes?: string;
}

class ClienteService {
  private baseUrl = '/api/clientes';

  async listar(): Promise<Cliente[]> {
    try {
      const response = await api.get<Cliente[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      return [];
    }
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async criar(data: ClienteCreateDTO): Promise<Cliente> {
    const response = await api.post<Cliente>(this.baseUrl, data);
    return response.data;
  }

  async atualizar(id: number, data: ClienteUpdateDTO): Promise<Cliente> {
    const response = await api.put<Cliente>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async alterarStatus(id: number, status: Cliente['status']): Promise<void> {
    await api.patch(`${this.baseUrl}/${id}/status`, null, {
      params: { status }
    });
  }

  async deletar(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

export const clienteService = new ClienteService();
