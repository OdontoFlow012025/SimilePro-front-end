import CalendarWrapper from "@/components/dashboard/calendar/CalendarWrapper";
import SidebarFilters from "@/components/dashboard/calendar/SidebarFilters";
import { getDictionary } from "@/utils/get-dictionary";

export default async function AgendaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as any); // Type cast for simplicity, robust type would be better

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col lg:flex-row gap-6">
       <SidebarFilters dictionary={dictionary} locale={locale} />
       <div className="flex-1 h-full overflow-hidden">
         <CalendarWrapper locale={locale} dictionary={dictionary} />
       </div>
    </div>
  );
}
