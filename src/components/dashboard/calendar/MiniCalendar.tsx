"use client";

import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { enUS, es, ptBR } from "date-fns/locale";
import { useState } from "react";

const localeMap: Record<string, any> = {
  "pt-BR": ptBR,
  "en": enUS,
  "es": es
};

export default function MiniCalendar({ locale = "pt-BR" }: { locale?: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateFnsLocale = localeMap[locale] || ptBR;

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Week days based on locale
  const weekDays = locale === 'en' 
    ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] 
    : locale === 'es'
    ? ['D', 'L', 'M', 'M', 'J', 'V', 'S']
    : ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: dateFnsLocale })}
        </span>
        <button onClick={nextMonth} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, idx) => (
          <div key={idx} className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);
          
          return (
            <div 
                key={idx} 
                className={`
                    w-full aspect-square flex items-center justify-center text-xs rounded-full cursor-pointer
                    ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}
                    ${isDayToday ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
