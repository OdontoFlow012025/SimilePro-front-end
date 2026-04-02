"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

interface TeamFormModalProps {
  onClose: () => void;
  initialData?: any;
  defaultType: "dentistas" | "tecnicos" | "secretarias" | "recepcionistas" | "administradores";
  dict: any;
}

export default function TeamFormModal({ onClose, initialData, defaultType, dict }: TeamFormModalProps) {
  const teamDict = dict.team;
  const formDict = teamDict.form;
  const msgDict = teamDict.messages;

  const isEditing = !!initialData;
  const [type, setType] = useState<"dentistas" | "tecnicos" | "secretarias" | "recepcionistas" | "administradores">(defaultType);
  
  const getInitialRole = (t: string) => {
      switch(t) {
          case "dentistas": return "DENTISTA";
          case "tecnicos": return "ASSISTENTE";
          case "secretarias": return "FATURISTA";
          case "recepcionistas": return "RECEPCIONISTA";
          case "administradores": return "ADMIN_GERENCIAL";
          default: return "RECEPCIONISTA";
      }
  };

  const getInitialCargo = (t: string) => {
    switch(t) {
        case "tecnicos": return formDict.defaultCargos.technician;
        case "secretarias": return formDict.defaultCargos.finance;
        case "recepcionistas": return formDict.defaultCargos.reception;
        case "administradores": return formDict.defaultCargos.admin;
        default: return "";
    }
};

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    tipoUsuario: getInitialRole(type),
    cro: "",
    especialidade: "",
    cargo: getInitialCargo(type),
    salario: 0,
    clinicaId: null as number | null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);

  useEffect(() => {
    // Load clinics so we can attach employees
    api.clinics.getNetworkClinics().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setClinics(data);
        setFormData(prev => ({ ...prev, clinicaId: data[0].id }));
      }
    }).catch(console.error);

    if (isEditing && initialData) {
      let inferredType: "dentistas" | "tecnicos" | "secretarias" | "recepcionistas" | "administradores" = "recepcionistas";
      if (initialData.cro !== undefined) {
          inferredType = "dentistas";
      } else {
          const role = initialData.usuario?.tipoUsuario;
          if (role === "ASSISTENTE") inferredType = "tecnicos";
          else if (role === "FATURISTA") inferredType = "secretarias";
          else if (role === "ADMIN_GERENCIAL" || role === "ADMIN_TOTAL") inferredType = "administradores";
          else inferredType = "recepcionistas";
      }

      setType(inferredType);
      
      setFormData({
        nome: initialData.usuario?.nome || "",
        email: initialData.usuario?.email || "",
        telefone: initialData.usuario?.telefone || "",
        senha: "", // keep blank on edit unless changing
        tipoUsuario: initialData.usuario?.tipoUsuario || getInitialRole(inferredType),
        cro: initialData.cro || "",
        especialidade: initialData.especialidade || "",
        cargo: initialData.cargo || getInitialCargo(inferredType),
        salario: initialData.salario || 0,
        clinicaId: initialData.clinicaId || null,
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (newType: "dentistas" | "tecnicos" | "secretarias" | "recepcionistas" | "administradores") => {
      setType(newType);
      setFormData(prev => ({
          ...prev, 
          tipoUsuario: getInitialRole(newType),
          cargo: getInitialCargo(newType)
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        // Edit flow
        if (type === "dentistas") {
            await api.dentists.update(initialData.id.toString(), {
                cro: formData.cro,
                especialidade: formData.especialidade
            });
            // Update the user details via a separate call if your API supports it.
            if (initialData.usuario?.id) {
                await api.users.update(initialData.usuario.id.toString(), {
                   nome: formData.nome,
                   telefone: formData.telefone
                });
            }
        } else if (type === "administradores") {
            // Admin users might only exist in the users table, they don't have Employee logic to update for cargo/salary
            if (initialData.usuario?.id) {
                await api.users.update(initialData.usuario.id.toString(), {
                   nome: formData.nome,
                   telefone: formData.telefone
                });
            }
        } else {
            await api.employees.update(initialData.id.toString(), {
                cargo: formData.cargo,
                salario: Number(formData.salario)
            });
             if (initialData.usuario?.id) {
                await api.users.update(initialData.usuario.id.toString(), {
                   nome: formData.nome,
                   telefone: formData.telefone
                });
            }
        }
      } else {
        // Create flow
        // 1. Create User via /auth/signup
        const authRes = await api.auth.signup({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          telefone: formData.telefone,
          tipoUsuario: formData.tipoUsuario,
        });

        if (!authRes.user || !authRes.user.id) {
           throw new Error(msgDict.userFetchError);
        }
        
        const newUserId = authRes.user.id;

        // 2. Attach specialized profile
        if (type === "dentistas") {
          await api.dentists.create({
            usuarioId: newUserId,
            cro: formData.cro,
            especialidade: formData.especialidade,
          });
        } else {
          await api.employees.create({
            usuarioId: newUserId,
            clinicaId: formData.clinicaId || (clinics.length > 0 ? clinics[0].id : 0),
            cargo: formData.cargo,
            salario: Number(formData.salario),
          });
        }
      }

      window.dispatchEvent(new Event("refreshTeamList"));
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || msgDict.saveError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-extrabold text-[#111518] dark:text-white">
            {isEditing ? formDict.editTitle : formDict.newTitle}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {!isEditing && (
             <div className="flex flex-wrap gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="profileType" checked={type === "dentistas"} onChange={() => handleTypeChange("dentistas")} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formDict.profiles.dentist}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="profileType" checked={type === "tecnicos"} onChange={() => handleTypeChange("tecnicos")} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formDict.profiles.technician}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="profileType" checked={type === "recepcionistas"} onChange={() => handleTypeChange("recepcionistas")} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formDict.profiles.reception}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="profileType" checked={type === "secretarias"} onChange={() => handleTypeChange("secretarias")} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formDict.profiles.finance}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="profileType" checked={type === "administradores"} onChange={() => handleTypeChange("administradores")} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formDict.profiles.admin}</span>
                </label>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.fullName}</label>
              <input 
                type="text" name="nome" value={formData.nome} onChange={handleChange} required
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
                placeholder={formDict.placeholders.name}
              />
            </div>
            
            <div>
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.email}</label>
               <input 
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  disabled={isEditing}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:opacity-50" 
                  placeholder={formDict.placeholders.email}
               />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.phone}</label>
              <input 
                type="text" name="telefone" value={formData.telefone} onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
                placeholder={formDict.placeholders.phone}
              />
            </div>

            {!isEditing && (
                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.password}</label>
                   <input 
                      type="password" name="senha" value={formData.senha} onChange={handleChange} required={!isEditing}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
                      placeholder={formDict.placeholders.password}
                   />
                </div>
            )}
          </div>

          <hr className="border-gray-200 dark:border-gray-800" />
          
          <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <span className="material-symbols-outlined text-blue-500 text-[20px]">
                {type === "dentistas" ? "medical_information" : "badge"}
             </span>
             {type === "dentistas" ? formDict.labels.specialistData : formDict.labels.hiringData}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {type === "dentistas" ? (
               <>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.cro}</label>
                   <input 
                     type="text" name="cro" value={formData.cro} onChange={handleChange} required
                     className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
                     placeholder={formDict.placeholders.cro}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.specialty}</label>
                   <input 
                     type="text" name="especialidade" value={formData.especialidade} onChange={handleChange}
                     className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
                     placeholder={formDict.placeholders.specialty}
                   />
                 </div>
               </>
             ) : (
               <>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.accessLevel}</label>
                   <select 
                     name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange} required disabled={type !== "administradores" && type !== "secretarias" && type !== "recepcionistas" && type !== "tecnicos"}
                     className={`w-full border text-sm rounded-lg block p-2.5 ${
                        type !== "administradores" 
                          ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" 
                          : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                     }`} 
                   >
                      <option value="RECEPCIONISTA">{formDict.accessLevels.receptionist}</option>
                      <option value="ASSISTENTE">{formDict.accessLevels.assistant}</option>
                      <option value="FATURISTA">{formDict.accessLevels.billing}</option>
                      <option value="ADMIN_GERENCIAL">{formDict.accessLevels.unitManager}</option>
                      {type === "administradores" && <option value="ADMIN_TOTAL">{formDict.accessLevels.owner}</option>}
                   </select>
                   {type !== "administradores" && <p className="text-[11px] text-gray-500 mt-1">{formDict.helpers.autoFill}</p>}
                   {type === "administradores" && <p className="text-[11px] text-gray-500 mt-1">{formDict.helpers.adminChoice}</p>}
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.specificRole}</label>
                   <input 
                     type="text" name="cargo" value={formData.cargo} onChange={handleChange} required
                     className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
                     placeholder={formDict.placeholders.role}
                   />
                 </div>

                 {clinics.length > 0 && (
                   <div className="md:col-span-2">
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{formDict.labels.linkUnit}</label>
                     <select 
                       name="clinicaId" value={formData.clinicaId || ""} onChange={(e) => setFormData(p => ({...p, clinicaId: Number(e.target.value)}))}
                       className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
                     >
                       {clinics.map(c => (
                          <option key={c.id} value={c.id}>{c.nomeFantasia}</option>
                       ))}
                     </select>
                   </div>
                 )}
               </>
             )}
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/30">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {formDict.buttons.cancel}
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>}
            {isEditing ? formDict.buttons.saveChanges : formDict.buttons.complete}
          </button>
        </div>
      </div>
    </div>
  );
}
