import { api } from './api';
import type {
  UtmResponseDTO,
  UtmRequestDTO,
  UtmUpdateDTO,
} from '../types/api';

export const utmService = {
  // Criar UTM para um lead
  async create(data: UtmRequestDTO): Promise<UtmResponseDTO> {
    const response = await api.post<UtmResponseDTO>('/api/utms', data);
    return response.data;
  },

  // Atualizar UTM
  async update(id: number, data: UtmUpdateDTO): Promise<UtmResponseDTO> {
    const response = await api.put<UtmResponseDTO>(`/api/utms/${id}`, data);
    return response.data;
  },
};
