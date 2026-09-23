'use client';

import { useState } from 'react';
import { AgendamentoViewDTO } from '@/types/agendamento';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendario-custom.css'; // Opcional, se quisermos estilizar mais depois

interface GradeHorariosProps {
  agendamentos: AgendamentoViewDTO[];
  selectedProfessionalId: number | null;
  currentDateStr: string;
  onNavigate: (newDate: Date) => void;
}

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function GradeHorarios({ agendamentos, selectedProfessionalId, currentDateStr, onNavigate }: GradeHorariosProps) {
  const [view, setView] = useState<View>(Views.DAY);
  
  // Converte YYYY-MM-DD para um Date válido no timezone local
  const parts = currentDateStr.split('-');
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

  // Filtro client-side em tempo real cruzado com o ID do profissional
  const filteredAgendamentos = selectedProfessionalId 
    ? agendamentos.filter(a => a.profissionalId === selectedProfessionalId)
    : agendamentos;

  // Formatando para o Calendar
  const events = filteredAgendamentos.map(a => ({
    ...a,
    title: `${a.pacienteNome} - ${a.tipoProcedimento}`,
  }));

  const eventPropGetter = (event: AgendamentoViewDTO) => {
    let backgroundColor = '#f3f4f6'; // gray-100
    let color = '#111827'; // gray-900
    let borderColor = '#d1d5db'; // gray-300

    switch (event.status) {
      case 'CONFIRMADO': 
        backgroundColor = '#eff6ff'; // blue-50
        borderColor = '#bfdbfe'; // blue-200
        color = '#1e3a8a'; // blue-900
        break;
      case 'PENDENTE': 
        backgroundColor = '#fffbeb'; // amber-50
        borderColor = '#fde68a'; // amber-200
        color = '#78350f'; // amber-900
        break;
      case 'CANCELADO': 
        backgroundColor = '#fff1f2'; // rose-50
        borderColor = '#fecdd3'; // rose-200
        color = '#881337'; // rose-900
        break;
    }

    return {
      style: {
        backgroundColor,
        color,
        borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '2px 4px',
      }
    };
  };

  const messages = {
    allDay: 'Dia todo',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Nenhum paciente agendado para este período.',
    showMore: (total: number) => `+ mais ${total}`
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 p-4 overflow-auto">
      <div className="min-w-[700px] h-full" style={{ minHeight: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={(v) => setView(v)}
          date={date}
          onNavigate={onNavigate}
          eventPropGetter={eventPropGetter}
          messages={messages}
          culture="pt-BR"
          min={new Date(0, 0, 0, 8, 0, 0)} // Começa às 08:00
          max={new Date(0, 0, 0, 19, 0, 0)} // Termina às 19:00
          step={15}
          timeslots={4}
        />
      </div>
    </div>
  );
}
