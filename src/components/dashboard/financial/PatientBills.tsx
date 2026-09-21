"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { formatCurrency } from "@/utils/formatters";
import PayInvoiceModal from "./PayInvoiceModal";

export default function PatientBills({ dictionary }: { dictionary: any }) {
  const fDict = dictionary?.financial || {};
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Filtros (Opcional pra V2, por hora fixo)
  const [statusFilter, setStatusFilter] = useState("TODOS");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await api.billing.listInvoices();
      setInvoices(data || []);
    } catch (error) {
      console.error("Failed to load invoices", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string | number) => {
    if (!confirm(fDict.bills?.cancelPrompt || "Tem certeza que deseja cancelar essa fatura?")) return;
    try {
      await api.billing.cancelInvoice(id.toString());
      fetchInvoices();
    } catch (error) {
      console.error(fDict.errors?.cancelBill || "Failed to cancel invoice", error);
      alert(fDict.errors?.cancelBill || "Erro ao cancelar fatura.");
    }
  };

  const filteredInvoices = invoices.filter(inv => {
      if (statusFilter === fDict.status?.ALL || statusFilter === "TODOS") return true;
      return inv.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'PAGA': return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">{fDict.status?.PAID || "PAGA"}</span>;
          case 'PENDENTE': return <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800">{fDict.status?.PENDING || "PENDENTE"}</span>;
          case 'CANCELADA': return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">{fDict.status?.CANCELED || "CANCELADA"}</span>;
          default: return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded">{status}</span>;
      }
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
           <div>
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                   <span className="material-symbols-outlined text-blue-600">receipt_long</span>
                   {fDict.bills?.title}
               </h2>
               <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{fDict.bills?.subtitle}</p>
           </div>
           
           <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
               {['TODOS', 'PENDENTE', 'PAGA', 'CANCELADA'].map(s => (
                   <button
                       key={s}
                       onClick={() => setStatusFilter(s)}
                       className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${statusFilter === s ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                   >
                       {fDict.status?.[s === "TODOS" ? "ALL" : s] || s}
                   </button>
               ))}
           </div>
       </div>

       {loading ? (
            <div className="flex justify-center items-center h-48"><span className="material-symbols-outlined animate-spin text-4xl text-gray-300">autorenew</span></div>
       ) : filteredInvoices.length > 0 ? (
           <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-y border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-semibold">{fDict.bills?.table?.invoice}</th>
                            <th className="px-4 py-3 font-semibold">{fDict.bills?.table?.treatment}</th>
                            <th className="px-4 py-3 font-semibold">{fDict.bills?.table?.dueDate}</th>
                            <th className="px-4 py-3 font-semibold">{fDict.bills?.table?.value}</th>
                            <th className="px-4 py-3 font-semibold">{fDict.bills?.table?.status}</th>
                            <th className="px-4 py-3 font-semibold text-right">{fDict.bills?.table?.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredInvoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                                <td className="px-4 py-4">
                                    <div className="font-bold text-gray-900 dark:text-white mb-0.5">#{inv.id}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">person</span>
                                        {inv.paciente ? inv.paciente.nome : `${fDict.bills?.patientId}${inv.pacienteId}`}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                                    {inv.planoTratamentoId ? `${fDict.bills?.plan}${inv.planoTratamentoId}` : <span className="text-gray-400 italic">{fDict.bills?.loose}</span>}
                                </td>
                                <td className="px-4 py-4">
                                    <div className={`font-medium ${new Date(inv.dataVencimento) < new Date() && inv.status === 'PENDENTE' ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {new Date(inv.dataVencimento).toLocaleDateString('pt-BR')}
                                    </div>
                                    {new Date(inv.dataVencimento) < new Date() && inv.status === 'PENDENTE' && (
                                        <div className="text-[10px] text-red-500 font-bold uppercase mt-0.5">{fDict.bills?.delayed}</div>
                                    )}
                                </td>
                                <td className="px-4 py-4 font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(inv.valorTotal)}
                                </td>
                                <td className="px-4 py-4">
                                    {getStatusBadge(inv.status)}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {inv.status === 'PENDENTE' && (
                                            <>
                                                <button 
                                                    onClick={() => setSelectedInvoice(inv)}
                                                    className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                                                    title={fDict.bills?.payTitle}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">price_check</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleCancel(inv.id)}
                                                    className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
                                                    title={fDict.bills?.cancelTitle}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                                                </button>
                                            </>
                                        )}
                                        {inv.status === 'PAGA' && (
                                            <button 
                                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                                title={fDict.bills?.receiptTitle}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">receipt</span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
               </table>
           </div>
       ) : (
           <div className="flex flex-col items-center justify-center text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
               <div className="size-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 mb-4">
                   <span className="material-symbols-outlined text-[32px]">inventory_2</span>
               </div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{fDict.bills?.emptyTitle}</h3>
               <p className="text-gray-500 max-w-sm">
                   {statusFilter === "TODOS" || statusFilter === fDict.status?.ALL
                    ? fDict.bills?.emptyAll
                    : fDict.bills?.emptyFilter?.replace('{status}', fDict.status?.[statusFilter === "TODOS" ? "ALL" : statusFilter] || statusFilter)}
               </p>
           </div>
       )}

       <PayInvoiceModal 
           isOpen={!!selectedInvoice}
           onClose={() => setSelectedInvoice(null)}
           onSuccess={() => {
               fetchInvoices();
           }}
           fatura={selectedInvoice}
           dict={dictionary}
       />
    </div>
  );
}
