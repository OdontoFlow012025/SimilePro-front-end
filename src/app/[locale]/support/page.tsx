import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getDictionary } from "@/utils/get-dictionary";
import Link from "next/link";
import SupportChatSearch from "@/components/SupportChatSearch";

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const support = dict.supportPage;

  return (
    <main className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar dict={dict} locale={locale} />
      
      {/* Hero Header with Search */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-blue-600 dark:bg-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-600 dark:to-blue-900"></div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative text-center z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {support.title}
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            {support.subtitle}
          </p>
          
          <SupportChatSearch placeholder={support.searchPlaceholder} />
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 text-center">
            {support.categories.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {support.categories.items.map((item: any, idx: number) => (
              <Link href={`/${locale}/support/${item.slug}`} key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer block">
                <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Contact Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
          
          {/* FAQ Accordion */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10">
              {support.faq.title}
            </h2>
            <div className="flex flex-col gap-4">
              {support.faq.items.map((faq: any, idx: number) => (
                <details key={idx} className="group bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer text-lg font-bold text-slate-900 dark:text-white">
                    {faq.q}
                    <span className="material-symbols-outlined text-blue-600 transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Cards */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
              {support.contact.title}
            </h2>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-green-500/20">
              <span className="material-symbols-outlined text-4xl mb-4">chat</span>
              <h3 className="text-2xl font-bold mb-2">{support.contact.whatsapp.title}</h3>
              <p className="text-green-50 mb-6">{support.contact.whatsapp.desc}</p>
              <a 
                href="https://wa.me/5511999999999?text=Olá,%20preciso%20de%20ajuda%20com%20o%20Simile Pro!" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-white text-green-600 font-bold py-3 px-6 rounded-xl hover:bg-green-50 transition-colors inline-block text-center"
              >
                {support.contact.whatsapp.btn}
              </a>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-4xl text-blue-600 mb-4">mail</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{support.contact.email.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{support.contact.email.desc}</p>
              <a 
                href={`/${locale}/support/ticket`}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors inline-block text-center"
              >
                {support.contact.email.btn}
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </main>
  );
}
