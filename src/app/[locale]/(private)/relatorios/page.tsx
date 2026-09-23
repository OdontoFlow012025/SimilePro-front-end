import ReportsDashboard from "@/components/dashboard/reports/ReportsDashboard";
import { getDictionary } from '@/utils/get-dictionary';

export default async function RelatoriosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="p-4 md:p-8">
      <ReportsDashboard dict={dict} />
    </div>
  );
}
