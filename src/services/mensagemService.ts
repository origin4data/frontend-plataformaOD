import { api } from './api';
import type {
  MensagemResponseDTO,
  MensagemRequestDTO,
} from '../types/api';

export const mensagemService = {
  // Registrar nova mensagem
  async create(data: MensagemRequestDTO): Promise<MensagemResponseDTO> {
    const response = await api.post<MensagemResponseDTO>('/api/mensagens', data);
    return response.data;
  },

  // Buscar mensagens por lead (endpoint não existe na API, seria necessário adicionar)
  async getByLeadId(leadId: number): Promise<MensagemResponseDTO[]> {
    // Este endpoint não está disponível na API fornecida
    // Você precisaria adicionar um endpoint na API backend
    // Ex: GET /api/mensagens?leadId={leadId}
    throw new Error('Endpoint getByLeadId not available in API');
  },
};
