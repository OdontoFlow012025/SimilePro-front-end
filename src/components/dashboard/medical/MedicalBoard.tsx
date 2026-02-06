"use client";

import { Appointment } from "@/schemas/reception";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  dictionary: any;
  dateDisplay: string;
}

export default function MedicalBoard({ dictionary, dateDisplay }: Props) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const all: Appointment[] = await api.scheduling.list("today=true"); 
      // Filter for Medical Care:
      // - CONFIRMADO + [TRIAGEM_REALIZADA] in notes
      // - OR EM_ATENDIMENTO (if we can set that status later)
      const medicalList = all.filter(a => {
         const isConfirmedAndTriaged = a.status === "CONFIRMADO" && a.motivoConsulta?.includes("[TRIAGEM_REALIZADA]");
         const isInService = a.status === "EM_ATENDIMENTO"; 
         return isConfirmedAndTriaged || isInService;
      });

      // Parse Risk and Sort
      // Risk Weights (Standard Manchester)
      const riskWeights: Record<string, number> = {
          "VERMELHO": 5, 
          "LARANJA": 4, 
          "AMARELO": 3, 
          "VERDE": 2, 
          "AZUL": 1
      };

      const getRisk = (text: string | undefined): number => {
          if (!text) return 0;
          // Flexible regex: case insensitive, optional space
          const match = text.match(/Risco:\s*(AZUL|VERDE|AMARELO|LARANJA|VERMELHO)/i);
          if (!match) return 0;
          
          const risk = match[1].toUpperCase(); // Normalize
          return riskWeights[risk] || 0;
      };

      medicalList.sort((a, b) => {
          const riskA = getRisk(a.motivoConsulta || undefined);
          const riskB = getRisk(b.motivoConsulta || undefined);

          // 1. Higher Risk First (Descending)
          if (riskA !== riskB) {
              return riskB - riskA; 
          }

          // 2. Longer wait time First (Ascending date string - older is smaller)
          return a.dataHoraInicio.localeCompare(b.dataHoraInicio);
      });

      setAppointments(medicalList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStartService = (appt: Appointment) => {
     const path = window.location.pathname; 
     router.push(`${path}/${appt.id}`);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {dictionary.dashboard?.medical?.title || "Atendimento Médico"}
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
                {dictionary.dashboard?.medical?.waitingList || "Pacientes Aguardando"} ({appointments.length})
            </h3>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
             {loading ? (
                 <div className="text-center py-10 text-gray-500 animate-pulse">Carregando...</div>
             ) : appointments.length === 0 ? (
                 <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
                     <span className="material-symbols-outlined text-4xl opacity-50">ward</span>
                     <p>{dictionary.dashboard?.medical?.empty || "Nenhum paciente aguardando atendimento."}</p>
                 </div>
             ) : (
                 appointments.map(appt => {
                     // Extract Risk for Display
                     const match = appt.motivoConsulta?.match(/Risco:\s*(AZUL|VERDE|AMARELO|LARANJA|VERMELHO)/i);
                     const riskKey = match ? match[1].toUpperCase() : null;
                     
                     const riskColors: any = {
                        "VERMELHO": "bg-red-500 text-white shadow-red-200",
                        "LARANJA": "bg-orange-500 text-white shadow-orange-200",
                        "AMARELO": "bg-yellow-400 text-yellow-900 shadow-yellow-200",
                        "VERDE": "bg-emerald-500 text-white shadow-emerald-200",
                        "AZUL": "bg-blue-500 text-white shadow-blue-200"
                     };

                     const riskTranslations: any = {
                        "VERMELHO": dictionary.dashboard?.medical?.risks?.red || "VERMELHO",
                        "LARANJA": dictionary.dashboard?.medical?.risks?.orange || "LARANJA",
                        "AMARELO": dictionary.dashboard?.medical?.risks?.yellow || "AMARELO",
                        "VERDE": dictionary.dashboard?.medical?.risks?.green || "VERDE",
                        "AZUL": dictionary.dashboard?.medical?.risks?.blue || "AZUL"
                     };

                     const colorClass = riskKey ? riskColors[riskKey] : "bg-gray-200 text-gray-500";
                     const riskLabel = riskKey ? riskTranslations[riskKey] : null;
                     
                     return (
                     <div key={appt.id} className="bg-white dark:bg-gray-800 border-l-4 border-gray-100 dark:border-gray-700 rounded-r-lg p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                         
                         {/* Left: Patient Info */}
                         <div className="flex items-center gap-4 flex-1">
                             <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                                 {appt.paciente?.nome?.charAt(0).toUpperCase() || "?"}
                             </div>
                             <div>
                                 <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    {appt.paciente?.nome}
                                 </h4>
                                 <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1" title="Chegada"><span className="material-symbols-outlined text-[16px]">schedule</span> {appt.dataHoraInicio.split('T')[1].substring(0, 5)}</span>
                                 </div>
                             </div>
                         </div>

                         {/* Center: Risk Column */}
                         <div className="flex flex-col items-center justify-center w-32 border-l border-r border-gray-100 dark:border-gray-700 px-4 py-1">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                                {dictionary.dashboard?.medical?.classification || "Classificação"}
                            </span>
                            {riskLabel ? (
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${colorClass}`}>
                                    {riskLabel}
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400 italic">{dictionary.dashboard?.medical?.noRisk || "Sem risco"}</span>
                            )}
                         </div>
                         
                          {/* Right: Action */}
                          <button 
                             onClick={() => handleStartService(appt)}
                             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                          >
                             <span className="material-symbols-outlined">stethoscope</span>
                             {dictionary.dashboard?.medical?.startBtn || "Iniciar Atendimento"}
                          </button>
                      </div>
                  )})
             )}
        </div>
      </div>
    </div>
  );
}
