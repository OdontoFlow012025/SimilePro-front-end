"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function UnitsList({ dictionary, onEdit }: { dictionary: any; onEdit: (unit: any) => void }) {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unitsDict = dictionary?.units;

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.clinics.list();
      if (Array.isArray(data)) {
        setUnits(data);
      } else {
        setUnits([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || dictionary?.dashboard?.units?.errorGeneric || "Erro ao carregar filiais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
    
    const handleRefresh = () => fetchUnits();
    window.addEventListener("refreshUnitsList", handleRefresh);
    return () => window.removeEventListener("refreshUnitsList", handleRefresh);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <span className="material-symbols-outlined animate-spin text-4xl text-blue-500">
          sync
        </span>
        <p className="mt-2 text-sm font-medium">{unitsDict?.loading || "Buscando filiais..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <span className="material-symbols-outlined text-4xl">error</span>
        <p className="mt-2 text-sm font-medium">{error}</p>
        <button onClick={fetchUnits} className="mt-4 text-blue-600 hover:underline text-sm font-bold">
          {dictionary?.dashboard?.receptionBoard?.triage?.cancelBtn || "Tentar Novamente"}
        </button>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">domain_disabled</span>
        <p className="text-sm">{unitsDict?.empty || "Nenhuma unidade cadastrada no sistema."}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4 font-bold tracking-wider">{unitsDict?.table?.name || "Nome da Unidade"}</th>
            <th className="px-6 py-4 font-bold tracking-wider">{unitsDict?.table?.phone || "Telefone"}</th>
            <th className="px-6 py-4 font-bold tracking-wider">{unitsDict?.table?.address || "Endereço"}</th>
            <th className="px-6 py-4 text-right font-bold tracking-wider">{unitsDict?.table?.actions || "Ações"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {units.map((unit) => (
            <tr key={unit.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-[20px]">domain</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[15px]">{unit.nomeFantasia}</div>
                    <div className="text-xs text-gray-500">{unit.cnpj || unitsDict?.emptyCnpj || "Sem CNPJ"}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{unit.telefone || unitsDict?.noInfo || "Não informado"}</td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {unit.endereco ? `${unit.endereco}${unit.numero ? `, ${unit.numero}` : ""}` : (unitsDict?.noInfo || "Não informado")}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onEdit(unit)}
                  className="p-2 mr-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title={unitsDict?.table?.actions || "Editar Unidade"}
                >
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
