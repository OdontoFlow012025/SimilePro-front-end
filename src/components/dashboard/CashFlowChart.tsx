"use client";

import { api } from "@/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CashFlowChart({ dictionary }: { dictionary: any }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'pt-BR';
  const [chartData, setChartData] = useState<{label: string, income: number, expense: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('7d');

  useEffect(() => {
    const fetchChartData = async () => {
        try {
            // Map filter to backend 'periodo' parameter
            const periodMap: Record<string, string> = {
                'today': 'HOJE',
                '7d': '7DIAS',
                '1m': '30DIAS',
                '3m': 'TRIMESTRE',
                '6m': 'SEMESTRE',
                '1y': 'ANO',
                'all': 'TOTAL'
            };
            
            const period = periodMap[filter] || '7DIAS';
            const query = new URLSearchParams({ periodo: period }).toString();

            const result = await api.accounting.getCashFlow(query);
            
            // Minimal critical logging
            if (!result || !Array.isArray(result.fluxo)) {
                console.error("CashFlow data invalid:", result);
            }
            
            // Helper to get local date string YYYY-MM-DD
            const toLocalKey = (d: Date) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            // Determine aggregation level
            let grouping: 'day' | 'week' | 'month' | 'year' = 'day';
            if (['1m', '3m'].includes(filter)) grouping = 'week';
            if (['6m', '1y'].includes(filter)) grouping = 'month';
            if (filter === 'all') grouping = 'year';

            const getGroupKey = (date: Date): string => {
                if (grouping === 'year') return date.getFullYear().toString();
                if (grouping === 'month') {
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    return `${date.getFullYear()}-${month}`;
                }
                if (grouping === 'week') {
                    const d = new Date(date);
                    const day = d.getDay();
                    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
                    const monday = new Date(d.setDate(diff));
                    return toLocalKey(monday);
                }
                return toLocalKey(date);
            };

            const getGroupLabel = (key: string): string => {
               if (grouping === 'year') return key; 
               if (grouping === 'month') {
                   const [y, m] = key.split('-').map(Number);
                   const date = new Date(y, m - 1, 1);
                   const monthName = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date).replace('.', '');
                   return `${monthName}/${y.toString().slice(2)}`;
               }
               
               const [y, m, d] = key.split('-').map(Number);
               const date = new Date(y, m - 1, d);
               
               if (grouping === 'week') {
                   const dayStr = String(date.getDate()).padStart(2, '0');
                   const monthStr = String(date.getMonth() + 1).padStart(2, '0');
                   return `${dayStr}/${monthStr}`;
               }
               
               const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date).toLowerCase().replace('.', '');
               const dayStr = String(date.getDate()).padStart(2, '0');
               const monthStr = String(date.getMonth() + 1).padStart(2, '0');
               return `${weekday.slice(0,3).toUpperCase()} ${dayStr}/${monthStr}`;
            };

            // Calculate Date Range Explicitly for X-Axis from Frontend Filter
            // This ensures scale is always present even if data is 0
            let bucketEnd = new Date();
            let bucketStart = new Date(); // Default to today
            bucketEnd.setHours(23, 59, 59, 999);

            switch (filter) {
                case 'today':
                    bucketStart.setHours(0,0,0,0);
                    break;
                case '7d':
                    bucketStart.setDate(bucketEnd.getDate() - 6);
                    break;
                case '1m':
                    bucketStart.setMonth(bucketEnd.getMonth() - 1);
                    break;
                case '3m':
                    bucketStart.setMonth(bucketEnd.getMonth() - 3);
                    break;
                case '6m':
                    bucketStart.setMonth(bucketEnd.getMonth() - 6);
                    break;
                case '1y':
                    bucketStart.setFullYear(bucketEnd.getFullYear() - 1);
                    break;
                case 'all':
                    // Try to infer start date, fallback to Jan 1st
                    if (result && Array.isArray(result.fluxo) && result.fluxo.length > 0) {
                         const dates = result.fluxo.map((i: any) => {
                             const dStr = i.data || i.date;
                             if (!dStr) return new Date().getTime();
                             const [y, m, d] = dStr.split('T')[0].split('-').map(Number);
                             return new Date(y, m - 1, d).getTime();
                         });
                         bucketStart = new Date(Math.min(...dates));
                    } else {
                         bucketStart = new Date(new Date().getFullYear(), 0, 1); 
                    }
                    break;
            }
            bucketStart.setHours(0,0,0,0);

            // Initialize buckets map to 0
            const buckets = new Map<string, { income: number, expense: number, label: string }>();
            
            const current = new Date(bucketStart);
            let safetyCount = 0;
            const maxIterations = 366 * 10; 

            while (current <= bucketEnd && safetyCount < maxIterations) {
                const key = getGroupKey(current);
                if (!buckets.has(key)) {
                    buckets.set(key, { 
                        income: 0, 
                        expense: 0, 
                        label: getGroupLabel(key) 
                    });
                }
                current.setDate(current.getDate() + 1);
                safetyCount++;
            }

            // Helper to parse currency (string, number, PT-BR format)
            const parseMoney = (val: any): number => {
                if (typeof val === 'number') return val;
                if (!val) return 0;
                if (typeof val === 'string') {
                    // Remove R$ and spaces
                    let clean = val.replace(/[R$\s]/g, '');
                    // Check if it's PT-BR (1.000,00) or US (1,000.00)
                    if (clean.includes(',') && clean.includes('.')) {
                        // Assume last separator is decimal
                        if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
                             // PT-BR: 1.250,50 -> 1250.50
                             clean = clean.replace(/\./g, '').replace(',', '.');
                        } else {
                             // US: 1,250.50 -> 1250.50
                             clean = clean.replace(/,/g, '');
                        }
                    } else if (clean.includes(',')) {
                        // Assuming , is decimal (PT-BR common)
                         clean = clean.replace(',', '.');
                    }
                    return parseFloat(clean) || 0;
                }
                return 0;
            };

            // Fill with API data
            if (result && Array.isArray(result.fluxo) && result.fluxo.length > 0) {
                // Dynamic Key Discovery
                const sample = result.fluxo[0];
                const keys = Object.keys(sample);
                
                const incomeKey = keys.find(k => /entra|receit|credit|incom/i.test(k)) || 'entradas';
                const expenseKey = keys.find(k => /sai|desp|debit|expens/i.test(k)) || 'saidas';
                const dateKey = keys.find(k => /dat|dt|time/i.test(k)) || 'data';

                console.log(`DEBUG: Mapping Keys -> Date:${dateKey}, In:${incomeKey}, Out:${expenseKey}`);

                result.fluxo.forEach((item: any) => {
                    const dateStr = item[dateKey];
                    if (!dateStr) return;

                    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
                    const itemDate = new Date(y, m - 1, d);
                    
                    const key = getGroupKey(itemDate);
                    
                    if (buckets.has(key)) {
                         const b = buckets.get(key)!;
                         
                         const inc = parseMoney(item[incomeKey]);
                         const exp = parseMoney(item[expenseKey]);
                         
                         b.income += inc;
                         b.expense += exp;
                    }
                });
            }
            
            // Convert to array
            const finalData = Array.from(buckets.values());
            
            // Log totals
            const tIn = finalData.reduce((a,c)=>a+c.income,0);
            const tOut = finalData.reduce((a,c)=>a+c.expense,0);
            // console.log(`DEBUG: Total In: ${tIn}, Out: ${tOut}`);

            // Calculate Percentages for UI
            const maxValue = Math.max(
                ...finalData.map(d => Math.max(d.income, d.expense)),
                100 
            );

            setChartData(finalData.map(d => ({
                label: d.label,
                income: (d.income / maxValue) * 100,
                expense: (d.expense / maxValue) * 100
                // We keep raw values in state? No, chartData is simple. 
                // But let's log the mapped data to check.
            })));
            
            // Set chart data with raw values for debug display
            setChartData(finalData.map(d => ({
                label: d.label,
                income: d.income,   // Store RAW value temporarily for display logic
                expense: d.expense, // Store RAW value
                // We will normalize in the render
            })));

        } catch (error) {
            console.error("Failed to fetch cash flow:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchChartData();
  }, [filter, locale]);

  if (loading) return <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>;

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">show_chart</span>
                {dictionary?.dashboard?.cashflow?.title || "Fluxo de Caixa"}
              </h3>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="text-xs font-medium bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
              >
                <option value="today">{dictionary?.dashboard?.cashflow?.filters?.today || "Hoje"}</option>
                <option value="7d">{dictionary?.dashboard?.cashflow?.filters?.['7days'] || "7 Dias"}</option>
                <option value="1m">{dictionary?.dashboard?.cashflow?.filters?.lastMonth || "Último Mês"}</option>
                <option value="3m">{dictionary?.dashboard?.cashflow?.filters?.last3Months || "Último Trimestre"}</option>
                <option value="6m">{dictionary?.dashboard?.cashflow?.filters?.last6Months || "Último Semestre"}</option>
                <option value="1y">{dictionary?.dashboard?.cashflow?.filters?.lastYear || "Último Ano"}</option>
                <option value="all">{dictionary?.dashboard?.cashflow?.filters?.all || "Fluxo Total"}</option>
              </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
              <span className="size-2 bg-blue-500 rounded-full"></span> {dictionary?.dashboard?.cashflow?.income || "Receitas"}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
              <span className="size-2 bg-red-500 rounded-full"></span> {dictionary?.dashboard?.cashflow?.expense || "Despesas"}
            </span>
          </div>
      </div>
      
      <div className="h-64 relative w-full pt-6"> 
        {(() => {
             // 1. Prepare Data for SVG
             // We need to map data to 0-100 coordinates
             const maxVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense)), 100);
             const dataPoints = chartData.map((d, i) => ({
                 index: i,
                 income: d.income,
                 expense: d.expense,
                 label: d.label
             }));
             
             if (dataPoints.length < 2) return null; // Need at least 2 points for a line

             // SVG Dimensions (virtual coordinate system)
             const width = 1000;
             const height = 300;
             const paddingX = 50;
             const chartHeight = 250;
             
             // X Scale
             const getX = (index: number) => {
                 const step = (width - paddingX * 2) / (dataPoints.length - 1);
                 return paddingX + (index * step);
             };
             
             // Y Scale (inverted for SVG)
             const getY = (val: number) => {
                 return chartHeight - ((val / maxVal) * chartHeight);
             };

             // Bezier Curve Logic (Catmull-Rom like smoothing)
             const generatePath = (type: 'income' | 'expense') => {
                 let d = `M ${getX(0)} ${getY(dataPoints[0][type])}`;
                 
                 for (let i = 0; i < dataPoints.length - 1; i++) {
                     const x0 = getX(i);
                     const y0 = getY(dataPoints[i][type]);
                     const x1 = getX(i + 1);
                     const y1 = getY(dataPoints[i + 1][type]);
                     
                     // Control points for smooth curve (approximated)
                     const cp1x = x0 + (x1 - x0) * 0.5;
                     const cp1y = y0;
                     const cp2x = x1 - (x1 - x0) * 0.5;
                     const cp2y = y1;
                     
                     d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`;
                 }
                 return d;
             };

             const incomePath = generatePath('income');
             const expensePath = generatePath('expense');
             
             // Area paths (close the loop down to bottom)
             const incomeArea = `${incomePath} L ${getX(dataPoints.length - 1)} ${chartHeight} L ${getX(0)} ${chartHeight} Z`;
             const expenseArea = `${expensePath} L ${getX(dataPoints.length - 1)} ${chartHeight} L ${getX(0)} ${chartHeight} Z`;

             return (
                <div className="absolute inset-0 w-full h-full"> 
                   <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        {/* Gradients */}
                        <defs>
                            <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4"/>
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4"/>
                                <stop offset="100%" stopColor="#EF4444" stopOpacity="0"/>
                            </linearGradient>
                        </defs>

                        {/* Expense Layer (Back) */}
                        <path d={expenseArea} fill="url(#gradExpense)" className="transition-all duration-500" />
                        <path d={expensePath} fill="none" stroke="#EF4444" strokeWidth="3" className="transition-all duration-500" strokeLinecap="round" />

                        {/* Income Layer (Front) */}
                        <path d={incomeArea} fill="url(#gradIncome)" className="transition-all duration-500" />
                        <path d={incomePath} fill="none" stroke="#3B82F6" strokeWidth="3" className="transition-all duration-500" strokeLinecap="round" />

                        {/* Data Points & Tooltips Overlay */}
                        {dataPoints.map((d, i) => (
                             <g key={i}>
                                 {/* Dots */}
                                 {d.expense > 0 && (
                                     <circle cx={getX(i)} cy={getY(d.expense)} r="4" fill="#EF4444" className="stroke-white stroke-2" />
                                 )}
                                 {d.income > 0 && (
                                     <circle cx={getX(i)} cy={getY(d.income)} r="4" fill="#3B82F6" className="stroke-white stroke-2" />
                                 )}

                                 {/* Values Labels (Debug/Feature) */}
                                 {(d.income > 0 || d.expense > 0) && (
                                     <switch>
                                         <foreignObject x={getX(i) - 40} y={-20} width="80" height="50">
                                            <div className="flex flex-col items-center justify-center text-[10px] font-bold bg-white/80 dark:bg-gray-900/80 rounded px-1 shadow-sm backdrop-blur-sm">
                                                 {d.income > 0 && <span className="text-blue-600">+{d.income.toLocaleString()}</span>}
                                                 {d.expense > 0 && <span className="text-red-500">-{d.expense.toLocaleString()}</span>}
                                            </div>
                                         </foreignObject>
                                     </switch>
                                 )}
                                 
                                 {/* X Axis Label */}
                                 <foreignObject x={getX(i) - 30} y={height - 40} width="60" height="30">
                                     <div className="text-center text-[10px] text-gray-400 font-medium">
                                         {d.label}
                                     </div>
                                 </foreignObject>
                             </g>
                        ))}
                   </svg>
                </div>
             );
        })()}
      </div>
    </div>
  );
}
