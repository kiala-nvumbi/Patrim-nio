import React, { useState } from 'react';
import { Asset, AssetAuditStatus } from '../types/asset';
import { getAuditStatusBadge, getConditionBadge } from '../utils/formatters';
import { CheckCircle2, AlertTriangle, XCircle, Search, Save, Check } from 'lucide-react';

interface AuditInventoryModalProps {
  assets: Asset[];
  onUpdateAssetAudit: (id: string, qtd2: number, estado2: AssetAuditStatus) => void;
  onClose?: () => void;
}

export const AuditInventoryModal: React.FC<AuditInventoryModalProps> = ({
  assets,
  onUpdateAssetAudit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscrepanciesOnly, setFilterDiscrepanciesOnly] = useState(false);

  const filtered = assets.filter((asset) => {
    const matchesSearch =
      asset.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.patrimonioId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.sala.toLowerCase().includes(searchTerm.toLowerCase());

    const hasDiscrepancy =
      Number(asset.quantidade) !== Number(asset.quantidade2) ||
      asset.estado2 !== 'Conferido e Conforme';

    if (filterDiscrepanciesOnly) {
      return matchesSearch && hasDiscrepancy;
    }

    return matchesSearch;
  });

  const discrepanciesCount = assets.filter(
    (a) => Number(a.quantidade) !== Number(a.quantidade2) || a.estado2 !== 'Conferido e Conforme'
  ).length;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900">
            Conferência Física & Auditoria de Inventário
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Reconciliação entre cadastro contábil (Quantidade) e contagem in loco (Quantidade 2 / Estado 2)
          </p>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-2 bg-neutral-50 border border-neutral-200 rounded">
            <span className="text-neutral-500">Total Bens:</span>{' '}
            <strong className="font-mono text-neutral-900">{assets.length}</strong>
          </div>
          <div className="p-2 bg-amber-50 border border-amber-200 rounded">
            <span className="text-amber-700">Divergências:</span>{' '}
            <strong className="font-mono text-amber-900">{discrepanciesCount}</strong>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por bem, código ou sala..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <button
          onClick={() => setFilterDiscrepanciesOnly(!filterDiscrepanciesOnly)}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            filterDiscrepanciesOnly
              ? 'bg-amber-600 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          {filterDiscrepanciesOnly ? 'Exibindo Apenas Divergências' : 'Filtrar Divergências'}
        </button>
      </div>

      {/* Audit Reconciliation Table */}
      <div className="border border-neutral-200 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-100 text-neutral-700 font-semibold uppercase text-[11px] border-b border-neutral-200">
            <tr>
              <th className="py-2.5 px-3">Código / Activo</th>
              <th className="py-2.5 px-3">Localização (Piso / Sala)</th>
              <th className="py-2.5 px-3 text-center">Estado Registado</th>
              <th className="py-2.5 px-3 text-center">Qtd Cadastro</th>
              <th className="py-2.5 px-3 text-center">Qtd Conferida (2)</th>
              <th className="py-2.5 px-3">Status Auditoria (Estado 2)</th>
              <th className="py-2.5 px-3 text-center">Acção Rápida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500">
                  Nenhum bem para os critérios selecionados.
                </td>
              </tr>
            ) : (
              filtered.map((asset) => {
                const isDifferent = Number(asset.quantidade) !== Number(asset.quantidade2);
                const auditBadge = getAuditStatusBadge(asset.estado2);
                const condBadge = getConditionBadge(asset.estado);

                return (
                  <tr
                    key={asset.id}
                    className={`hover:bg-neutral-50/70 transition-colors ${
                      isDifferent ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-medium text-neutral-900">
                        {asset.patrimonioId}
                      </div>
                      <div className="text-neutral-700 font-medium line-clamp-1">
                        {asset.descricao}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {asset.tipoActivo} · {asset.marca}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-neutral-600">
                      <div>{asset.sala}</div>
                      <div className="text-[10px] text-neutral-400">
                        {asset.piso} · {asset.direccao}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${condBadge.bg} ${condBadge.text}`}>
                        {asset.estado}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono font-semibold text-neutral-900">
                      {asset.quantidade}
                    </td>

                    {/* Quantity 2 Input */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newQ = Math.max(0, Number(asset.quantidade2) - 1);
                            const newStatus =
                              newQ === Number(asset.quantidade)
                                ? 'Conferido e Conforme'
                                : 'Divergência de Qtd';
                            onUpdateAssetAudit(asset.id, newQ, newStatus);
                          }}
                          className="w-5 h-5 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={asset.quantidade2}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const newStatus =
                              val === Number(asset.quantidade)
                                ? 'Conferido e Conforme'
                                : 'Divergência de Qtd';
                            onUpdateAssetAudit(asset.id, val, newStatus);
                          }}
                          className={`w-14 text-center py-1 border rounded font-mono font-bold text-xs ${
                            isDifferent ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-neutral-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newQ = Number(asset.quantidade2) + 1;
                            const newStatus =
                              newQ === Number(asset.quantidade)
                                ? 'Conferido e Conforme'
                                : 'Divergência de Qtd';
                            onUpdateAssetAudit(asset.id, newQ, newStatus);
                          }}
                          className="w-5 h-5 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Estado 2 Select */}
                    <td className="py-2.5 px-3">
                      <select
                        value={asset.estado2}
                        onChange={(e) =>
                          onUpdateAssetAudit(
                            asset.id,
                            asset.quantidade2,
                            e.target.value as AssetAuditStatus
                          )
                        }
                        className={`text-xs py-1 px-2 border rounded font-medium ${auditBadge.bg} ${auditBadge.text} border-neutral-300`}
                      >
                        <option value="Conferido e Conforme">Conferido e Conforme</option>
                        <option value="Divergência de Qtd">Divergência de Qtd</option>
                        <option value="Divergência de Estado">Divergência de Estado</option>
                        <option value="Pendente de Vistoria">Pendente de Vistoria</option>
                        <option value="Não Localizado">Não Localizado</option>
                      </select>
                    </td>

                    {/* Quick Confirm button */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() =>
                          onUpdateAssetAudit(
                            asset.id,
                            asset.quantidade,
                            'Conferido e Conforme'
                          )
                        }
                        title="Aprovar Conforme (Igualar Quantidades)"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-medium rounded transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Validar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
