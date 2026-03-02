import { api } from './api';
import type {
  FunilResponseDTO,
  FunilRequestDTO,
  StatusLeadResponseDTO,
  StatusLeadRequestDTO,
} from '../types/api';

export const funilService = {
  // Criar funil
  async create(data: FunilRequestDTO): Promise<FunilResponseDTO> {
    const response = await api.post<FunilResponseDTO>('/api/funis', data);
    return response.data;
  },

  // Buscar funil por ID
  async getById(id: number): Promise<FunilResponseDTO> {
    const response = await api.get<FunilResponseDTO>(`/api/funis/${id}`);
    return response.data;
  },

  // Atualizar funil
  async update(id: number, data: FunilRequestDTO): Promise<FunilResponseDTO> {
    const response = await api.put<FunilResponseDTO>(`/api/funis/${id}`, data);
    return response.data;
  },

  // Deletar funil
  async delete(id: number): Promise<void> {
    await api.delete(`/api/funis/${id}`);
  },

  // Criar status no funil
  async createStatus(data: StatusLeadRequestDTO): Promise<StatusLeadResponseDTO> {
    const response = await api.post<StatusLeadResponseDTO>('/api/status-lead', data);
    return response.data;
  },

  // Atualizar status
  async updateStatus(id: number, data: StatusLeadRequestDTO): Promise<StatusLeadResponseDTO> {
    const response = await api.put<StatusLeadResponseDTO>(`/api/status-lead/${id}`, data);
    return response.data;
  },

  // Deletar status
  async deleteStatus(id: number): Promise<void> {
    await api.delete(`/api/status-lead/${id}`);
  },
};
