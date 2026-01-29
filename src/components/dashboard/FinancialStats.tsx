"use client";

import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function FinancialStats({ dictionary }: { dictionary: any }) {
  const [data, setData] = useState({
    dailyRevenue: { value: 0, growth: 0 },
    monthlyExpenses: { value: 0, growth: 0 },
    netProfit: { value: 0, growth: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();

        // 1. Daily Query (YYYY-MM-DD) for "Faturamento do Dia" using Accounting Endpoint
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const dailyQuery = new URLSearchParams({
            dataInicio: todayStr,
            dataFim: todayStr
        }).toString();

        // 2. Monthly Query (1st of Month to Now)
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = now;

        const monthlyQuery = new URLSearchParams({
            dataInicio: monthStart.toISOString(),
            dataFim: monthEnd.toISOString()
        }).toString();

        const [dailySummary, monthlySummary] = await Promise.all([
            // Switch to getSummary to get FLOW (transactions) instead of STOCK (balance)
            api.financialTransactions.getSummary(dailyQuery),
            api.financialTransactions.getSummary(monthlyQuery)
        ]);
        
        console.log("DEBUG: Daily Transaction Summary:", dailySummary);

        // Map daily revenue explicitly from 'entradas' or 'receitas' of the summary
        const dailyVal = Number(
            dailySummary?.totalEntradas || 
            dailySummary?.totalReceitas || 
            dailySummary?.receitas || 
            0
        );
        
        const monthlyExp = Number(monthlySummary?.totalSaidas || monthlySummary?.totalPagamentos || monthlySummary?.despesas || 0);
        const monthlyProfit = Number(monthlySummary?.saldo || monthlySummary?.resultado || 0);

        setData({
            // Daily Revenue (Only TODAY's transactions)
            dailyRevenue: { 
                value: isNaN(dailyVal) ? 0 : dailyVal, 
                growth: 0 
            }, 
            // Monthly Expenses (Accumulated this month)
            monthlyExpenses: { 
                value: monthlyExp, 
                growth: 0 
            },
            // Net Profit (Result of this month: Receipts - Payments)
            netProfit: { 
                value: monthlyProfit, 
                growth: 0 
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
            <div className="bg-green-600 h-full w-3/4"></div>
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
            <div className="bg-red-500 h-full w-1/2"></div>
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
            <div className="bg-blue-500 h-full w-2/3"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
