import ClientDashboardWrapper from '@/components/dashboard/ClientDashboardWrapper';
import { getDictionary } from '@/utils/get-dictionary';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return <ClientDashboardWrapper locale={locale} dictionary={dictionary} />;
}

