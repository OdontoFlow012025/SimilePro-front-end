"use client";

import { api } from "@/services/api";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preSelectedPatient?: { id: number; nome: string };
  dictionary: any;
}

export default function AppointmentModal({ isOpen, onClose, onSuccess, preSelectedPatient, dictionary }: Props) {
  const [loading, setLoading] = useState(false);
  const [dentists, setDentists] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]); // For searching if not pre-selected
  
  const [formData, setFormData] = useState({
    patientId: "",
    dentistId: "",
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    time: "09:00",
    duration: 30, // minutes
    notes: ""
  });
  
  // Load initial data
  useEffect(() => {
    if (isOpen) {
        loadDentists();
        if (!preSelectedPatient) {
            loadPatients();
        } else {
            setFormData(prev => ({ ...prev, patientId: String(preSelectedPatient.id) }));
        }
    }
  }, [isOpen, preSelectedPatient]);

  const loadDentists = async () => {
    try {
        const data = await api.dentists.list();
        // Assuming data is array or data.content is array
        setDentists(Array.isArray(data) ? data : data.content || []);
    } catch (e) {
        console.error("Failed to load dentists", e);
    }
  };

  const loadPatients = async () => {
    try {
        const data = await api.patients.list();
        setPatients(Array.isArray(data) ? data : data.content || []);
    } catch (e) {
        console.error("Failed to load patients", e);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        // Calculate End Time
        const startDateTime = new Date(`${formData.date}T${formData.time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + formData.duration * 60000);

        const payload = {
            pacienteId: Number(formData.patientId),
            dentistaId: Number(formData.dentistId),
            dataHoraInicio: startDateTime.toISOString(),
            dataHoraFim: endDateTime.toISOString(),
            motivoConsulta: formData.notes || "Consulta Geral",
            status: "AGENDADO",
            usuarioCriacaoId: 0 // Backend will inject the correct ID from the JWT token
        };

        await api.scheduling.create(payload);
        alert(dictionary.appointmentModal?.successMessage || "Agendamento criado com sucesso!");
        onSuccess();
        onClose();
    } catch (error: any) {
        console.error(error);
        alert((dictionary.appointmentModal?.genericError || "Erro ao agendar") + ": " + (error.message || "Erro desconhecido"));
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{dictionary.appointmentModal?.title || "Novo Agendamento"}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        <div className="p-6 space-y-4">
            {/* Patient Selection */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.appointmentModal?.patientLabel || "Paciente"}</label>
                {preSelectedPatient ? (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg font-medium border border-blue-200 dark:border-blue-800">
                        {preSelectedPatient.nome}
                    </div>
                ) : (
                    <select 
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        value={formData.patientId}
                        onChange={e => setFormData({...formData, patientId: e.target.value})}
                    >
                        <option value="">{dictionary.appointmentModal?.patientSelect || "Selecione um paciente..."}</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.nome} - CPF: {p.cpf}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Dentist Selection */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.appointmentModal?.dentistLabel || "Dentista"}</label>
                <select 
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    value={formData.dentistId}
                    onChange={e => setFormData({...formData, dentistId: e.target.value})}
                >
                    <option value="">{dictionary.appointmentModal?.dentistSelect || "Selecione um dentista..."}</option>
                    {dentists.map(d => (
                         // Assuming dentista has a linked 'usuario.nome' or similar, check API response later if needed
                         // For now assume d.nome or d.usuario?.nome exists. 
                         // Check docs.json: CreateDentistaDto has usuarioId. List likely returns relations.
                         <option key={d.id} value={d.id}>{d.usuario?.nome || d.nome || `Dentista #${d.id}`}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.appointmentModal?.dateLabel || "Data"}</label>
                   <input 
                      type="date" 
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.appointmentModal?.timeLabel || "Hora"}</label>
                   <input 
                      type="time" 
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                   />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{dictionary.appointmentModal?.notesLabel || "Observações"}</label>
                <textarea 
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    placeholder={dictionary.appointmentModal?.notesPlaceholder || "Motivo da consulta..."}
                />
            </div>

            <button 
                onClick={handleSubmit}
                disabled={loading || !formData.patientId || !formData.dentistId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
                {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
                {dictionary.appointmentModal?.submitButton || "Agendar Consulta"}
            </button>
        </div>
      </div>
    </div>
  );
}
