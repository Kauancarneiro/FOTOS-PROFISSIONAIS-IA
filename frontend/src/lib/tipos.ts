export interface Pacote {
  id: number;
  nome: string;
  preco: string;
  quantidadeFotos: number;
  quantidadeEstilos: number | null;
  prioridade: boolean;
}

export interface Estilo {
  id: number;
  slug: string;
  nome: string;
  descricao: string | null;
}

export interface Catalogo {
  pacotes: Pacote[];
  estilos: Estilo[];
}
