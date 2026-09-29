export type AssetCategory = 
  | 'Veículos e Frotas'
  | 'Equipamentos Hospitalares'
  | 'Mobiliário e Escritório'
  | 'Activos Biológicos'
  | 'Equipamentos de TI'
  | 'Instalações e Edifícios';

export type AssetCondition = 'Novo' | 'Bom' | 'Razoável' | 'Mau' | 'Obsoleto' | 'Inoperante';

export type AssetAuditStatus = 'Conferido e Conforme' | 'Divergência de Qtd' | 'Divergência de Estado' | 'Pendente de Vistoria' | 'Não Localizado';

export type RecommendedAction = 
  | 'Manter em Uso'
  | 'Manutenção Preventiva'
  | 'Reparação Correctiva'
  | 'Abate / Alienação'
  | 'Transferência de Sector'
  | 'Calibração Biomédica'
  | 'Manejo Sanitário / Veterinário'
  | 'Leilão / Descarte';

export interface Asset {
  id: string; // Internal UUID
  patrimonioId: string; // Ex: PAT-2026-001 (Código de Tombamento)
  
  // Exact 27 columns from spreadsheet image
  carimboDataHora: string; // Carimbo de data/hora
  tipoActivo: AssetCategory; // Tipo de Activo
  piso: string; // Piso
  direccao: string; // Direcção
  departamento: string; // Departamento
  sala: string; // Sala
  descricao: string; // Descrição
  cor: string; // Cor
  tipo: string; // Tipo (Subcategoria)
  marca: string; // Marca
  quantidade: number; // Quantidade
  estado: AssetCondition; // Estado
  accao: RecommendedAction; // Acção
  qtdBomEstado: number; // Quantidade em Bom Estado
  qtdMauEstado: number; // Quantidade em Mau Estado
  valorAquisicao: number; // Valor de Aquisição
  foto: string; // Foto (URL ou imagem importada)
  tipo2: string; // Tipo 2 (Segmentação secundária)
  especie: string; // Espécie (Essencial para Activos Biológicos ou espécime técnico)
  finalidade: string; // Finalidade
  classificacao: string; // Classificação (Imobilizado Corpóreo, IAS 41, Biomédico, etc)
  localizacao: string; // Localização geral
  quantidade2: number; // Quantidade 2 (Contagem física no inventário)
  estado2: AssetAuditStatus; // Estado 2 (Status de verificação)
  valorUnitario: number; // Valor Unitário
  obs: string; // OBS (Notas, Número de chassi/série/brinco)
  foto2: string; // Foto 2 (Foto detalhe/etiqueta)

  // Extra technical metadata by asset class
  numeroSerieOuChassi?: string;
  anoFabrico?: number;
  dataAquisicao?: string;
  responsavel?: string;
  vidaUtilAnos?: number;
}

export interface AssetFilterState {
  search: string;
  tipoActivo: string;
  estado: string;
  direccao: string;
  departamento: string;
  piso: string;
  accao: string;
  estado2: string;
}
