"use client";

import AttendanceFlow from "./AttendanceFlow";
import BIIndicators from "./BIIndicators";
import CashFlowChart from "./CashFlowChart";
import CriticalPendencies from "./CriticalPendencies";
import FinancialStats from "./FinancialStats";
import Header from "./Header";
import QuickActions from "./QuickActions";
import Sidebar from "./Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
          <FinancialStats />
          <AttendanceFlow />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CashFlowChart />
            <BIIndicators />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <CriticalPendencies />
             <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
