import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TicketForm from "@/components/support/TicketForm";
import { getDictionary } from "@/utils/get-dictionary";
import Link from "next/link";

export default async function TicketPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const ticket = dict.ticketPage;

  return (
    <main className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar dict={dict} locale={locale} />
      
      <section className="bg-blue-600 dark:bg-blue-900 text-white pt-20 pb-32">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Link href={`/${locale}/support`} className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 font-bold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Central de Ajuda
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">{ticket.title}</h1>
          <p className="text-xl text-blue-100">{ticket.subtitle}</p>
        </div>
      </section>

      <section className="flex-1 -mt-20 pb-20 px-4">
        <TicketForm dict={dict} locale={locale} />
      </section>
      
      <Footer dict={dict} locale={locale} />
    </main>
  );
}
