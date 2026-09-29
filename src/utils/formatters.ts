import { AssetCondition, RecommendedAction, AssetAuditStatus } from '../types/asset';

export function formatCurrency(amount: number, currency = 'AOA'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Kz 0,00';
  }
  
  if (currency === 'AOA') {
    return `Kz ${amount.toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (currency === 'BRL') {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function getConditionBadge(condition: AssetCondition): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (condition) {
    case 'Novo':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
      };
    case 'Bom':
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        text: 'text-teal-700 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-800',
        dot: 'bg-teal-500',
      };
    case 'Razoável':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
      };
    case 'Mau':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500',
      };
    case 'Obsoleto':
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-300 dark:border-slate-700',
        dot: 'bg-slate-500',
      };
    case 'Inoperante':
      return {
        bg: 'bg-red-100 dark:bg-red-950',
        text: 'text-red-800 dark:text-red-300',
        border: 'border-red-300 dark:border-red-800',
        dot: 'bg-red-600',
      };
    default:
      return {
        bg: 'bg-neutral-100',
        text: 'text-neutral-700',
        border: 'border-neutral-200',
        dot: 'bg-neutral-400',
      };
  }
}

export function getAuditStatusBadge(status: AssetAuditStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'Conferido e Conforme':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
      };
    case 'Divergência de Qtd':
    case 'Divergência de Estado':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
      };
    case 'Não Localizado':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/30',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
      };
    case 'Pendente de Vistoria':
    default:
      return {
        bg: 'bg-sky-50 dark:bg-sky-950/30',
        text: 'text-sky-700 dark:text-sky-400',
        border: 'border-sky-200 dark:border-sky-800',
      };
  }
}

export function getActionBadge(action: RecommendedAction): {
  bg: string;
  text: string;
} {
  switch (action) {
    case 'Manter em Uso':
      return { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', text: 'text-emerald-700' };
    case 'Manutenção Preventiva':
    case 'Calibração Biomédica':
    case 'Manejo Sanitário / Veterinário':
      return { bg: 'bg-blue-50 text-blue-700 border border-blue-200', text: 'text-blue-700' };
    case 'Reparação Correctiva':
      return { bg: 'bg-amber-50 text-amber-700 border border-amber-200', text: 'text-amber-700' };
    case 'Abate / Alienação':
    case 'Leilão / Descarte':
      return { bg: 'bg-rose-50 text-rose-700 border border-rose-200', text: 'text-rose-700' };
    case 'Transferência de Sector':
      return { bg: 'bg-purple-50 text-purple-700 border border-purple-200', text: 'text-purple-700' };
    default:
      return { bg: 'bg-slate-100 text-slate-700 border border-slate-200', text: 'text-slate-700' };
  }
}
