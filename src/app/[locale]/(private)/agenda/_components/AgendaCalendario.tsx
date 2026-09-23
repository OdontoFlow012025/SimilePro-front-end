'use client';

import { useState, ChangeEvent, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AgendamentoViewDTO, AgendamentoRaw, StatusAgendamento } from '@/types/agendamento';
import { api } from '@/services/api';
import SidebarProfissionais from './SidebarProfissionais';
import GradeHorarios from './GradeHorarios';

interface AgendaCalendarioProps {
  dataSelecionada: string;
}

// Função Estrita de Sanitização e Mapeamento (View DTO)
function toAgendamentoViewDTO(raw: AgendamentoRaw): AgendamentoViewDTO {
  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--:--';
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    }).format(date);
  };

  return {
    id: raw.uuid || raw.id_interno_db?.toString() || (raw as any).id?.toString() || Math.random().toString(),
    profissionalId: raw.dentista_id || (raw as any).dentistaId || 0,
    profissionalEspecialidade: (raw as any).especialidade || (raw as any).dentista?.especialidade || 'Dentista',
    pacienteNome: raw.paciente_nome_completo || (raw as any).pacienteNome || (raw as any).paciente?.nome || 'Paciente',
    dentistaNome: raw.dentista_nome || (raw as any).dentistaNome || (raw as any).dentista?.nome || 'Dentista',
    horarioInicio: formatTime(raw.data_hora_inicio || (raw as any).dataHoraInicio),
    horarioFim: formatTime(raw.data_hora_fim || (raw as any).dataHoraFim),
    start: (raw.data_hora_inicio || (raw as any).dataHoraInicio) ? new Date(raw.data_hora_inicio || (raw as any).dataHoraInicio) : new Date(),
    end: (raw.data_hora_fim || (raw as any).dataHoraFim) ? new Date(raw.data_hora_fim || (raw as any).dataHoraFim) : new Date(),
    tipoProcedimento: raw.procedimento_descricao || (raw as any).motivoConsulta || (raw as any).procedimento?.nome || 'Procedimento',
    status: (raw.status_agendamento || (raw as any).status) as StatusAgendamento || 'PENDENTE',
  };
}

export default function AgendaCalendario({ dataSelecionada }: AgendaCalendarioProps) {
  const router = useRouter();
  
  // Estado Reativo: Guarda o ID do profissional selecionado para cruzar com a grade
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
  const [agendamentos, setAgendamentos] = useState<AgendamentoViewDTO[]>([]);
  const [todosDentistas, setTodosDentistas] = useState<{ id: number; nome: string; especialidade: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [agendamentosRes, dentistasRes] = await Promise.all([
          api.scheduling.list(`data=${dataSelecionada}`).catch((e) => { console.error('[Agenda] Agendamentos erro:', e); return []; }),
          api.dentists.getAgendaProfessionals().catch((e) => {
            console.warn('[Agenda] getAgendaProfessionals falhou, tentando fallback...');
            return api.dentists.list().catch((err) => { console.error('[Agenda] Dentistas fallback erro:', err); return []; });
          })
        ]);

        if (!isMounted) return;

        let agendamentosView: AgendamentoViewDTO[] = [];
        try {
          const rawArray = Array.isArray(agendamentosRes) ? agendamentosRes : [];
          // O backend GO retorna todo o banco (34k registros) pois /agendamentos não filtra.
          // O backend GO retorna todo o banco (34k registros) pois /agendamentos não filtra.
          // Filtramos client-side pelo MÊS da dataSelecionada para permitir visualização de Semana e Mês.
          const currentMonthPrefix = dataSelecionada.substring(0, 7);
          agendamentosView = rawArray
             .filter((raw: any) => {
                const startStr = raw.data_hora_inicio || raw.dataHoraInicio;
                if (!startStr) return false;
                return startStr.startsWith(currentMonthPrefix);
             })
             .map(toAgendamentoViewDTO);
        } catch (e) {
          console.error('[Agenda] Erro ao parsear agendamentos:', e);
        }
        setAgendamentos(agendamentosView);

        let dentistas: { id: number; nome: string; especialidade: string; }[] = [];
        try {
          dentistas = (Array.isArray(dentistasRes) ? dentistasRes : []).map(d => ({
            id: d.id || d.id_interno_db || 0,
            nome: d.nome || d.usuario?.nome || d.nome_completo || 'Sem Nome',
            especialidade: d.especialidade || 'Dentista'
          }));
        } catch (e) {
          console.error('[Agenda] Erro ao parsear dentistas:', e);
        }
        setTodosDentistas(dentistas);

      } catch (err) {
        console.error('[Agenda] Erro crítico no fetch:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [dataSelecionada]);
  
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      // Quando a data muda, limpamos o filtro de profissional pois o dia mudou
      setSelectedProfessionalId(null);
      router.push(`/agenda?data=${newDate}`);
    }
  };

  // Deriva dinamicamente a lista de profissionais únicos presentes nos agendamentos do dia
  const profissionais = useMemo(() => {
    const map = new Map<number, { id: number; nome: string; especialidade: string }>();
    
    agendamentos.forEach(a => {
      if (!map.has(a.profissionalId)) {
        map.set(a.profissionalId, {
          id: a.profissionalId,
          nome: a.dentistaNome,
          especialidade: a.profissionalEspecialidade
        });
      }
    });
    
    return Array.from(map.values()).sort((a, b) => a.nome.localeCompare(b.nome));
  }, [agendamentos]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[800px]">
      
      {/* Controles do Cabeçalho - Date Picker Responsivo */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/80">
        <div className="flex items-center gap-3">
          <label htmlFor="date-picker" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Data Visível:
          </label>
          <div className="relative">
            <input
              id="date-picker"
              type="date"
              value={dataSelecionada}
              onChange={handleDateChange}
              className="block rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 outline-none transition-colors appearance-none min-w-[150px] font-medium"
            />
          </div>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
            {agendamentos.length} Pacientes
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
            {profissionais.length} Profissionais
          </span>
        </div>
      </div>

      {/* Container Principal: Layout Flex com 2 Colunas */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          
          {/* Coluna 1: Sidebar Dinâmica */}
          <SidebarProfissionais 
            profissionais={profissionais}
            todosDentistas={todosDentistas}
            selectedProfessionalId={selectedProfessionalId}
            onSelectProfessional={setSelectedProfessionalId}
          />

          {/* Coluna 2: Grade de Horários com Filtro Cruzado (Usando React Big Calendar) */}
          <GradeHorarios 
            agendamentos={agendamentos}
            selectedProfessionalId={selectedProfessionalId}
            currentDateStr={dataSelecionada}
            onNavigate={(newDate) => {
              const yyyy = newDate.getFullYear();
              const mm = String(newDate.getMonth() + 1).padStart(2, '0');
              const dd = String(newDate.getDate()).padStart(2, '0');
              const newDateStr = `${yyyy}-${mm}-${dd}`;
              setSelectedProfessionalId(null);
              router.push(`/agenda?data=${newDateStr}`);
            }}
          />

        </div>
      )}
    </div>
  );
}
