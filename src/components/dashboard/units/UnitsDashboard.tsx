"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import UnitsList from "./UnitsList";
import UnitFormModal from "./UnitFormModal";

export default function UnitsDashboard({ dictionary, locale }: { dictionary: any; locale: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const unitsDict = dictionary?.units;

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await api.auth.me();
        const role = data?.tipoUsuario || data?.user?.tipoUsuario;
        if (role === "ADMIN_TOTAL") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          window.location.href = `/${locale}/dashboard`;
        }
      } catch {
        setIsAuthorized(false);
        window.location.href = `/${locale}/dashboard`;
      }
    }
    checkAuth();
  }, [locale]);

  if (isAuthorized === false) return null; 
  if (isAuthorized === null) return <div className="p-8 text-center text-gray-500">{unitsDict?.loadingAuth || "Validando permissões..."}</div>;

  const handleOpenNew = () => {
    setSelectedUnit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit: any) => {
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUnit(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {unitsDict?.title || "Gestão de Unidades"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {unitsDict?.subtitle || "Gerencie as clínicas (filiais) da rede."}
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {unitsDict?.newUnitBtn || "Nova Unidade"}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {unitsDict?.listTitle || "Clínicas Cadastradas"}
          </h2>
        </div>
        
        <UnitsList dictionary={dictionary} onEdit={handleOpenEdit} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <UnitFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={selectedUnit}
          dictionary={dictionary}
        />
      )}
    </div>
  );
}
