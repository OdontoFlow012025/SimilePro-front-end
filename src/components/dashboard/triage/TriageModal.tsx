"use client";

import { Appointment } from "@/schemas/reception";
import { api } from "@/services/api"; // You might need a specific triage API or use scheduling.updateStatus + metadata
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  dictionary: any;
  onSuccess: () => void;
}

export default function TriageModal({ isOpen, onClose, appointment, dictionary, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    pressure: "",
    heartRate: "",
    temp: "",
    oxygen: "",
    weight: "",
    complaint: "",
    risk: "VERDE" // Default Green
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
        // Here we ideally send to a Triage endpoint.
        // For now, let's assume we update the appointment status and maybe save triage data in 'notes' (motivoConsulta) 
        // OR a hypothetical api.triage.create endpoint.
        // Assuming we just update status to EM_ESPERA_MEDICA and append notes for MVP.
        
        const triageNote = `[TRIAGEM] 
PA: ${formData.pressure} | FC: ${formData.heartRate} | Temp: ${formData.temp} | Sat: ${formData.oxygen} | Peso: ${formData.weight}
Queixa: ${formData.complaint}
Risco: ${formData.risk}`;

        // Update Appointment
        // Backend restricts status to: AGENDADO, CONFIRMADO, CANCELADO, ATENDIDO, NAO_COMPARECEU
        // We will keep it as 'CONFIRMADO' but the appended note will serve as a flag for the frontend to know it's triaged.
        await api.scheduling.update(appointment.id.toString(), {
            motivoConsulta: (appointment.motivoConsulta || "") + "\n\n" + triageNote + "\n[TRIAGEM_REALIZADA]",
            status: "CONFIRMADO" // Keeping valid status
        });

        onSuccess();
        onClose();
    } catch (error) {
        console.error(error);
        alert(dictionary.triage?.error || "Erro ao salvar triagem.");
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">health_metrics</span>
                    {dictionary.triage?.modalTitle || "Triagem Clínica"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{dictionary.triage?.patientLabel || "Paciente"}: <span className="font-semibold">{appointment.paciente?.nome}</span></p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Vitals Grid */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">vital_signs</span>
                    {dictionary.triage?.vitalsTitle || "Sinais Vitais"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.triage?.pressureLabel || "PA (mmHg)"}</label>
                        <input type="text" placeholder="120/80" className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                            value={formData.pressure} onChange={e => setFormData({...formData, pressure: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.triage?.heartRateLabel || "FC (bpm)"}</label>
                        <input type="number" placeholder="80" className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                             value={formData.heartRate} onChange={e => setFormData({...formData, heartRate: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.triage?.tempLabel || "Temp (ºC)"}</label>
                        <input type="number" placeholder="36.5" className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                             value={formData.temp} onChange={e => setFormData({...formData, temp: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.triage?.oxygenLabel || "Sat. O2 (%)"}</label>
                        <input type="number" placeholder="98" className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                             value={formData.oxygen} onChange={e => setFormData({...formData, oxygen: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.triage?.weightLabel || "Peso (kg)"}</label>
                        <input type="number" placeholder="70" className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                             value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* Complaint */}
            <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">{dictionary.triage?.complaintLabel || "Queixa Principal / História"}</label>
                <textarea 
                    rows={4} 
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 ring-emerald-500"
                    placeholder={dictionary.triage?.complaintPlaceholder || "Descreva o motivo da visita..."}
                    value={formData.complaint} onChange={e => setFormData({...formData, complaint: e.target.value})}
                />
            </div>

            {/* Risk Classification */}
            <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">{dictionary.triage?.riskLabel || "Classificação de Risco"}</label>
                <div className="flex gap-2">
                    {["AZUL", "VERDE", "AMARELO", "LARANJA", "VERMELHO"].map(risk => {
                        const colors: any = {
                            "AZUL": "bg-blue-500",
                            "VERDE": "bg-green-500",
                            "AMARELO": "bg-yellow-500",
                            "LARANJA": "bg-orange-500",
                            "VERMELHO": "bg-red-600"
                        };
                        const isSelected = formData.risk === risk;
                        return (
                            <button
                                key={risk}
                                onClick={() => setFormData({...formData, risk})}
                                className={`h-10 flex-1 round-lg transition-all border-2 ${isSelected ? 'border-gray-800 dark:border-white scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'} ${colors[risk]}`}
                                title={risk}
                            >
                                <span className="sr-only">{risk}</span>
                                {isSelected && <span className="material-symbols-outlined text-white font-bold drop-shadow-md">check</span>}
                            </button>
                        )
                    })}
                </div>
                <p className="text-xs text-center mt-2 text-gray-500">{dictionary.triage?.riskHelper || "Selecione a gravidade (Manchester)"}</p>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
            <button onClick={onClose} className="px-5 py-2 text-gray-600 hover:text-gray-900 font-medium">{dictionary.triage?.cancelBtn || "Cancelar"}</button>
            <button 
                onClick={handleSubmit} 
                disabled={loading || !formData.complaint}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
                {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
                {loading ? (dictionary.triage?.saving || "Salvando...") : (dictionary.triage?.saveBtn || "Salvar Triagem")}
            </button>
        </div>

      </div>
    </div>
  );
}
