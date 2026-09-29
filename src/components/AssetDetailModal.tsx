import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { formatCurrency, getConditionBadge, getActionBadge, getAuditStatusBadge } from '../utils/formatters';
import { X, QrCode, Edit3, MapPin, Building, Calendar, DollarSign, ShieldAlert, CheckCircle2, FileText, Wrench } from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
  onEdit: (asset: Asset) => void;
  onPrintTag: (asset: Asset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onEdit,
  onPrintTag,
}) => {
  const [activePhoto, setActivePhoto] = useState<'foto1' | 'foto2'>('foto1');
  const conditionStyle = getConditionBadge(asset.estado);
  const actionStyle = getActionBadge(asset.accao);
  const auditStyle = getAuditStatusBadge(asset.estado2);

  const hasCountDiscrepancy = Number(asset.quantidade) !== Number(asset.quantidade2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-neutral-900 bg-white border border-neutral-300 px-2 py-0.5 rounded shadow-2xs">
                {asset.patrimonioId}
              </span>
              <span className="text-xs text-neutral-500">
                Carimbo: <span className="font-mono">{asset.carimboDataHora}</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mt-1 line-clamp-1">
              {asset.descricao}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintTag(asset)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              Etiqueta QR
            </button>
            <button
              onClick={() => onEdit(asset)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Visual & Key Metrics split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image Previewer */}
            <div className="md:col-span-5 flex flex-col">
              <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                {activePhoto === 'foto1' && asset.foto ? (
                  <img
                    src={asset.foto}
                    alt={asset.descricao}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : activePhoto === 'foto2' && asset.foto2 ? (
                  <img
                    src={asset.foto2}
                    alt="Foto secundária do bem"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs">Sem imagem disponível</span>
                  </div>
                )}

                {/* Photo Selector Switcher */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-neutral-900/80 backdrop-blur-xs p-0.5 rounded text-white text-[10px]">
                  <button
                    onClick={() => setActivePhoto('foto1')}
                    className={`px-2 py-0.5 rounded ${
                      activePhoto === 'foto1' ? 'bg-white text-neutral-900 font-medium' : 'text-neutral-300'
                    }`}
                  >
                    Foto 1 (Principal)
                  </button>
                  <button
                    onClick={() => setActivePhoto('foto2')}
                    className={`px-2 py-0.5 rounded ${
                      activePhoto === 'foto2' ? 'bg-white text-neutral-900 font-medium' : 'text-neutral-300'
                    }`}
                  >
                    Foto 2 (Detalhe)
                  </button>
                </div>
              </div>

              {/* Status Ribbon under photo */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className={`p-2 rounded border ${conditionStyle.bg} ${conditionStyle.border}`}>
                  <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">Estado Físico</span>
                  <span className={`font-semibold ${conditionStyle.text}`}>{asset.estado}</span>
                </div>
                <div className="p-2 rounded border border-neutral-200 bg-neutral-50">
                  <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">Acção Recomendada</span>
                  <span className={`font-semibold ${actionStyle.text}`}>{asset.accao}</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="md:col-span-7 flex flex-col justify-between">
              {/* Financial Box */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                <span className="text-xs font-medium text-neutral-500">Valoração Patrimonial</span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
                    {formatCurrency(asset.valorAquisicao)}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    Unitário: {formatCurrency(asset.valorUnitario)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-neutral-600 flex items-center justify-between border-t border-neutral-200/60 pt-2">
                  <span>Classificação Contábil:</span>
                  <span className="font-medium text-neutral-800">{asset.classificacao}</span>
                </div>
              </div>

              {/* Physical Inventory Reconciliation Check */}
              <div className="p-4 border border-neutral-200 rounded-lg bg-white mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                    Conferência Física de Inventário
                  </span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${auditStyle.bg} ${auditStyle.text} ${auditStyle.border}`}>
                    {asset.estado2}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-neutral-50 rounded">
                    <span className="text-[10px] text-neutral-500 block">Qtd Cadastrada</span>
                    <strong className="text-sm font-mono tabular-nums text-neutral-900">{asset.quantidade}</strong>
                  </div>
                  <div className={`p-2 rounded ${hasCountDiscrepancy ? 'bg-amber-50 text-amber-900' : 'bg-neutral-50'}`}>
                    <span className="text-[10px] text-neutral-500 block">Qtd Conferida (2)</span>
                    <strong className="text-sm font-mono tabular-nums">{asset.quantidade2}</strong>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded">
                    <span className="text-[10px] text-neutral-500 block">Bom vs Mau</span>
                    <span className="font-mono text-xs text-neutral-700">
                      <span className="text-emerald-700 font-medium">{asset.qtdBomEstado}</span> /{' '}
                      <span className="text-rose-700 font-medium">{asset.qtdMauEstado}</span>
                    </span>
                  </div>
                </div>

                {hasCountDiscrepancy && (
                  <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Atenção: Existe discrepância entre a quantidade cadastrada e a contagem física!</span>
                  </div>
                )}
              </div>

              {/* Location Tag */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg mt-3 text-xs text-neutral-700 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{asset.localizacao}</span>
                </div>
                <div className="text-neutral-500 pl-5">
                  {asset.piso} · {asset.direccao} · {asset.departamento} · <strong className="text-neutral-800">{asset.sala}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Complete 27 Spreadsheet Attributes Table */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="bg-neutral-100/80 px-4 py-2 text-xs font-semibold text-neutral-800 uppercase tracking-wider">
              Atributos Detalhados da Ficha Patrimonial (Norma de Inventário)
            </div>

            <div className="divide-y divide-neutral-200 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2 bg-white">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Tipo de Activo:</span>
                  <span className="font-medium text-neutral-900">{asset.tipoActivo}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Tipo (Subtipo):</span>
                  <span className="font-medium text-neutral-900">{asset.tipo || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Tipo 2 (Segmentação):</span>
                  <span className="font-medium text-neutral-900">{asset.tipo2 || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2 bg-neutral-50/50">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Marca / Fabricante:</span>
                  <span className="font-medium text-neutral-900">{asset.marca || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Cor:</span>
                  <span className="font-medium text-neutral-900">{asset.cor || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Espécie / Variedade (Biológico/Modelo):</span>
                  <span className="font-medium text-neutral-900 italic">{asset.especie || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2 bg-white">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Finalidade Operacional:</span>
                  <span className="font-medium text-neutral-900">{asset.finalidade || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Nº de Série / Chassi / Brinco:</span>
                  <span className="font-mono text-neutral-900">{asset.numeroSerieOuChassi || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Responsável Técnico:</span>
                  <span className="font-medium text-neutral-900">{asset.responsavel || '-'}</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50/50">
                <span className="text-neutral-500 block text-[11px] mb-1">Observações Técnicas (OBS):</span>
                <p className="text-neutral-800 bg-white p-2.5 rounded border border-neutral-200 text-xs leading-relaxed font-sans">
                  {asset.obs || 'Nenhuma observação registada para este bem.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs">
          <span className="text-neutral-500">
            Registo ID: <span className="font-mono">{asset.id}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-medium rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
