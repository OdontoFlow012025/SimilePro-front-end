"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

interface TeamListProps {
  type: "dentistas" | "tecnicos" | "secretarias" | "recepcionistas" | "administradores";
  onEdit: (member: any) => void;
  dict: any;
}

export default function TeamList({ type, onEdit, dict }: TeamListProps) {
  const teamDict = dict.team;
  const listDict = teamDict.list;
  const msgDict = teamDict.messages;

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (type === "dentistas") {
        const result = await api.dentists.list();
        setData(Array.isArray(result) ? result : []);
      } else if (type === "administradores") {
        const result = await api.users.list();
        if (Array.isArray(result)) {
           const filtered = result.filter(u => u.tipoUsuario === "ADMIN_GERENCIAL" || u.tipoUsuario === "ADMIN_TOTAL");
           const mapped = filtered.map(u => ({
              id: u.id,
              usuarioId: u.id,
              usuario: u,
              cargo: u.tipoUsuario === "ADMIN_TOTAL" ? listDict.owner : listDict.admin,
           }));
           setData(mapped);
        }
      } else {
        const result = await api.employees.list();
        if (Array.isArray(result)) {
           // Filter based on TipoUsuario
           const filtered = result.filter(emp => {
               const p = emp.usuario?.tipoUsuario;
               if (type === "recepcionistas") return p === "RECEPCIONISTA";
               if (type === "tecnicos") return p === "ASSISTENTE";
               if (type === "secretarias") return p === "FATURISTA";
               return false;
           });
           setData(filtered);
        }
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Expose a global event listener so the Modal and Header can trigger a refresh
    const handleRefresh = () => fetchData();
    window.addEventListener("refreshTeamList", handleRefresh);
    window.addEventListener("clinicChanged", handleRefresh);
    
    return () => {
        window.removeEventListener("refreshTeamList", handleRefresh);
        window.removeEventListener("clinicChanged", handleRefresh);
    };
  }, [type]);

  const handleDelete = async (item: any) => {
    if (item.usuario?.tipoUsuario === "ADMIN_TOTAL") {
       alert(msgDict.deleteOwnerError);
       return;
    }
    if (!confirm(msgDict.deleteConfirm)) return;
    try {
      if (type === "dentistas") {
        await api.dentists.delete(item.id.toString());
      } else if (type === "administradores") {
        await api.users.delete(item.id.toString());
      } else {
        await api.employees.delete(item.id.toString());
      }
      fetchData();
    } catch (err) {
      console.error("Error deleting member:", err);
      alert(msgDict.deleteError);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium text-sm">{listDict.loading}</p>
      </div>
    );
  }

  if (data.length === 0) {
    const roleLabel = listDict.roles[type] || type;
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">group_off</span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{listDict.emptyTitle}</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          {listDict.emptyDesc.replace("{role}", roleLabel)}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th className="px-6 py-4">{listDict.table.name}</th>
            <th className="px-6 py-4">{listDict.table.contact}</th>
            <th className="px-6 py-4">{type === "dentistas" ? listDict.table.specialist : listDict.table.roleProfile}</th>
            <th className="px-6 py-4 text-center">{listDict.table.status}</th>
            <th className="px-6 py-4 text-right">{listDict.table.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800/50">
                    {item.usuario?.nome ? item.usuario.nome.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {item.usuario?.nome || listDict.noName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {item.id} | Usuário: {item.usuarioId}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-gray-400">mail</span>
                  {item.usuario?.email || "--"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  {item.usuario?.telefone || "--"}
                </p>
              </td>
              <td className="px-6 py-4">
                {type === "dentistas" ? (
                  <>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.cro || listDict.noCro}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {item.especialidade || listDict.general}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.cargo || "--"}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {item.usuario?.tipoUsuario || listDict.basicAccess}
                    </p>
                  </>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {listDict.status.active}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title={listDict.actions.edit}
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title={listDict.actions.delete}
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
