import React, { useState, useEffect } from 'react';
import { Asset, AssetCategory, AssetCondition, RecommendedAction, AssetAuditStatus } from '../types/asset';
import { X, Save, Image as ImageIcon, Sparkles } from 'lucide-react';

interface AssetFormModalProps {
  assetToEdit?: Asset | null;
  onSave: (assetData: Partial<Asset>) => void;
  onClose: () => void;
}

const CATEGORIES: AssetCategory[] = [
  'Veículos e Frotas',
  'Equipamentos Hospitalares',
  'Mobiliário e Escritório',
  'Activos Biológicos',
  'Equipamentos de TI',
  'Instalações e Edifícios',
];

const CONDITIONS: AssetCondition[] = [
  'Novo',
  'Bom',
  'Razoável',
  'Mau',
  'Obsoleto',
  'Inoperante',
];

const ACTIONS: RecommendedAction[] = [
  'Manter em Uso',
  'Manutenção Preventiva',
  'Reparação Correctiva',
  'Abate / Alienação',
  'Transferência de Sector',
  'Calibração Biomédica',
  'Manejo Sanitário / Veterinário',
  'Leilão / Descarte',
];

const AUDIT_STATUSES: AssetAuditStatus[] = [
  'Conferido e Conforme',
  'Divergência de Qtd',
  'Divergência de Estado',
  'Pendente de Vistoria',
  'Não Localizado',
];

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  assetToEdit,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<Asset>>({
    patrimonioId: `PAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    carimboDataHora: new Date().toISOString().slice(0, 16).replace('T', ' '),
    tipoActivo: 'Mobiliário e Escritório',
    piso: 'Piso 0 (R/C)',
    direccao: 'Direcção Geral Administrativa',
    departamento: 'Geral',
    sala: 'Sala 101',
    descricao: '',
    cor: '',
    tipo: '',
    marca: '',
    quantidade: 1,
    estado: 'Bom',
    accao: 'Manter em Uso',
    qtdBomEstado: 1,
    qtdMauEstado: 0,
    valorAquisicao: 0,
    foto: '',
    tipo2: '',
    especie: '',
    finalidade: '',
    classificacao: 'Activo Imobilizado Tangível',
    localizacao: 'Edifício Sede Central',
    quantidade2: 1,
    estado2: 'Conferido e Conforme',
    valorUnitario: 0,
    obs: '',
    foto2: '',
    numeroSerieOuChassi: '',
    responsavel: '',
    vidaUtilAnos: 5,
  });

  const [activeTab, setActiveTab] = useState<'geral' | 'localizacao' | 'valores' | 'tecnico'>('geral');

  useEffect(() => {
    if (assetToEdit) {
      setFormData({ ...assetToEdit });
    }
  }, [assetToEdit]);

  const handleChange = (field: keyof Asset, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto calculate Total = Unit * Qty
      if (field === 'valorUnitario' || field === 'quantidade') {
        const unit = field === 'valorUnitario' ? Number(value) : Number(prev.valorUnitario || 0);
        const qty = field === 'quantidade' ? Number(value) : Number(prev.quantidade || 1);
        if (unit > 0 && qty > 0) {
          updated.valorAquisicao = unit * qty;
        }
      }

      // Auto adjust Good/Bad quantities when total quantity changes
      if (field === 'quantidade') {
        const qty = Number(value) || 0;
        updated.qtdBomEstado = qty;
        updated.qtdMauEstado = 0;
        updated.quantidade2 = qty;
      }

      return updated;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, photoField: 'foto' | 'foto2') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(photoField, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao?.trim()) {
      alert('Por favor informe a descrição do activo.');
      return;
    }
    onSave(formData);
  };

  // Helper presets for domain categories
  const applyPresetForCategory = (cat: AssetCategory) => {
    if (cat === 'Veículos e Frotas') {
      setFormData((prev) => ({
        ...prev,
        tipoActivo: cat,
        tipo: 'Viatura Ligeira / Utilitário',
        classificacao: 'Activo Imobilizado - Frotas & Veículos',
        accao: 'Manutenção Preventiva',
        vidaUtilAnos: 6,
        direccao: 'Direcção de Logística e Transportes',
        piso: 'Piso 0 (Garagem Central)',
        sala: 'Estacionamento Central',
      }));
    } else if (cat === 'Equipamentos Hospitalares') {
      setFormData((prev) => ({
        ...prev,
        tipoActivo: cat,
        tipo: 'Equipamento Eletromédico Especializado',
        tipo2: 'Classe Biomédica III (Crítico)',
        classificacao: 'Equipamento Médico-Hospitalar de Suporte',
        accao: 'Calibração Biomédica',
        vidaUtilAnos: 8,
        direccao: 'Direcção Clínica e Médica',
        departamento: 'Bloco Operatório / UTI',
        piso: 'Piso 1 (Ala Hospitalar)',
      }));
    } else if (cat === 'Activos Biológicos') {
      setFormData((prev) => ({
        ...prev,
        tipoActivo: cat,
        tipo: 'Semovente Pecuário / Cultura Florestal',
        tipo2: 'Activo Biológico em Produção',
        classificacao: 'Activo Biológico Avaliado a Justo Valor (IAS 41)',
        accao: 'Manejo Sanitário / Veterinário',
        vidaUtilAnos: 7,
        direccao: 'Direcção Agro-Pecuária',
        departamento: 'Produção e Manejo Animal',
        piso: 'Piso Térreo (Manga Pecuária)',
        sala: 'Piquete ou Talhão Rural',
      }));
    } else if (cat === 'Mobiliário e Escritório') {
      setFormData((prev) => ({
        ...prev,
        tipoActivo: cat,
        tipo: 'Mobiliário Corporativo / Ergonómico',
        classificacao: 'Activo Imobilizado Tangível - Bens Móveis',
        accao: 'Manter em Uso',
        vidaUtilAnos: 10,
        direccao: 'Direcção Administrativa',
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
              {assetToEdit ? 'Editar Registo Patrimonial' : 'Novo Registo de Activo Patrimonial'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Preenchimento em conformidade com as 27 colunas da norma de inventário
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation inside form */}
        <div className="flex border-b border-neutral-200 bg-neutral-100/60 px-6 gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'geral'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            1. Identificação Geral
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('localizacao')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'localizacao'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            2. Localização & Organização
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('valores')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'valores'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            3. Quantidades, Estado & Valores
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tecnico')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'tecnico'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            4. Especificações & Fotos
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* TAB 1: IDENTIFICAÇÃO GERAL */}
          {activeTab === 'geral' && (
            <div className="space-y-4">
              {/* Category Quick Presets */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">
                  Tipo de Activo (Categoria Principal) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        handleChange('tipoActivo', cat);
                        applyPresetForCategory(cat);
                      }}
                      className={`py-2 px-3 text-left rounded border transition-colors ${
                        formData.tipoActivo === cat
                          ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Código de Tombamento (Patrimônio ID)
                  </label>
                  <input
                    type="text"
                    value={formData.patrimonioId || ''}
                    onChange={(e) => handleChange('patrimonioId', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Ex: PAT-2026-0042"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Carimbo de data/hora *
                  </label>
                  <input
                    type="text"
                    value={formData.carimboDataHora || ''}
                    onChange={(e) => handleChange('carimboDataHora', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Descrição do Activo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.descricao || ''}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  placeholder="Ex: Ambulância UTI Móvel Renault Master / Ventilador Mindray SV800 / Touro Nelore PO"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Marca / Fabricante</label>
                  <input
                    type="text"
                    value={formData.marca || ''}
                    onChange={(e) => handleChange('marca', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Toyota, Mindray, Herman Miller..."
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Tipo (Subcategoria)</label>
                  <input
                    type="text"
                    value={formData.tipo || ''}
                    onChange={(e) => handleChange('tipo', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Furgão, Mesa, Cadeira, Bovino..."
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Cor</label>
                  <input
                    type="text"
                    value={formData.cor || ''}
                    onChange={(e) => handleChange('cor', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Branco, Preto, Cinza..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Tipo 2 (Segmentação Secundária)
                  </label>
                  <input
                    type="text"
                    value={formData.tipo2 || ''}
                    onChange={(e) => handleChange('tipo2', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Classe III, Alta complexidade, Manejo especial..."
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Espécie / Raça / Modelo Específico
                  </label>
                  <input
                    type="text"
                    value={formData.especie || ''}
                    onChange={(e) => handleChange('especie', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Ex: Nelore Mocho, Eucalyptus urograndis, Diesel 2.5..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCALIZAÇÃO & ORGANIZAÇÃO */}
          {activeTab === 'localizacao' && (
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Localização Geral (Instalação / Polo) *
                </label>
                <input
                  type="text"
                  value={formData.localizacao || ''}
                  onChange={(e) => handleChange('localizacao', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  placeholder="Complexo Hospitalar Central, Fazenda Agro-Pecuária Bengo, Edifício Sede..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Direcção *</label>
                  <input
                    type="text"
                    value={formData.direccao || ''}
                    onChange={(e) => handleChange('direccao', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Direcção Clínica, Direcção Geral, DAF..."
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Departamento</label>
                  <input
                    type="text"
                    value={formData.departamento || ''}
                    onChange={(e) => handleChange('departamento', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Urgências, Recursos Humanos, Pecuária..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Piso / Nível</label>
                  <input
                    type="text"
                    value={formData.piso || ''}
                    onChange={(e) => handleChange('piso', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Piso 0, Piso 1, Subsolo, Térreo Rural..."
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Sala / Compartimento *</label>
                  <input
                    type="text"
                    value={formData.sala || ''}
                    onChange={(e) => handleChange('sala', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Sala 102, Bloco Cirúrgico, Baia 04, Pátio..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Responsável / Cautela</label>
                <input
                  type="text"
                  value={formData.responsavel || ''}
                  onChange={(e) => handleChange('responsavel', e.target.value)}
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  placeholder="Nome do colaborador ou gestor encarregado"
                />
              </div>
            </div>
          )}

          {/* TAB 3: QUANTIDADES, ESTADO & VALORES */}
          {activeTab === 'valores' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Quantidade Total *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantidade ?? 1}
                    onChange={(e) => handleChange('quantidade', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Qtd em Bom Estado</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.qtdBomEstado ?? 0}
                    onChange={(e) => handleChange('qtdBomEstado', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Qtd em Mau Estado</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.qtdMauEstado ?? 0}
                    onChange={(e) => handleChange('qtdMauEstado', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Estado de Conservação *
                  </label>
                  <select
                    value={formData.estado || 'Bom'}
                    onChange={(e) => handleChange('estado', e.target.value as AssetCondition)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Acção Recomendada *
                  </label>
                  <select
                    value={formData.accao || 'Manter em Uso'}
                    onChange={(e) => handleChange('accao', e.target.value as RecommendedAction)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  >
                    {ACTIONS.map((act) => (
                      <option key={act} value={act}>
                        {act}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Physical Inventory Audit status */}
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-semibold text-neutral-800 block mb-2">
                  Dados de Auditoria / Conferência Física
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-600 text-[11px] mb-1">
                      Quantidade 2 (Contagem física do inventário)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.quantidade2 ?? 1}
                      onChange={(e) => handleChange('quantidade2', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 text-[11px] mb-1">
                      Estado 2 (Status de Verificação)
                    </label>
                    <select
                      value={formData.estado2 || 'Conferido e Conforme'}
                      onChange={(e) => handleChange('estado2', e.target.value as AssetAuditStatus)}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    >
                      {AUDIT_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Valor Unitário (AOA / Kz)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.valorUnitario ?? 0}
                    onChange={(e) => handleChange('valorUnitario', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Valor de Aquisição Total (AOA / Kz) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.valorAquisicao ?? 0}
                    onChange={(e) => handleChange('valorAquisicao', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Classificação Contabilística
                  </label>
                  <input
                    type="text"
                    value={formData.classificacao || ''}
                    onChange={(e) => handleChange('classificacao', e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    placeholder="Imobilizado Corpóreo, IAS 41..."
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Vida Útil Estimada (Anos)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.vidaUtilAnos ?? 5}
                    onChange={(e) => handleChange('vidaUtilAnos', parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ESPECIFICAÇÕES, OBS & FOTOS */}
          {activeTab === 'tecnico' && (
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Finalidade Operacional
                </label>
                <input
                  type="text"
                  value={formData.finalidade || ''}
                  onChange={(e) => handleChange('finalidade', e.target.value)}
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  placeholder="Transporte de emergência, Terapia intensiva, Posto de trabalho..."
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Nº de Série / Chassi / Brinco RFID
                </label>
                <input
                  type="text"
                  value={formData.numeroSerieOuChassi || ''}
                  onChange={(e) => handleChange('numeroSerieOuChassi', e.target.value)}
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded font-mono text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  placeholder="Ex: VF1MADF5609823145 ou RFID-982-0001"
                />
              </div>

              {/* Photos upload / URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 border border-neutral-200 rounded-lg">
                  <span className="font-semibold text-neutral-800 block mb-1">Foto Principal</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'foto')}
                    className="text-[11px] block w-full mb-2"
                  />
                  <input
                    type="text"
                    value={formData.foto || ''}
                    onChange={(e) => handleChange('foto', e.target.value)}
                    placeholder="Ou cole a URL da Foto"
                    className="w-full px-2 py-1 border border-neutral-300 rounded text-[11px] mb-2"
                  />
                  {formData.foto && (
                    <div className="w-full h-24 rounded bg-neutral-100 overflow-hidden">
                      <img
                        src={formData.foto}
                        alt="Preview Foto"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3 border border-neutral-200 rounded-lg">
                  <span className="font-semibold text-neutral-800 block mb-1">Foto 2 (Detalhe / Etiqueta)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'foto2')}
                    className="text-[11px] block w-full mb-2"
                  />
                  <input
                    type="text"
                    value={formData.foto2 || ''}
                    onChange={(e) => handleChange('foto2', e.target.value)}
                    placeholder="Ou cole a URL da Foto 2"
                    className="w-full px-2 py-1 border border-neutral-300 rounded text-[11px] mb-2"
                  />
                  {formData.foto2 && (
                    <div className="w-full h-24 rounded bg-neutral-100 overflow-hidden">
                      <img
                        src={formData.foto2}
                        alt="Preview Foto 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Observações Técnicas (OBS)
                </label>
                <textarea
                  rows={3}
                  value={formData.obs || ''}
                  onChange={(e) => handleChange('obs', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  placeholder="Histórico de manutenção, avarias verificadas, calibração ou detalhes relevantes..."
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium rounded transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Gravar Registo Patrimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
