import { LeadResponseDTO, ClienteResponseDTO } from '@/types/api' 
export interface AtividadesRecentesProps {
  leads?: LeadResponseDTO[];
  clientes?: ClienteResponseDTO[];
}
