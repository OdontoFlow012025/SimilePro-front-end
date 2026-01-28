"use client";

export default function CashFlowChart() {
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
  // Placeholder data - values are percentages of max height
  const data = [
    { income: 60, expense: 30 },
    { income: 75, expense: 40 },
    { income: 45, expense: 20 },
    { income: 80, expense: 50 },
    { income: 90, expense: 35 },
    { income: 20, expense: 10 },
    { income: 15, expense: 5 },
  ];

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold dark:text-white">Fluxo de Caixa (7 dias)</h3>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <span className="size-2 bg-blue-500 rounded-full"></span> Receitas
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <span className="size-2 bg-red-500 rounded-full"></span> Despesas
          </span>
        </div>
      </div>
      
      <div className="h-64 relative flex items-end justify-between gap-4">
        {data.map((day, index) => (
          <div key={days[index]} className={`flex-1 flex flex-col justify-end items-center gap-1 ${index >= 5 ? 'opacity-50' : ''}`}>
             
             {/* Bars */}
             <div className="w-full bg-red-500/20 rounded-t" style={{ height: `${day.expense}%` }}></div>
             <div className="w-full bg-blue-500 rounded-t" style={{ height: `${day.income}%` }}></div>
             
             <span className="text-[10px] font-bold text-gray-400 mt-2">{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
