import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InactivityHandler from "@/components/InactivityHandler";
import { getDictionary } from "@/utils/get-dictionary";
import React from "react";

export default async function PrivateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  
  return (
    <>
      <InactivityHandler locale={locale} />
      <DashboardLayout dictionary={dictionary} locale={locale}>
        {children}
      </DashboardLayout>
    </>
  );
}
