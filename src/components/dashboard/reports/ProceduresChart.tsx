"use client";

import React from "react";

interface ProceduresChartProps {
  dict: any;
  clinicaId?: string;
  isRede?: boolean;
}

export default function ProceduresChart({ dict, clinicaId, isRede }: ProceduresChartProps) {
  const title = dict?.reports?.charts?.procedures || "Atendimentos por Procedimento";

  const procedures = [
    { label: "Ortodontia", value: 45, color: "bg-blue-500" },
    { label: "Implantes", value: 30, color: "bg-indigo-500" },
    { label: "Clínico Geral", value: 15, color: "bg-emerald-500" },
    { label: "Endodontia", value: 10, color: "bg-amber-500" },
  ];

  const total = procedures.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-500">pie_chart</span>
          {title}
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        {procedures.map((proc, index) => {
          const percentage = Math.round((proc.value / total) * 100);
          
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{proc.label}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                <div 
                  className={`${proc.color} h-3 rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
