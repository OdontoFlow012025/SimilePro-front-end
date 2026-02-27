"use client";

import CashFlowChart from "../CashFlowChart";
import FinancialStats from "../FinancialStats";
import QuickActions from "../QuickActions";

export default function AccountFlow({ dictionary }: { dictionary: any }) {
  return (
    <div className="space-y-6">
      <FinancialStats dictionary={dictionary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart dictionary={dictionary} />
        </div>
        <div>
          <QuickActions dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}
