"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

type DismissEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employees: any[];
  dict?: any;
};

export default function DismissEmployeeModal({ isOpen, onClose, onSuccess, employees, dict }: DismissEmployeeModalProps) {
  const hrDict = dict || {};
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState("");
  const [motivoDemissao, setMotivoDemissao] = useState("");
  const [dataDemissao, setDataDemissao] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ativos = employees.filter(e => e.status !== "DEMITIDO");

  useEffect(() => {
    if (isOpen) {
      setSelectedFuncionarioId("");
      setMotivoDemissao("");
      setDataDemissao(new Date().toISOString().split('T')[0]);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFuncionarioId) {
        setError("Selecione um funcionário.");
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await api.employees.dismiss(selectedFuncionarioId, {
        motivoDemissao,
        dataDemissao: new Date(dataDemissao).toISOString(),
      });

      onSuccess();
      onClose();

      alert(hrDict.dismiss?.successAlert || "Rescisão registrada. O funcionário foi desativado da folha.");
    } catch (err: any) {
      setError(err.message || hrDict.errors?.dismiss || "Erro ao registrar desligamento.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2 text-red-600">
            <span className="material-symbols-outlined text-red-600">block</span>
            {hrDict.dismiss?.title}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.dismiss?.selectLabel}</label>
              <select
                  required
                  value={selectedFuncionarioId}
                  onChange={e => setSelectedFuncionarioId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
              >
                  <option value="" disabled>{hrDict.dismiss?.selectPlaceholder}</option>
                  {ativos.map(emp => (
                      <option key={emp.id} value={emp.id}>
                          {emp.usuario?.nome} ({emp.cargo})
                      </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.dismiss?.dateLabel}</label>
                    <input
                        type="date"
                        required
                        value={dataDemissao}
                        onChange={e => setDataDemissao(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.dismiss?.reasonLabel}</label>
                    <textarea
                        required
                        value={motivoDemissao}
                        onChange={e => setMotivoDemissao(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                        placeholder={hrDict.dismiss?.reasonPlaceholder}
                    />
                </div>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg text-sm flex items-start gap-2 mt-4">
                <span className="material-symbols-outlined text-[18px] mt-0.5">warning</span>
                <div>
                    <strong>{hrDict.dismiss?.warningTitle}</strong><br />
                    {hrDict.dismiss?.warningDesc}
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
              {hrDict.dismiss?.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                  {hrDict.dismiss?.saving}
                </>
              ) : (
                hrDict.dismiss?.finish
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
