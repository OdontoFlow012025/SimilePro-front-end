"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

type IssueNfseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function IssueNfseModal({ isOpen, onClose, onSuccess }: IssueNfseModalProps) {
  const [servico, setServico] = useState("");
  const [valor, setValor] = useState("");
  const [faturaId, setFaturaId] = useState(""); // opcional por enquanto

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setServico("");
      setValor("");
      setFaturaId("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servico || !valor) {
        setError("Preencha o serviço e o valor da nota.");
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await api.fiscal.issueInvoice({
        servico,
        valor: Number(valor.replace(',', '.')),
        faturaId: faturaId ? Number(faturaId) : null
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(typeof err === 'object' ? err.message || JSON.stringify(err) : String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">receipt_long</span>
            Nova NFS-e
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

          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição do Serviço *</label>
              <input
                  type="text"
                  required
                  value={servico}
                  onChange={e => setServico(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="Ex: Consulta Odontológica de Rotina"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor da NFS-e (R$) *</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        placeholder="Ex: 500.00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID da Fatura (Opcional)</label>
                    <input
                        type="number"
                        value={faturaId}
                        onChange={e => setFaturaId(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        placeholder="Ex: 104"
                    />
                </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm flex items-start gap-2 mt-4">
                <span className="material-symbols-outlined text-[18px] mt-0.5">info</span>
                <div>
                    <strong>Transmissão Imediata</strong><br />
                    Ao emitir, a nota será processada e registrada com aliquota ISS padrão. Numa integração real, os dados são enviados diretamente via XML/WebService para a prefeitura local.
                </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                  Processando...
                </>
              ) : (
                'Emitir NFS-e'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
