"use client";


interface ToolbarProps {
  onNavigate: (action: any) => void;
  onView: (view: any) => void;
  date: Date;
  view: string;
  label: string;
  localizer: any; // react-big-calendar localizer
}

export default function CustomToolbar({ onNavigate, onView, date, view, label, localizer }: ToolbarProps) {
  const { messages } = localizer;

  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToToday = () => {
    onNavigate('TODAY');
  };

  const setDayView = () => {
    onView('day');
  };

  const setWeekView = () => {
    onView('week');
  };

  const setMonthView = () => {
    onView('month');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
      {/* View Switcher - Toggle style */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={setDayView}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            view === 'day' 
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {messages.day || "Dia"}
        </button>
        <button
          onClick={setWeekView}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            view === 'week' 
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {messages.week || "Semana"}
        </button>
        <button
          onClick={setMonthView}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            view === 'month' 
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {messages.month || "Mês"}
        </button>
      </div>

      {/* Today Button */}
       <button
          onClick={goToToday}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
        >
          {messages.today || "Hoje"}
        </button>
    </div>
  );
}
