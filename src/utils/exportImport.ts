import { Asset, AssetCategory, AssetCondition, RecommendedAction, AssetAuditStatus } from '../types/asset';

export const SPREADSHEET_COLUMNS = [
  'Carimbo de data/hora',
  'Tipo de Activo',
  'Piso',
  'Direcção',
  'Departamento',
  'Sala',
  'Descrição',
  'Cor',
  'Tipo',
  'Marca',
  'Quantidade',
  'Estado',
  'Acção',
  'Quantidade em Bom Estado',
  'Quantidade em Mau Estado',
  'Valor de Aquisição',
  'Foto',
  'Tipo 2',
  'Espécie',
  'Finalidade',
  'Classificação',
  'Localização',
  'Quantidade 2',
  'Estado 2',
  'Valor Unitário',
  'OBS',
  'Foto 2',
];

export function exportAssetsToCSV(assets: Asset[]): void {
  const headers = SPREADSHEET_COLUMNS.join(';');
  
  const rows = assets.map((a) => {
    return [
      `"${a.carimboDataHora || ''}"`,
      `"${a.tipoActivo || ''}"`,
      `"${a.piso || ''}"`,
      `"${a.direccao || ''}"`,
      `"${a.departamento || ''}"`,
      `"${a.sala || ''}"`,
      `"${(a.descricao || '').replace(/"/g, '""')}"`,
      `"${a.cor || ''}"`,
      `"${a.tipo || ''}"`,
      `"${a.marca || ''}"`,
      a.quantidade,
      `"${a.estado || ''}"`,
      `"${a.accao || ''}"`,
      a.qtdBomEstado,
      a.qtdMauEstado,
      a.valorAquisicao,
      `"${a.foto || ''}"`,
      `"${a.tipo2 || ''}"`,
      `"${a.especie || ''}"`,
      `"${a.finalidade || ''}"`,
      `"${a.classificacao || ''}"`,
      `"${a.localizacao || ''}"`,
      a.quantidade2,
      `"${a.estado2 || ''}"`,
      a.valorUnitario,
      `"${(a.obs || '').replace(/"/g, '""')}"`,
      `"${a.foto2 || ''}"`,
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `inventario_patrimonial_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSVFile(content: string): Asset[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Detect delimiter (; or ,)
  const headerLine = lines[0];
  const delimiter = headerLine.includes(';') ? ';' : ',';

  const assets: Asset[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple regex to parse CSV taking into account quotes
    const values: string[] = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length >= 7) {
      const cleanVal = (idx: number, def = '') => {
        const val = values[idx] || def;
        return val.replace(/^"|"$/g, '').trim();
      };

      const parseNum = (idx: number, def = 0) => {
        const val = cleanVal(idx, String(def)).replace(/\./g, '').replace(',', '.');
        const num = parseFloat(val);
        return isNaN(num) ? def : num;
      };

      const idSeq = String(i).padStart(4, '0');
      const tipoActivo = (cleanVal(1) as AssetCategory) || 'Mobiliário e Escritório';
      const estado = (cleanVal(11) as AssetCondition) || 'Bom';
      const accao = (cleanVal(12) as RecommendedAction) || 'Manter em Uso';
      const estado2 = (cleanVal(23) as AssetAuditStatus) || 'Conferido e Conforme';

      assets.push({
        id: `imported-${Date.now()}-${i}`,
        patrimonioId: `PAT-IMP-${idSeq}`,
        carimboDataHora: cleanVal(0, new Date().toISOString().slice(0, 16).replace('T', ' ')),
        tipoActivo,
        piso: cleanVal(2, 'Piso 0'),
        direccao: cleanVal(3, 'Direcção Geral'),
        departamento: cleanVal(4, 'Geral'),
        sala: cleanVal(5, 'Sala Geral'),
        descricao: cleanVal(6, 'Activo Importado'),
        cor: cleanVal(7, 'Padrão'),
        tipo: cleanVal(8, 'Geral'),
        marca: cleanVal(9, 'Genérico'),
        quantidade: parseNum(10, 1),
        estado,
        accao,
        qtdBomEstado: parseNum(13, 1),
        qtdMauEstado: parseNum(14, 0),
        valorAquisicao: parseNum(15, 0),
        foto: cleanVal(16, ''),
        tipo2: cleanVal(17, ''),
        especie: cleanVal(18, ''),
        finalidade: cleanVal(19, 'Uso Geral'),
        classificacao: cleanVal(20, 'Imobilizado'),
        localizacao: cleanVal(21, 'Instalação Principal'),
        quantidade2: parseNum(22, 1),
        estado2,
        valorUnitario: parseNum(24, 0),
        obs: cleanVal(25, ''),
        foto2: cleanVal(26, ''),
      });
    }
  }

  return assets;
}
