import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getDictionary } from "@/utils/get-dictionary";
import CTABanner from "@/components/CTABanner";

export default async function CompliancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const compDict = dict.compliancePage;

  const cards = [
    {
      id: "lgpd",
      icon: "shield_locked",
      color: "blue",
      data: compDict.cards.lgpd,
    },
    {
      id: "icp",
      icon: "history_edu",
      color: "amber",
      data: compDict.cards.icp,
    },
    {
      id: "rnds",
      icon: "hub",
      color: "emerald",
      data: compDict.cards.rnds,
    },
    {
      id: "hipaa",
      icon: "public",
      color: "indigo",
      data: compDict.cards.hipaa,
    },
    {
      id: "cfo",
      icon: "gavel",
      color: "blue",
      data: compDict.cards.cfo,
    },
    {
      id: "tiss",
      icon: "receipt_long",
      color: "amber",
      data: compDict.cards.tiss,
    },
    {
      id: "iso",
      icon: "verified",
      color: "emerald",
      data: compDict.cards.iso,
    },
    {
      id: "backup",
      icon: "cloud_sync",
      color: "indigo",
      data: compDict.cards.backup,
    }
  ];

  return (
    <main className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-blue-200 dark:selection:bg-blue-900">
      <Navbar dict={dict} locale={locale} />
      
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900/50 dark:to-slate-950 -z-10"></div>
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider dark:bg-blue-900/30 dark:text-blue-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            Trust & Security
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {compDict.title}
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            {compDict.subtitle}
          </p>
        </div>
      </section>

      {/* Grid Features */}
      <section className="pb-32 -mt-16 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {cards.map((card, idx) => (
              <div 
                key={card.id} 
                className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 lg:p-12 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-all duration-300 group"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className={`size-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${
                  card.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  card.color === 'amber' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                  card.color === 'emerald' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                }`}>
                  <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform duration-500">
                    {card.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                  {card.data.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {card.data.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner dict={dict} locale={locale} />
      <Footer dict={dict} locale={locale} />
    </main>
  );
}
