import { redirect } from "next/navigation";

export default async function EstoquePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Redirect to the new unified financial module under the inventory tab
  redirect(`/${locale}/financeiro?tab=estoque`);
}
