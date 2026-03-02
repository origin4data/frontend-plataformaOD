import { api } from './api';

export interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  origem?: string;
  statusLead?: {
    id: number;
    nome: string;
    cor: string;
    ordem: number;
  };
  clienteId: number;
  dataCriacao: string;
  dataAtualizacao?: string;
  valor?: number;
  prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA';
  responsavel?: {
    id: string;
    nome: string;
  };
}

export interface LeadCreateDTO {
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  origem?: string;
  clienteId: number;
  statusLeadId?: number;
  valor?: number;
  prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA';
}

export interface LeadUpdateDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  mensagem?: string;
  origem?: string;
  statusLeadId?: number;
  valor?: number;
  prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA';
}

export interface LeadStatusUpdateDTO {
  statusLeadId: number;
}

class LeadService {
  private baseUrl = '/api/leads';

  async listar(): Promise<Lead[]> {
    try {
      const response = await api.get<Lead[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar leads:', error);
      return [];
    }
  }

  async buscarPorId(id: number): Promise<Lead> {
    const response = await api.get<Lead>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async criar(data: LeadCreateDTO): Promise<Lead> {
    const response = await api.post<Lead>(this.baseUrl, data);
    return response.data;
  }

  async atualizar(id: number, data: LeadUpdateDTO): Promise<Lead> {
    const response = await api.put<Lead>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async atualizarStatus(id: number, clienteId: number, data: LeadStatusUpdateDTO): Promise<Lead> {
    const response = await api.patch<Lead>(`${this.baseUrl}/${id}/status`, data, {
      params: { clienteId }
    });
    return response.data;
  }

  async deletar(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // Métodos auxiliares
  async listarStatus(clienteId?: number): Promise<Array<{ id: number; nome: string; cor: string; ordem: number }>> {
    try {
      const response = await api.get('/api/status-lead', {
        params: { clienteId }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar status:', error);
      return [];
    }
  }
}

export const leadService = new LeadService();
