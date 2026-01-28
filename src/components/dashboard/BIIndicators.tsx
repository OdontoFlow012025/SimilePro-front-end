"use client";

export default function BIIndicators() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6">
      <h3 className="text-lg font-bold dark:text-white">Indicadores BI</h3>
      
      {/* Ocupação */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="size-12 rounded-full border-4 border-blue-500 border-r-transparent flex items-center justify-center font-bold text-sm dark:text-white">
          82%
        </div>
        <div>
          <p className="text-sm font-bold dark:text-white">Ocupação das Salas</p>
          <p className="text-xs text-gray-500">+5% vs mês anterior</p>
        </div>
      </div>

      {/* Novos Pacientes */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="size-12 rounded-full border-4 border-green-600 flex items-center justify-center font-bold text-sm dark:text-white">
          48
        </div>
        <div>
          <p className="text-sm font-bold dark:text-white">Novos Pacientes</p>
          <p className="text-xs text-gray-500">Mês de Outubro</p>
        </div>
      </div>
    </div>
  );
}
