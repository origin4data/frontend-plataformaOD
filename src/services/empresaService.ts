import { api } from './api';

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  status: 'ATIVA' | 'INATIVA';
  dataCriacao: string;
  logo?: string;
}

export interface EmpresaCreateDTO {
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}

export interface EmpresaUpdateDTO {
  nome?: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  status?: 'ATIVA' | 'INATIVA';
}

class EmpresaService {
  private baseUrl = '/api/empresas';

  // ✅ Proteção para evitar erros de SSR (Server Side Rendering)
  private isBrowser = typeof window !== 'undefined';

  async listar(): Promise<Empresa[]> {
    try {
      const response = await api.get<Empresa[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar empresas na API:', error);
      
      // ✅ Fallback: Tenta buscar do localStorage se a API falhar (útil para desenvolvimento)
      if (this.isBrowser) {
        const stored = localStorage.getItem('mock_empresas');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    }
  }

  async buscarPorId(id: string): Promise<Empresa> {
    try {
      const response = await api.get<Empresa>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar empresa ${id}:`, error);
      throw error;
    }
  }

  async criar(data: EmpresaCreateDTO): Promise<Empresa> {
    try {
      const response = await api.post<Empresa>(this.baseUrl, data);
      
      // ✅ Sincroniza com o mock local se necessário
      if (this.isBrowser) {
        const current = await this.listar();
        localStorage.setItem('mock_empresas', JSON.stringify([...current, response.data]));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  }

  async atualizar(id: string, data: EmpresaUpdateDTO): Promise<Empresa> {
    try {
      const response = await api.put<Empresa>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar empresa ${id}:`, error);
      throw error;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar empresa ${id}:`, error);
      throw error;
    }
  }
}

export const empresaService = new EmpresaService();