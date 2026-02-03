"use client";

import AttendanceFlow from "./AttendanceFlow";
import BIIndicators from "./BIIndicators";
import CashFlowChart from "./CashFlowChart";
import CriticalPendencies from "./CriticalPendencies";
import FinancialStats from "./FinancialStats";
import QuickActions from "./QuickActions";

export default function AdminDashboard({ dictionary }: { dictionary: any }) {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <FinancialStats dictionary={dictionary} />
      <AttendanceFlow dictionary={dictionary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CashFlowChart dictionary={dictionary} />
        <BIIndicators dictionary={dictionary} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CriticalPendencies dictionary={dictionary} />
          <QuickActions dictionary={dictionary} />
      </div>
    </div>
  );
}
