"use client";

import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function FinancialStats({ dictionary }: { dictionary: any }) {
  const [data, setData] = useState({
    dailyRevenue: { value: 0, growth: 0, target: 0 },
    monthlyExpenses: { value: 0, growth: 0, target: 0 },
    netProfit: { value: 0, growth: 0, target: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        
        // Helper to format date as YYYY-MM-DD in LOCAL time
        const fmt = (d: Date) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // Dates for Today vs Yesterday
        const todayStr = fmt(now);
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = fmt(yesterday);

        // Dates for This Month vs Last Month
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Dates for This Year vs Last Year
        const thisYearStart = new Date(now.getFullYear(), 0, 1);
        const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);

        // Parallel requests using the stable getSummary endpoint
        const [
          todaySum, yesterdaySum, 
          thisMonthSum, lastMonthSum, 
          thisYearSum, lastYearSum
        ] = await Promise.all([
          api.financialTransactions.getSummary(`dataInicio=${todayStr}&dataFim=${todayStr}`),
          api.financialTransactions.getSummary(`dataInicio=${yesterdayStr}&dataFim=${yesterdayStr}`),
          api.financialTransactions.getSummary(`dataInicio=${fmt(thisMonthStart)}&dataFim=${fmt(now)}`),
          api.financialTransactions.getSummary(`dataInicio=${fmt(lastMonthStart)}&dataFim=${fmt(lastMonthEnd)}`),
          api.financialTransactions.getSummary(`dataInicio=${fmt(thisYearStart)}&dataFim=${fmt(now)}`),
          api.financialTransactions.getSummary(`dataInicio=${fmt(lastYearStart)}&dataFim=${fmt(lastYearEnd)}`)
        ]);

        const calcGrowth = (curr: number, prev: number) => {
          if (prev <= 0) return curr > 0 ? 100 : 0;
          return Math.round(((curr - prev) / prev) * 100);
        };

        const dailyVal = Number(todaySum?.receitas || 0);
        const prevDailyVal = Number(yesterdaySum?.receitas || 0);
        
        const monthlyExp = Number(thisMonthSum?.despesas || 0);
        const prevMonthlyExp = Number(lastMonthSum?.despesas || 0);

        const monthlyProfit = Number(thisMonthSum?.resultado || 0);
        const prevYearProfit = Number(lastYearSum?.resultado || 0);
        const thisYearProfit = Number(thisYearSum?.resultado || 0);

        setData({
          dailyRevenue: { 
            value: dailyVal, 
            growth: calcGrowth(dailyVal, prevDailyVal),
            target: Math.max(prevDailyVal, dailyVal, 1) // Dynamic target for progress bar
          },
          monthlyExpenses: { 
            value: monthlyExp, 
            growth: calcGrowth(monthlyExp, prevMonthlyExp),
            target: Math.max(prevMonthlyExp, monthlyExp, 1)
          },
          netProfit: { 
            value: monthlyProfit, 
            growth: calcGrowth(thisYearProfit, prevYearProfit),
            target: Math.max(prevYearProfit, thisYearProfit, 1)
          }
        });
      } catch (error) {
        console.error("Failed to fetch financial stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateProgress = (current: number, target: number) => {
    if (target <= 0) return current > 0 ? 100 : 0;
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <section>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span className="material-symbols-outlined text-blue-500">account_balance_wallet</span> {dictionary?.dashboard?.financial?.title || "Saúde Financeira"}
      </h3>
      
      <div className="flex flex-col md:flex-row overflow-x-auto gap-4 pb-2 snap-x scrollbar-hide">
        
        {/* Faturamento */}
        <div className="min-w-[280px] flex-1 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm snap-start">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{dictionary?.dashboard?.financial?.dailyRevenue || "Faturamento do Dia"}</p>
          <div className="flex items-end gap-2">
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(data.dailyRevenue.value)}</h4>
            <span className="text-green-600 text-xs font-bold mb-1.5">+{data.dailyRevenue.growth}%</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-green-600 h-full transition-all duration-1000" 
              style={{ width: `${calculateProgress(data.dailyRevenue.value, (data.dailyRevenue as any).target)}%` }}
            ></div>
          </div>
        </div>

        {/* Despesas */}
        <div className="min-w-[280px] flex-1 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm snap-start">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{dictionary?.dashboard?.financial?.monthlyExpenses || "Despesas do Mês"}</p>
          <div className="flex items-end gap-2">
            <h4 className="text-2xl font-extrabold text-red-500">{formatCurrency(data.monthlyExpenses.value)}</h4>
            <span className="text-red-500 text-xs font-bold mb-1.5">+{data.monthlyExpenses.growth}%</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-red-500 h-full transition-all duration-1000" 
              style={{ width: `${calculateProgress(data.monthlyExpenses.value, (data.monthlyExpenses as any).target)}%` }}
            ></div>
          </div>
        </div>

        {/* Lucro */}
        <div className="min-w-[280px] flex-1 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm snap-start">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{dictionary?.dashboard?.financial?.netProfit || "Lucro Líquido Real"}</p>
          <div className="flex items-end gap-2">
            <h4 className="text-2xl font-extrabold text-green-600">{formatCurrency(data.netProfit.value)}</h4>
            <span className="text-green-600 text-xs font-bold mb-1.5">+{data.netProfit.growth}%</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-1000" 
              style={{ width: `${calculateProgress(data.netProfit.value, (data.netProfit as any).target)}%` }}
            ></div>
          </div>
        </div>

      </div>
    </section>
  );
}
