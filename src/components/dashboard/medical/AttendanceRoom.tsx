"use client";

import { Appointment } from "@/schemas/reception";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Odontogram from "./Odontogram";

interface Props {
  dictionary: any;
  appointmentId: string;
  locale: string;
}

export default function AttendanceRoom({ dictionary, appointmentId, locale }: Props) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'odontogram' | 'evolution'>('odontogram');
  const [evolution, setEvolution] = useState("");

  useEffect(() => {
    const load = async () => {
        try {
            const data = await api.scheduling.getById(appointmentId);
            setAppointment(data);
        } catch (e) {
            console.error(e);
            alert(dictionary.dashboard?.medical?.attendanceRoom?.errorLoad || "Erro ao carregar atendimento");
            router.back();
        } finally {
            setLoading(false);
        }
    };
    load();
  }, [appointmentId, router]);

  const handleFinish = async () => {
    const confirmMsg = dictionary.dashboard?.medical?.attendanceRoom?.confirmFinish || (locale === "pt-BR" ? "Deseja finalizar este atendimento?" : "Finish this attendance?");
    if (!confirm(confirmMsg)) return;
    
    try {
        const evolutionHeader = dictionary.dashboard?.medical?.attendanceRoom?.evolutionNote?.header || "[EVOLUÇÃO]";
        await api.scheduling.update(appointmentId, {
            status: "ATENDIDO",
            motivoConsulta: (appointment?.motivoConsulta || "") + `\n\n${evolutionHeader}\n` + evolution
        });
        alert(dictionary.dashboard?.medical?.attendanceRoom?.successFinish || "Atendimento finalizado com sucesso!");
        router.push(`/${locale}/atendimento`);
    } catch (e) {
        console.error(e);
        alert(dictionary.dashboard?.medical?.attendanceRoom?.errorFinish || "Erro ao finalizar atendimento");
    }
  };

  if (loading) return <div className="p-8 text-center">{dictionary.dashboard?.medical?.attendanceRoom?.loading || "Carregando paciente..."}</div>;
  if (!appointment) return <div className="p-8 text-center">{dictionary.dashboard?.medical?.attendanceRoom?.notFound || "Paciente não encontrado."}</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
        {/* Top Bar: Patient Info */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                    {appointment.paciente?.nome?.charAt(0)}
                </div>
                <div>
                    <h1 className="font-bold text-gray-900 dark:text-white leading-tight">
                        {appointment.paciente?.nome}
                    </h1>
                    <p className="text-xs text-gray-500">
                        {dictionary.dashboard?.medical?.patient || "Paciente"} • {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 font-medium"
                >
                    {dictionary.common?.cancel || "Voltar"}
                </button>
                <button 
                    onClick={handleFinish}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">check_circle</span>
                    {dictionary.dashboard?.medical?.finishBtn || "Finalizar Atendimento"}
                </button>
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('odontogram')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'odontogram' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined">dentistry</span>
                        {dictionary.dashboard?.medical?.odontogram?.title || "Odontograma"}
                    </button>
                    <button 
                         onClick={() => setActiveTab('evolution')}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'evolution' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined">edit_note</span>
                        {dictionary.dashboard?.medical?.attendanceRoom?.notes || "Evolução / Notas"}
                    </button>
                </nav>
                
                {/* Triage Summary Mini-View */}
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-900/30">
                    <h4 className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">health_metrics</span> {dictionary.dashboard?.medical?.attendanceRoom?.triageTitle || "Triagem"}
                    </h4>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans">
                        {appointment.motivoConsulta?.split('[TRIAGEM_REALIZADA]')[0] || (dictionary.dashboard?.medical?.attendanceRoom?.noTriageData || "Sem dados de triagem.")}
                    </pre>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
                {activeTab === 'odontogram' && (
                    <div className="h-full flex flex-col">
                         <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{dictionary.dashboard?.medical?.attendanceRoom?.diagnostics || "Diagnóstico e Procedimentos"}</h2>
                         <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-8 flex items-center justify-center relative overflow-hidden">
                             <Odontogram dictionary={dictionary} />
                         </div>
                    </div>
                )}

                {activeTab === 'evolution' && (
                    <div className="h-full flex flex-col max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{dictionary.dashboard?.medical?.attendanceRoom?.notes || "Evolução Clínica"}</h2>
                        <textarea 
                            className="flex-1 w-full p-6 text-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 ring-emerald-500 outline-none resize-none leading-relaxed"
                            placeholder={dictionary.dashboard?.medical?.attendanceRoom?.notesPlaceholder || "Descreva o procedimento realizado..."}
                            value={evolution}
                            onChange={e => setEvolution(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
