// Baseado no SegmentoResponseDTO
export interface Segmento {
  id: number;
  nome: string;
}

// Baseado no SetorResponseDTO
export interface Setor {
  id: number;
  nome: string;
  descricao: string;
  segmento: Segmento;
}

// Baseado no PermissaoResponseDTO
export interface Permissao {
  id: string; // UUID
  nome: string;
  descricao: string;
}

// Baseado no GrupoAcessoResponseDTO
export interface GrupoAcesso {
  id: string; // UUID
  nome: string;
  permissoes: Permissao[];
}

// Props para os componentes
export interface ManagerProps<T> {
  data: T[];
  readonly?: boolean;
}

export interface GrupoAcessoManagerProps extends ManagerProps<GrupoAcesso> {
  permissoesDisponiveis: Permissao[];
}

export interface SetorManagerProps extends ManagerProps<Setor> {
  segmentos: Segmento[];
}
