import { api } from './api';

export interface Process {
  id: number;
  title: string;
  clienteId: number;
  clienteNome: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  assignedToId?: string;
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
  description?: string;
}

export interface ProcessCreateDTO {
  title: string;
  clienteId: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedToId?: string;
  dueDate: string;
  description?: string;
}

export interface ProcessUpdateDTO {
  title?: string;
  clienteId?: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  assignedToId?: string;
  dueDate?: string;
  description?: string;
}

class ProcessService {
  private baseUrl = '/api/processos';

  // ✅ CORREÇÃO: Adicionada verificação de 'window' para evitar erro fatal no servidor
  private getStorageKey(): string {
    if (typeof window === 'undefined') return 'processes_default';
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const empresaId = user?.empresas?.[0]?.id || 'default';
      return `processes_${empresaId}`;
    } catch {
      return 'processes_default';
    }
  }

  async listar(): Promise<Process[]> {
    try {
      // ✅ Proteção para SSR: Se estiver no servidor, retorna lista vazia imediatamente
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.getStorageKey());
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao listar processos:', error);
      return [];
    }
  }

  async buscarPorId(id: number): Promise<Process> {
    try {
      if (typeof window === 'undefined') throw new Error('Acesso apenas via cliente');
      
      const processes = await this.listar();
      const process = processes.find(p => p.id === id);
      if (!process) {
        throw new Error('Processo não encontrado');
      }
      return process;
    } catch (error) {
      console.error('Erro ao buscar processo:', error);
      throw error;
    }
  }

  async criar(data: ProcessCreateDTO): Promise<Process> {
    try {
      if (typeof window === 'undefined') throw new Error('Acesso apenas via cliente');
      
      const processes = await this.listar();
      const newProcess: Process = {
        id: Date.now(),
        ...data,
        clienteNome: 'Cliente ' + data.clienteId,
        assignedTo: 'Usuário Atual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      processes.push(newProcess);
      localStorage.setItem(this.getStorageKey(), JSON.stringify(processes));
      return newProcess;
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      throw error;
    }
  }

  async atualizar(id: number, data: ProcessUpdateDTO): Promise<Process> {
    try {
      if (typeof window === 'undefined') throw new Error('Acesso apenas via cliente');
      
      const processes = await this.listar();
      const index = processes.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Processo não encontrado');
      }
      
      processes[index] = {
        ...processes[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(this.getStorageKey(), JSON.stringify(processes));
      return processes[index];
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
      throw error;
    }
  }

  async atualizarStatus(id: number, status: Process['status']): Promise<Process> {
    return this.atualizar(id, { status });
  }

  async atualizarPrioridade(id: number, priority: Process['priority']): Promise<Process> {
    return this.atualizar(id, { priority });
  }

  async deletar(id: number): Promise<void> {
    try {
      if (typeof window === 'undefined') return;
      
      const processes = await this.listar();
      const filtered = processes.filter(p => p.id !== id);
      localStorage.setItem(this.getStorageKey(), JSON.stringify(filtered));
    } catch (error) {
      console.error('Erro ao deletar processo:', error);
      throw error;
    }
  }

  async listarClientes(): Promise<Array<{ id: number; nome: string }>> {
    try {
      const response = await api.get('/api/clientes');
      return response.data.map((c: any) => ({ id: c.id, nome: c.nome }));
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      return [];
    }
  }

  async listarUsuarios(): Promise<Array<{ id: string; nome: string }>> {
    try {
      const response = await api.get('/api/usuarios');
      return response.data.map((u: any) => ({ id: u.id, nome: u.nome }));
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  }
}

export const processService = new ProcessService();