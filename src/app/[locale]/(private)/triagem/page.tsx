import TriageBoard from "@/components/dashboard/triage/TriageBoard";
import { getDictionary } from "@/utils/get-dictionary";

export default async function TriagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  // Format date for header
  const today = new Date().toLocaleDateString(locale, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
        <TriageBoard dictionary={dictionary} dateDisplay={todayCapitalized} />
    </div>
  );
}
