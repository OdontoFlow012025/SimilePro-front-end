"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

export default function RubricasConfig({ dict }: { dict: any }) {
  const [rubricas, setRubricas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRubrica, setNewRubrica] = useState({
    descricao: "",
    tipo: "PROVENTO",
    incideInss: false,
    incideFgts: false,
    incideIrrf: false
  });

  const fetchRubricas = async () => {
    setLoading(true);
    try {
      const data = await api.hr.getRubricas();
      setRubricas(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRubricas();
  }, []);

  const handleCreate = async () => {
    try {
      await api.hr.createRubrica(newRubrica);
      setIsModalOpen(false);
      setNewRubrica({
        descricao: "",
        tipo: "PROVENTO",
        incideInss: false,
        incideFgts: false,
        incideIrrf: false
      });
      fetchRubricas();
    } catch (err) {
      alert("Erro ao criar rubrica");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold dark:text-white">Configuração de Rubricas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Nova Rubrica
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3 text-center">INSS</th>
              <th className="px-6 py-3 text-center">FGTS</th>
              <th className="px-6 py-3 text-center">IRRF</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                </td>
              </tr>
            ) : rubricas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Nenhuma rubrica cadastrada.</td>
              </tr>
            ) : (
              rubricas.map((r) => (
                <tr key={r.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium dark:text-white">{r.descricao}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.tipo === 'PROVENTO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {r.incideInss ? <span className="text-green-500 material-symbols-outlined">check_circle</span> : <span className="text-gray-300 material-symbols-outlined">cancel</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {r.incideFgts ? <span className="text-green-500 material-symbols-outlined">check_circle</span> : <span className="text-gray-300 material-symbols-outlined">cancel</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {r.incideIrrf ? <span className="text-green-500 material-symbols-outlined">check_circle</span> : <span className="text-gray-300 material-symbols-outlined">cancel</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-bold">Ativa</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Cadastrar Nova Rubrica</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                <input
                  type="text"
                  value={newRubrica.descricao}
                  onChange={(e) => setNewRubrica({ ...newRubrica, descricao: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Hora Extra 50%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                <select
                  value={newRubrica.tipo}
                  onChange={(e) => setNewRubrica({ ...newRubrica, tipo: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="PROVENTO">PROVENTO (Ganhos)</option>
                  <option value="DESCONTO">DESCONTO</option>
                </select>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Incidências Tributárias:</p>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRubrica.incideInss}
                      onChange={(e) => setNewRubrica({ ...newRubrica, incideInss: e.target.checked })}
                      className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm dark:text-white">INSS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRubrica.incideFgts}
                      onChange={(e) => setNewRubrica({ ...newRubrica, incideFgts: e.target.checked })}
                      className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm dark:text-white">FGTS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRubrica.incideIrrf}
                      onChange={(e) => setNewRubrica({ ...newRubrica, incideIrrf: e.target.checked })}
                      className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm dark:text-white">IRRF</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 font-bold">Cancelar</button>
              <button onClick={handleCreate} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
