"use client";

import { api } from "@/services/api";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AppEvent {
    id: number;
    title: string;
    type: string;
    status: string;
    resourceId: number;
    start: Date;
    end: Date;
    patientId?: number; // Might need to pass this if available
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: AppEvent | null;
  onUpdate: () => void;
  onReschedule: (event: AppEvent) => void;
}

export default function AppointmentDetailsModal({ isOpen, onClose, event, onUpdate, onReschedule }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !event) return null;

  const isCancelled = event.status?.toUpperCase() === 'CANCELADO' || event.status?.toLowerCase() === 'cancelled';

  const handleCancel = async () => {
      setLoading(true);
      try {
          await api.scheduling.updateStatus(String(event.id), { status: "CANCELADO" });
          onUpdate();
          onClose();
      } catch (error: any) {
          console.error("Failed to cancel appointment", error);
          alert("Erro ao cancelar o agendamento: " + (error.message || "Erro desconhecido"));
      } finally {
          setLoading(false);
      }
  };

  const handleRemove = async () => {
      setLoading(true);
      try {
          await api.scheduling.delete(String(event.id));
          onUpdate();
          onClose();
      } catch (error: any) {
          console.error("Failed to delete appointment", error);
          alert("Erro ao remover o agendamento: " + (error.message || "Erro desconhecido"));
      } finally {
          setLoading(false);
      }
  };

  const handleReschedule = () => {
      onReschedule(event);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Agendamento</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
                <span className="font-bold block text-gray-900 dark:text-gray-100">Paciente:</span>
                {event.title}
            </div>
            <div>
                <span className="font-bold block text-gray-900 dark:text-gray-100">Motivo/Tipo:</span>
                <span className="capitalize">{event.type}</span>
            </div>
            <div>
                <span className="font-bold block text-gray-900 dark:text-gray-100">Data e Hora:</span>
                {format(event.start, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })} - {format(event.end, "HH:mm")}
            </div>
            <div>
                <span className="font-bold block text-gray-900 dark:text-gray-100">Status:</span>
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${isCancelled ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                    {event.status || 'AGENDADO'}
                </span>
            </div>
            
            <div className="pt-4 flex flex-col gap-3">
                {/* Cancelar - Vermelho */}
                {!isCancelled && (
                    <button 
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg shadow disabled:opacity-50 transition-all"
                    >
                        Cancelar Agendamento
                    </button>
                )}

                {/* Remover da Agenda - Cinza/Marrom */}
                <button 
                    onClick={handleRemove}
                    disabled={!isCancelled || loading}
                    className={`w-full font-bold py-2 rounded-lg shadow transition-all text-white ${isCancelled ? 'bg-[#8B4513] hover:bg-[#A0522D]' : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
                >
                    Remover da agenda
                </button>

                {/* Retornar - Azul ou cor padrão */}
                <button 
                    onClick={handleReschedule}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow disabled:opacity-50 transition-all"
                >
                    Retornar (Reagendar)
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
