"use client";

import { AppointmentSchema, type Appointment } from "@/schemas/reception";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { z } from "zod";
import AppointmentModal from "./AppointmentModal";
import PatientRegistrationModal from "./PatientRegistrationModal";

interface ReceptionBoardProps {
  dictionary: any;
  dateDisplay: string;
}

export default function ReceptionBoard({ dictionary, dateDisplay }: ReceptionBoardProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [preSelectedPatient, setPreSelectedPatient] = useState<{id: number, nome: string} | undefined>(undefined);

  const fetchAppointments = async () => {
    try {
      const now = new Date();
      // Format YYYY-MM-DD
      const dateStr = now.toISOString().split('T')[0];
      
      const response = await api.scheduling.list(`data=${dateStr}`);
      
      // Strict Zod Validation
      const result = z.array(AppointmentSchema).safeParse(response);
      
      if (result.success) {
        // Filter for TODAY just in case API returns more
        const todayItems = result.data.filter(item => 
            item.dataHoraInicio.startsWith(dateStr)
        );
        setAppointments(todayItems);
      } else {
        console.error("Zod Validation Error:", result.error);
        // Fallback: try to interpret as raw array but warn
        // For strict compliance "no any", we strictly fail or show empty if invalid
        // But to be helpful, let's log and set empty for now to avoid crashing UI with 'any' data
        setAppointments([]); 
      }
    } catch (error) {
      console.error("Failed to fetch reception data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    // Auto-refresh every 30s
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = async (id: number) => {
    setProcessingId(id);
    try {
      // Backend only supports: AGENDADO, CONFIRMADO, CANCELADO, ATENDIDO, NAO_COMPARECEU
      // We treat "CONFIRMADO" as "Waiting Room" (Check-in done)
      await api.scheduling.updateStatus(id.toString(), { status: "CONFIRMADO" });
      await fetchAppointments(); // Refresh
    } catch (error: any) {
      console.error(error);
      alert((dictionary.dashboard?.receptionBoard?.checkinError || "Erro ao realizar check-in") + ": " + (error.message || "Erro desconhecido"));
    } finally {
      setProcessingId(null);
    }
  };

  const getColumns = () => {
    // Column 1: Scheduled (Agendado)
    const scheduled = appointments.filter(a => 
      ["AGENDADO"].includes(a.status)
    ).sort((a, b) => a.dataHoraInicio.localeCompare(b.dataHoraInicio));

    // Column 2: Waiting (Confirmado) - In the waiting room
    const waiting = appointments.filter(a => 
      ["CONFIRMADO", "AGUARDANDO"].includes(a.status) // Keep AGUARDANDO in case backend adds it later
    ).sort((a, b) => a.dataHoraInicio.localeCompare(b.dataHoraInicio));

    // Column 3: In Service (Em Atendimento)
    // Map ATENDIDO too? Or just if we had EM_ATENDIMENTO
    const inService = appointments.filter(a => 
      ["EM_ATENDIMENTO", "ATENDENDO"].includes(a.status)
    );

    return { scheduled, waiting, inService };
  };

  const { scheduled, waiting, inService } = getColumns();

  if (loading) return <div className="p-8 text-center animate-pulse">{dictionary.dashboard?.receptionBoard?.loading || "Carregando recepção..."}</div>;

  return (
    <div className="flex flex-col h-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {dictionary.dashboard?.receptionBoard?.title || "Recepção"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                {dateDisplay}
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-all font-medium"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>{dictionary.dashboard?.receptionBoard?.newPatientBtn || "Novo Paciente"}</span>
            </button>
            <button 
              onClick={() => setIsAppointmentModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-all font-medium"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
              <span>{dictionary.dashboard?.receptionBoard?.scheduleBtn || "Agendar"}</span>
            </button>
        </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Column 1: Scheduled */}
        <Column 
          title={dictionary.dashboard?.receptionBoard?.scheduled || "Agendados"} 
          count={scheduled.length}
          color="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900"
          textColor="text-blue-700 dark:text-blue-300"
        >
          {scheduled.map(appt => (
            <PatientCard 
              key={appt.id} 
              appt={appt} 
              dictionary={dictionary}
              actionLabel={dictionary.dashboard?.receptionBoard?.checkIn || "Confirmar"}
              onAction={() => handleCheckIn(appt.id)}
              isProcessing={processingId === appt.id}
            />
          ))}
          {scheduled.length === 0 && <EmptyState text={dictionary.dashboard?.receptionBoard?.empty || "Vazio"} />}
        </Column>

        {/* Column 2: Waiting Room */}
        <Column 
          title={dictionary.dashboard?.receptionBoard?.waiting || "Sala de Espera"} 
          count={waiting.length}
          color="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900"
          textColor="text-yellow-700 dark:text-yellow-400"
        >
          {waiting.map(appt => (
            <PatientCard 
              key={appt.id} 
              appt={appt} 
              dictionary={dictionary}
              // No action here, they wait for dentist to call
              showTimer
            />
          ))}
          {waiting.length === 0 && <EmptyState text={dictionary.dashboard?.receptionBoard?.empty || "Vazio"} />}
        </Column>

        {/* Column 3: In Service */}
        <Column 
          title={dictionary.dashboard?.receptionBoard?.inService || "Em Atendimento"} 
          count={inService.length}
          color="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900"
          textColor="text-green-700 dark:text-green-300"
        >
          {inService.map(appt => (
            <PatientCard 
              key={appt.id} 
              appt={appt} 
              dictionary={dictionary}
            />
          ))}
          {inService.length === 0 && <EmptyState text={dictionary.dashboard?.receptionBoard?.empty || "Vazio"} />}
        </Column>
        
      <PatientRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        dictionary={dictionary}
        onSuccess={() => {
            // If we want to chain, we can do it here
        }} 
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
            setIsAppointmentModalOpen(false);
            setPreSelectedPatient(undefined);
        }}
        onSuccess={() => {
            fetchAppointments();
            setPreSelectedPatient(undefined);
        }}
        preSelectedPatient={preSelectedPatient}
        dictionary={dictionary}
      />
      </div>
    </div>
  );
}

// Subcomponents

function Column({ title, count, children, color, textColor }: any) {
  return (
    <div className={`flex flex-col rounded-2xl border ${color} h-full overflow-hidden`}>
      <div className={`p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center ${textColor}`}>
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full text-sm font-bold shadow-sm">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {children}
      </div>
    </div>
  );
}

function PatientCard({ appt, dictionary, actionLabel, onAction, isProcessing, showTimer }: { 
    appt: Appointment, 
    dictionary: any, 
    actionLabel?: string, 
    onAction?: () => void,
    isProcessing?: boolean,
    showTimer?: boolean
}) {
  const timeStr = new Date(appt.dataHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Calculate wait time roughly
  const waitMinutes = showTimer ? Math.max(0, Math.floor((new Date().getTime() - new Date(appt.dataHoraInicio).getTime()) / 60000)) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {timeStr}
            </span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{dictionary.dashboard?.receptionBoard?.time || "Horário"}</span>
        </div>
        {showTimer && (
           <div className="text-right">
               <span className={`text-xl font-bold ${waitMinutes > 15 ? 'text-red-500' : 'text-yellow-600'}`}>
                 {waitMinutes}<span className="text-xs ml-0.5">{dictionary.dashboard?.receptionBoard?.min || "min"}</span>
               </span>
               <span className="block text-xs text-gray-400">{dictionary.dashboard?.receptionBoard?.wait || "espera"}</span>
           </div>
        )}
      </div>
      
      <div className="mb-3">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg leading-tight p-0.5">
          {appt.paciente?.nome || "Paciente Sem Nome"}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
           <span className="material-symbols-outlined text-[16px]">dentistry</span> 
           {dictionary.dashboard?.receptionBoard?.doctor || "Dr."} {appt.dentista?.usuario?.nome || appt.dentistaId}
        </p>
      </div>

      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          disabled={isProcessing}
          className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200 dark:shadow-none"
        >
          {isProcessing ? (
             <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
             <span className="material-symbols-outlined text-[18px]">check_circle</span>
          )}
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-32 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
      <span className="material-symbols-outlined text-3xl mb-1 opacity-50">event_busy</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
