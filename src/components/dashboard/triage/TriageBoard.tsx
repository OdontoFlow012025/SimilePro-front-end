"use client";

import { Appointment } from "@/schemas/reception"; // Sharing Appointment type
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import TriageModal from "./TriageModal";

interface Props {
  dictionary: any;
  dateDisplay: string;
}

export default function TriageBoard({ dictionary, dateDisplay }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const all: Appointment[] = await api.scheduling.list("today=true"); 
      // Filter for statuses relevant to Triage: 
      // - CONFIRMADO (Just arrived from Reception)
      // AND DOES NOT HAVE "[TRIAGEM_REALIZADA]" in notes
      const triageList = all.filter(a => 
        ["CONFIRMADO", "AGUARDANDO_TRIAGEM"].includes(a.status as string) &&
        !a.motivoConsulta?.includes("[TRIAGEM_REALIZADA]")
      );
      setAppointments(triageList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStartTriage = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {dictionary.triage?.title || "Triagem"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            {dateDisplay}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={fetchAppointments} 
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Atualizar"
            >
                <span className="material-symbols-outlined">refresh</span>
            </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                {dictionary.triage?.waitingQueue || "Fila de Espera"} ({appointments.length})
            </h3>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
             {loading ? (
                 <div className="text-center py-10 text-gray-500 animate-pulse">Carregando...</div>
             ) : appointments.length === 0 ? (
                 <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
                     <span className="material-symbols-outlined text-4xl opacity-50">assignment_turned_in</span>
                     <p>{dictionary.triage?.empty || "Nenhum paciente aguardando triagem."}</p>
                 </div>
             ) : (
                 appointments.map(appt => (
                     <div key={appt.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-4">
                         <div className="flex items-center gap-4">
                             <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                                 {appt.paciente?.nome?.charAt(0).toUpperCase() || "?"}
                             </div>
                             <div>
                                 <h4 className="font-bold text-lg text-gray-900 dark:text-white">{appt.paciente?.nome}</h4>
                                 <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {appt.dataHoraInicio.split('T')[1].substring(0, 5)}</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">dentistry</span> {appt.dentista?.usuario?.nome || "Dentista"}</span>
                                 </div>
                             </div>
                         </div>
                         
                         <button 
                            onClick={() => handleStartTriage(appt)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                         >
                            <span className="material-symbols-outlined">clinical_notes</span>
                            {dictionary.triage?.startBtn || "Realizar Triagem"}
                         </button>
                     </div>
                 ))
             )}
        </div>
      </div>

      {isModalOpen && selectedAppointment && (
        <TriageModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            appointment={selectedAppointment}
            dictionary={dictionary}
            onSuccess={fetchAppointments}
        />
      )}
    </div>
  );
}
