import InactivityHandler from "@/components/InactivityHandler";
import React from "react";

export default async function PrivateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <>
      <InactivityHandler locale={locale} />
      {children}
    </>
  );
}
