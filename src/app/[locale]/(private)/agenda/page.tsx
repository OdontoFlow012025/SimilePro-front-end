import AgendaClientWrapper from "@/components/dashboard/calendar/AgendaClientWrapper";
import { getDictionary } from "@/utils/get-dictionary";
export default async function AgendaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as any); // Type cast for simplicity, robust type would be better

  return (
    <AgendaClientWrapper dictionary={dictionary} locale={locale} />
  );
}
