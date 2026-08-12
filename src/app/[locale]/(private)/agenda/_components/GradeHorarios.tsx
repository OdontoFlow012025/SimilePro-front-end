'use client';

import { AgendamentoViewDTO } from '@/types/agendamento';

interface GradeHorariosProps {
  agendamentos: AgendamentoViewDTO[];
  selectedProfessionalId: number | null;
}

export default function GradeHorarios({ agendamentos, selectedProfessionalId }: GradeHorariosProps) {
  // Filtro client-side em tempo real cruzado com o ID do profissional
  const filteredAgendamentos = selectedProfessionalId 
    ? agendamentos.filter(a => a.profissionalId === selectedProfessionalId)
    : agendamentos;

  // Horários de funcionamento fixos para a grade visual (08:00 às 18:00)
  const timeSlots = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO': return 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-200';
      case 'PENDENTE': return 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-200';
      case 'CANCELADO': return 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-200';
      default: return 'bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO': return 'text-blue-500';
      case 'PENDENTE': return 'text-amber-500';
      case 'CANCELADO': return 'text-rose-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex-1 overflow-x-auto bg-white dark:bg-gray-800">
      <div className="min-w-[600px] h-full flex flex-col">
        {/* Cabeçalho da Grade */}
        <div className="flex border-b border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 z-10">
          <div className="w-20 shrink-0 border-r border-gray-100 dark:border-gray-700/80"></div>
          <div className="flex-1 px-4 py-3 text-center">
            <span className="text-sm font-bold text-gray-900 dark:text-white">HOJE</span>
            {selectedProfessionalId && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-md">
                Filtro Ativo
              </span>
            )}
          </div>
        </div>

        {/* Linhas de Horário */}
        <div className="relative flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxIiBmaWxsPSIjMzc0MTUxIi8+PC9zdmc+')] bg-repeat-y" style={{ backgroundSize: '100% 80px' }}>
          
          <div className="absolute inset-0 flex flex-col pointer-events-none">
            {timeSlots.map((time, idx) => (
              <div key={idx} className="h-[80px] flex items-start -mt-3">
                <span className="w-20 text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                  {time}
                </span>
              </div>
            ))}
          </div>

          <div className="relative ml-20 h-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgendamentos.length === 0 ? (
               <div className="col-span-full py-10 text-center flex flex-col items-center justify-center h-[300px]">
                 <p className="text-gray-500 dark:text-gray-400">Nenhum paciente agendado para este filtro.</p>
               </div>
            ) : (
              filteredAgendamentos.map((agendamento) => (
                <div 
                  key={agendamento.id} 
                  className={`relative p-3 rounded-xl border border-l-4 h-24 shadow-sm hover:shadow-md transition-shadow ${getStatusColor(agendamento.status)} cursor-pointer`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold truncate max-w-[150px]">{agendamento.pacienteNome}</h4>
                      <p className="text-xs font-medium opacity-80 mt-0.5">{agendamento.horarioInicio} - {agendamento.horarioFim}</p>
                    </div>
                    <svg className={`w-4 h-4 ${getStatusIconColor(agendamento.status)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="mt-2 text-xs font-medium opacity-90 truncate">
                    {agendamento.tipoProcedimento}
                  </div>
                  {!selectedProfessionalId && (
                     <div className="absolute bottom-2 right-3 text-[10px] font-bold uppercase tracking-wider opacity-60">
                       {agendamento.dentistaNome}
                     </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
