"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { formatCurrency } from "@/utils/formatters";

type PayInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  fatura: any | null;
  dict?: any;
};

export default function PayInvoiceModal({ isOpen, onClose, onSuccess, fatura, dict }: PayInvoiceModalProps) {
  const fDict = dict?.financial || {};
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormaPagamento("PIX");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !fatura) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.billing.payInvoice(fatura.id.toString(), {
        formaPagamento: formaPagamento,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(typeof err === "object" ? err.message || JSON.stringify(err) : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600">payments</span>
            {fDict.payModal?.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
             <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1 uppercase tracking-wide">{fDict.payModal?.amountToReceive}</div>
             <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">
                {formatCurrency(fatura.valorTotal)}
             </div>
             <div className="text-sm text-gray-500 mt-2">{fDict.payModal?.invoiceLabel}{fatura.id}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{fDict.payModal?.paymentMethod}</label>
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { value: 'PIX', label: fDict.payModal?.methods?.pix || 'PIX' },
                   { value: 'Cartão de Crédito', label: fDict.payModal?.methods?.credit || 'Cartão de Crédito' },
                   { value: 'Cartão de Débito', label: fDict.payModal?.methods?.debit || 'Cartão de Débito' },
                   { value: 'Dinheiro', label: fDict.payModal?.methods?.cash || 'Dinheiro' },
                   { value: 'Transferência Bancária', label: fDict.payModal?.methods?.transfer || 'Transferência Bancária' }
                 ].map(method => (
                    <button
                       key={method.value}
                       type="button"
                       onClick={() => setFormaPagamento(method.value)}
                       className={`p-3 text-sm font-medium rounded-xl border flex items-center justify-center transition-all ${
                          formaPagamento === method.value
                          ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/50'
                       }`}
                    >
                       {method.label}
                    </button>
                 ))}
              </div>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-400 rounded-lg text-xs flex items-start gap-2 mt-4">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <div 
                    dangerouslySetInnerHTML={{ 
                        __html: String(fDict.payModal?.infoText || "Ao confirmar, o status será alterado para **PAGO**").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }} 
                />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition disabled:opacity-50"
            >
              {fDict.payModal?.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                  {fDict.payModal?.processing}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  {fDict.payModal?.confirm}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
