"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

interface RevenueChartProps {
  dict: any;
  clinicaId?: string;
  isRede?: boolean;
}

export default function RevenueChart({ dict, clinicaId, isRede }: RevenueChartProps) {
  const title = dict?.reports?.charts?.revenue || "Evolução de Receita";
  const [filter, setFilter] = useState("6m");
  const [chartData, setChartData] = useState<any[]>([{ label: "Carregando", value: 0 }, { label: "...", value: 0 }]);

  useEffect(() => {
    let queryPeriod = "SEMESTRE";
    switch(filter) {
      case "1d": queryPeriod = "HOJE"; break;
      case "1w": queryPeriod = "7DIAS"; break;
      case "1m": queryPeriod = "30DIAS"; break;
      case "3m": queryPeriod = "TRIMESTRE"; break;
      case "6m": queryPeriod = "SEMESTRE"; break;
      case "1y": queryPeriod = "ANO"; break;
    }

    const queryParams = new URLSearchParams();
    queryParams.append("periodo", queryPeriod);
    if (isRede) queryParams.append("rede", "true");
    if (clinicaId) queryParams.append("clinica_id", clinicaId);

    api.accounting.getCashFlow(queryParams.toString())
      .then(data => {
        if (data?.fluxo && Array.isArray(data.fluxo) && data.fluxo.length > 0) {
          // Group data if there are too many points
          const maxPoints = 30; // Max points we want to display on X axis
          let finalData = [];
          
          if (data.fluxo.length > maxPoints) {
            const chunkSize = Math.ceil(data.fluxo.length / maxPoints);
            for (let i = 0; i < data.fluxo.length; i += chunkSize) {
              const chunk = data.fluxo.slice(i, i + chunkSize);
              const sum = chunk.reduce((acc: number, curr: any) => acc + curr.entradas, 0);
              
              // Use the date of the last item in the chunk as the label
              const lastItem = chunk[chunk.length - 1];
              const dateParts = lastItem.data.split('-');
              const label = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : lastItem.data;
              
              finalData.push({
                label: label,
                value: sum
              });
            }
          } else {
             finalData = data.fluxo.map((d: any) => {
              const dateParts = d.data.split('-');
              const label = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : d.data;
              return {
                label: label,
                value: d.entradas
              };
            });
          }

          if (finalData.length === 1) {
            finalData.push({...finalData[0], label: "Agora"});
          }
          
          setChartData(finalData);
        } else {
           setChartData([{label: "Sem dados", value: 0}, {label: "", value: 0}]);
        }
      })
      .catch(err => {
         console.error(err);
         setChartData([{label: "Erro", value: 0}, {label: "", value: 0}]);
      });
  }, [filter, clinicaId, isRede]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">analytics</span>
          {title}
        </h3>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs font-medium bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
        >
          <option value="1d">{dict?.reports?.filters?.oneDay || "1 Dia"}</option>
          <option value="1w">{dict?.reports?.filters?.oneWeek || "1 Semana"}</option>
          <option value="1m">{dict?.reports?.filters?.oneMonth || "1 Mês"}</option>
          <option value="3m">{dict?.reports?.filters?.oneQuarter || "1 Trimestre"}</option>
          <option value="6m">6 Meses</option>
          <option value="1y">1 Ano</option>
        </select>
      </div>

      <div className="relative flex-1 mt-4 min-h-[250px] w-full">
        {(() => {
          const dataMax = Math.max(...chartData.map(d => d.value), 0);
          // Adiciona 20% de margem no topo para o gráfico não achatar com 0. Se for zero, usa 100 como base visual plana.
          const maxVal = dataMax > 0 ? dataMax * 1.2 : 100;
          const width = 800;
          const height = 250;
          const paddingX = 40;
          const chartHeight = 200;

          const getX = (index: number) => paddingX + (index * ((width - paddingX * 2) / (chartData.length - 1)));
          const getY = (val: number) => chartHeight - ((val / maxVal) * chartHeight);

          // Path approximation
          let pathD = `M ${getX(0)} ${getY(chartData[0].value)}`;
          for (let i = 0; i < chartData.length - 1; i++) {
            const x0 = getX(i);
            const y0 = getY(chartData[i].value);
            const x1 = getX(i + 1);
            const y1 = getY(chartData[i + 1].value);

            if (chartData.length > 30) {
              // Straight lines for dense data to avoid messy bezier overlaps
              pathD += ` L ${x1} ${y1}`;
            } else {
              // Smooth bezier curves for sparse data
              const cp1x = x0 + (x1 - x0) * 0.5;
              const cp2x = x1 - (x1 - x0) * 0.5;
              pathD += ` C ${cp1x} ${y0}, ${cp2x} ${y1}, ${x1} ${y1}`;
            }
          }

          const areaD = `${pathD} L ${getX(chartData.length - 1)} ${chartHeight} L ${getX(0)} ${chartHeight} Z`;

          return (
            <div className="absolute inset-0 w-full h-full"> 
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                   <line key={i} x1={paddingX} y1={chartHeight * pct} x2={width - paddingX} y2={chartHeight * pct} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-gray-800" />
                ))}

                {/* Area & Line */}
                <path d={areaD} fill="url(#gradRev)" className="transition-all duration-500" />
                <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="4" className="transition-all duration-500" strokeLinecap="round" />

                {/* Data Points */}
                {chartData.map((d, i) => {
                  // If dataset is > 10 items, only show ~10 evenly spaced labels/points to prevent overlapping
                  const step = Math.ceil(chartData.length / 10);
                  const showPoint = chartData.length <= 10 || i % step === 0 || i === chartData.length - 1;
                  
                  return (
                    <g key={i}>
                      {/* Circle Tooltip Target */}
                      {showPoint && (
                        <circle cx={getX(i)} cy={getY(d.value)} r={chartData.length > 30 ? "4" : "6"} fill="#3B82F6" className="stroke-white dark:stroke-gray-900 stroke-[3px]" />
                      )}
                      
                      {/* X Axis Label */}
                      {showPoint && (
                        <text x={getX(i)} y={height - 20} textAnchor="middle" className="text-[12px] fill-gray-400 font-medium">
                          {d.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
