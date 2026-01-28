"use client";

import { useEffect, useState } from "react";

export default function AttendanceFlow() {
  const [stats, setStats] = useState({
    waiting: 5,
    inService: 3,
    finished: 18
  });

  useEffect(() => {
    // Placeholder for API
    // const fetchFlow = async () => {
    //   const data = await api.admin.getStats();
    //   setStats(data.attendance);
    // };
    // fetchFlow();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
          <span className="material-symbols-outlined text-blue-400">stream</span> Fluxo de Atendimento Agora
        </h3>
        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs font-bold text-green-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Tempo Real
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waiting */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sala de Espera</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.waiting}</h4>
              <span className="text-xs text-gray-400 font-medium">pacientes</span>
            </div>
            <p className="text-[10px] text-yellow-500 font-bold mt-1">Tempo médio: 12 min</p>
          </div>
          <div className="size-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">chair</span>
          </div>
        </div>

        {/* In Service */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-400"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Em Atendimento</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.inService}</h4>
              <span className="text-xs text-gray-400 font-medium">dentistas ocupados</span>
            </div>
            <p className="text-[10px] text-blue-400 font-bold mt-1">Ocupação: 75%</p>
          </div>
          <div className="size-12 bg-blue-400/10 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">dentistry</span>
          </div>
        </div>

        {/* Finished */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-600"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Finalizados Hoje</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.finished}</h4>
              <span className="text-xs text-gray-400 font-medium">consultas</span>
            </div>
            <p className="text-[10px] text-green-600 font-bold mt-1">Meta: 80%</p>
          </div>
          <div className="size-12 bg-green-600/10 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
        </div>
      </div>
    </section>
  );
}
