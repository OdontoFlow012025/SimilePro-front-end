"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";

type FormState = {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  numero: string; // we can combine this into Endereco later if needed or just use Endereco
};

export default function UnitFormModal({ 
  isOpen, 
  onClose,
  initialData,
  dictionary
}: { 
  isOpen: boolean; 
  onClose: () => void;
  initialData?: any;
  dictionary: any;
}) {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitsDict = dictionary?.units;
  const formDict = unitsDict?.form;

  const [formData, setFormData] = useState<FormState>({
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",
    telefone: "",
    endereco: "",
    numero: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nomeFantasia: initialData.nomeFantasia || initialData.nome || "",
        razaoSocial: initialData.razaoSocial || "",
        cnpj: initialData.cnpj || "",
        telefone: initialData.telefone || "",
        endereco: initialData.endereco || "",
        numero: initialData.numero || "",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        nomeFantasia: formData.nomeFantasia,
        razaoSocial: formData.razaoSocial,
        cnpj: formData.cnpj,
        telefone: formData.telefone,
        endereco: formData.endereco + (formData.numero ? `, ${formData.numero}` : ''),
      };

      if (isEditing) {
        throw new Error(formDict?.errorUpdate || "Edição de clínicas pelo painel ainda não está implementada no backend");
      } else {
        await api.clinics.create(payload);
      }

      window.dispatchEvent(new Event("refreshUnitsList"));
      onClose();
    } catch (err: any) {
      setError(err.message || formDict?.errorGeneric || "Ocorreu um erro ao salvar a unidade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined">domain</span>
             </div>
             <div>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                 {isEditing ? (formDict?.editTitle || "Editar Unidade") : (formDict?.newTitle || "Nova Unidade")}
               </h2>
               <p className="text-sm text-gray-500">
                 {isEditing ? (formDict?.editSubtitle || "Atualize os dados da clínica") : (formDict?.newSubtitle || "Adicione uma nova filial na rede")}
               </p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800/30 flex items-start gap-3">
              <span className="material-symbols-outlined shrink-0 text-xl">error</span>
              <p>{error}</p>
            </div>
          )}

          <form id="unitForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict?.nameLabel || "Nome Fantasia da Unidade *"}</label>
                   <input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder={formDict?.namePlaceholder || "Ex: Clínica Centro"}/>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict?.razaoLabel || "Razão Social *"}</label>
                   <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder={formDict?.razaoPlaceholder || "Ex: Simile Pro Clínica LTDA"}/>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict?.cnpjLabel || "CNPJ *"}</label>
                   <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder={formDict?.cnpjPlaceholder || "00.000.000/0001-00"}/>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict?.phoneLabel || "Telefone da Unidade"}</label>
                   <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder={formDict?.phonePlaceholder || "(00) 0000-0000"}/>
                 </div>

                 <div className="md:col-span-2">
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict?.addressLabel || "Endereço Principal"}</label>
                   <div className="flex gap-4">
                     <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder={formDict?.addressPlaceholder || "Logradouro, Bairro"}/>
                     <input type="text" name="numero" value={formData.numero} onChange={handleChange} className="w-32 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder={formDict?.numberPlaceholder || "Número"}/>
                   </div>
                 </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/20">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {formDict?.cancelBtn || "Cancelar"}
          </button>
          <button 
            form="unitForm" 
            type="submit" 
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                {formDict?.saving || "Salvando..."}
              </>
            ) : (
              formDict?.saveBtn || "Salvar Unidade"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
