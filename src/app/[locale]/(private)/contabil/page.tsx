import { getDictionary } from "@/utils/get-dictionary";
import AccountingDashboard from "@/components/dashboard/accounting/AccountingDashboard";
import React from "react";

export default async function AccountingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as any);

  return (
    <div className="p-6">
      <AccountingDashboard dict={dictionary} />
    </div>
  );
}
