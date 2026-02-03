"use client";

import { enUS, es, ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { Calendar, View, Views, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-custom.css';

import { format, getDay, parse, startOfWeek } from 'date-fns';
import CustomToolbar from './CustomToolbar';
import { EVENTS, RESOURCES } from './mockData';

const locales = {
  'en': enUS,
  'pt-BR': ptBR,
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarWrapperProps {
    locale: string;
    dictionary: any;
}

const EventComponent = ({ event }: any) => {
    let bgColor = 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500';
    let textColor = 'text-blue-700 dark:text-blue-200';

    if (event.status === 'cancelled') {
        bgColor = 'bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500';
        textColor = 'text-red-700 dark:text-red-200';
    } else if (event.type === 'checkup') {
        bgColor = 'bg-orange-100 dark:bg-orange-900/40 border-l-4 border-orange-500';
        textColor = 'text-orange-700 dark:text-orange-200';
    } else if (event.type === 'cleaning') {
        bgColor = 'bg-teal-100 dark:bg-teal-900/40 border-l-4 border-teal-500';
        textColor = 'text-teal-700 dark:text-teal-200';
    } else if (event.type === 'ortho') {
        bgColor = 'bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500';
        textColor = 'text-purple-700 dark:text-purple-200';
    }

    return (
        <div className={`h-full w-full p-1 text-xs font-semibold rounded-md ${bgColor} ${textColor} overflow-hidden`}>
            <div>{event.title}</div>
            <div className="opacity-75 font-normal capitalize">{event.type}</div>
            {event.status === 'cancelled' && <div className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">Cancelado</div>}
        </div>
    );
};

const ResourceHeader = ({ label }: { label: React.ReactNode }) => {
    return (
        <div className="text-center py-2">
            <span className="font-bold text-gray-700 dark:text-gray-200">{label}</span>
        </div>
    );
};


export default function CalendarWrapper({ locale, dictionary }: CalendarWrapperProps) {
  const [view, setView] = useState<View>(Views.DAY);
  const [date, setDate] = useState(new Date());

  const culture = locale;

  // Map dictionary keys to React-Big-Calendar messages
  const messages = {
    today: dictionary?.dashboard?.calendar?.today || "Hoje",
    previous: dictionary?.dashboard?.calendar?.previous || "Anterior",
    next: dictionary?.dashboard?.calendar?.next || "Próximo",
    month: dictionary?.dashboard?.calendar?.month || "Mês",
    week: dictionary?.dashboard?.calendar?.week || "Semana",
    day: dictionary?.dashboard?.calendar?.day || "Dia",
    agenda: dictionary?.dashboard?.calendar?.agenda || "Agenda",
    date: dictionary?.dashboard?.calendar?.date || "Data",
    time: dictionary?.dashboard?.calendar?.time || "Hora",
    event: dictionary?.dashboard?.calendar?.event || "Evento",
    noEventsInRange: dictionary?.dashboard?.calendar?.noEventsInRange || "Não há eventos neste período.",
    work_week: dictionary?.dashboard?.calendar?.work_week || "Semana de trabalho",
    showMore: (total: number) => dictionary?.dashboard?.calendar?.showMore?.replace('{total}', total.toString()) || `+${total} mais`,
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 overflow-hidden flex flex-col">
      <Calendar
        localizer={localizer}
        events={EVENTS}
        defaultView={Views.DAY}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        step={30}
        showMultiDayTimes
        date={date}
        onNavigate={setDate}
        onView={setView as any}
        view={view}
        culture={culture}
        messages={messages}
        
        resources={view === Views.DAY ? RESOURCES : undefined}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
        
        components={{
            event: EventComponent,
            toolbar: CustomToolbar as any,
        }}
        
        className="flex-1"
      />
    </div>
  );
}
