import { api } from './api';
import type {
  CampoResponseDTO,
  CampoRequestDTO,
  CampoPersonalizadoResponseDTO,
  CampoPersonalizadoRequestDTO,
} from '../types/api';

export const campoService = {
  // Criar campo personalizado
  async create(data: CampoRequestDTO): Promise<CampoResponseDTO> {
    const response = await api.post<CampoResponseDTO>('/api/campos', data);
    return response.data;
  },

  // Atualizar campo
  async update(id: number, data: CampoRequestDTO): Promise<CampoResponseDTO> {
    const response = await api.put<CampoResponseDTO>(`/api/campos/${id}`, data);
    return response.data;
  },

  // Deletar campo
  async delete(id: number): Promise<void> {
    await api.delete(`/api/campos/${id}`);
  },

  // Salvar valor de campo personalizado para um lead
  async saveValue(data: CampoPersonalizadoRequestDTO): Promise<CampoPersonalizadoResponseDTO> {
    const response = await api.post<CampoPersonalizadoResponseDTO>('/api/dados-personalizados', data);
    return response.data;
  },
};
