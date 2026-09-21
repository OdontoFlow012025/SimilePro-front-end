"use client";

import { useEffect, useState } from "react";
import CashFlowChart from "../CashFlowChart";
import FinancialStats from "../FinancialStats";
import QuickActions from "../QuickActions";
import { api } from "@/services/api";
import { formatCurrency } from "@/utils/formatters";

export default function AccountFlow({ dictionary }: { dictionary: any }) {
  const fDict = dictionary?.financial || {};
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await api.financialTransactions.list();
      // Sort by latest due date and take the last 10
      const sorted = (data || []).sort((a: any, b: any) => new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime()).slice(0, 10);
      setTransactions(sorted);
    } catch (error) {
      console.error(fDict.errors?.loadTransactions || "Erro ao carregar transações", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'PAGO': return <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{fDict.status?.paid}</span>;
        case 'PENDENTE': return <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{fDict.status?.pending}</span>;
        case 'CANCELADO': return <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{fDict.status?.canceled}</span>;
        default: return <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{status}</span>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    if (tipo === 'RECEITA') return <span className="size-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center material-symbols-outlined text-[18px]">trending_up</span>;
    return <span className="size-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center material-symbols-outlined text-[18px]">trending_down</span>;
  };

  return (
    <div className="space-y-6">
      <FinancialStats dictionary={dictionary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <CashFlowChart dictionary={dictionary} />

           {/* Registros Recentes (Caixa) */}
           <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
             <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                 <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">receipt_long</span>
                    {fDict.accountFlow?.title}
                 </h3>
             </div>

             {loading ? (
                <div className="flex justify-center py-8"><span className="material-symbols-outlined animate-spin text-gray-300 text-3xl">autorenew</span></div>
             ) : transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[11px] text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-800/20">
                            <tr>
                                <th className="px-4 py-2 font-medium">{fDict.accountFlow?.table?.launch}</th>
                                <th className="px-4 py-2 font-medium">{fDict.accountFlow?.table?.category}</th>
                                <th className="px-4 py-2 font-medium">{fDict.accountFlow?.table?.date}</th>
                                <th className="px-4 py-2 font-medium">{fDict.accountFlow?.table?.status}</th>
                                <th className="px-4 py-2 font-medium text-right">{fDict.accountFlow?.table?.value}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                    <td className="px-4 py-3 flex items-center gap-3">
                                        {getTipoIcon(t.tipo)}
                                        <div>
                                            <div className="font-bold text-gray-800 dark:text-white">{t.descricao}</div>
                                            <div className="text-[11px] text-gray-500 uppercase">{t.formaPagamento}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">
                                        {t.categoria || fDict.accountFlow?.general}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {new Date(t.dataVencimento).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(t.status)}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-bold ${t.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-500'}`}>
                                        {t.tipo === 'RECEITA' ? '+' : '-'}{formatCurrency(t.valor)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             ) : (
                <div className="text-center py-6 text-gray-500 text-sm">{fDict.accountFlow?.empty}</div>
             )}
           </div>
        </div>
        <div>
           <QuickActions dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}
