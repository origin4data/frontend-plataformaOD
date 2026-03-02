import { api } from './api';
import type {
  WebhookConfigResponseDTO,
  WebhookConfigRequestDTO,
} from '../types/api';

export const webhookService = {
  // Listar webhooks
  async list(): Promise<WebhookConfigResponseDTO[]> {
    const response = await api.get<WebhookConfigResponseDTO[]>('/api/webhooks');
    return response.data;
  },

  // Criar webhook
  async create(data: WebhookConfigRequestDTO): Promise<WebhookConfigResponseDTO> {
    const response = await api.post<WebhookConfigResponseDTO>('/api/webhooks', data);
    return response.data;
  },

  // Nota: A API não possui endpoints de update e delete para webhooks
  // Seria necessário adicionar na API backend
};
