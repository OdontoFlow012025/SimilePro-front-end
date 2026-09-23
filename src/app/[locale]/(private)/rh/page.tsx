import { getDictionary } from "@/utils/get-dictionary";
import HRDashboard from "@/components/dashboard/hr/HRDashboard";
import React from "react";

export default async function HRPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as any);

  return (
    <div className="p-6">
      <HRDashboard dict={dictionary} />
    </div>
  );
}
