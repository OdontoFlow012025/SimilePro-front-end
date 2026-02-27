import Image from "next/image";
import Link from "next/link";

export default function Hero({ dict, locale }: { dict: any; locale: string }) {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-8 lg:w-1/2">
            <div className="flex flex-col gap-6">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider dark:bg-blue-900/30 dark:text-blue-400 mb-6">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  {dict.hero.badge}
                </span>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl leading-[1.1] dark:text-white">
                  <span className="block mb-2 text-slate-900 dark:text-slate-400">{dict.hero.titlePrefix}</span>
                  <span className="text-blue-600">{dict.hero.titleSuffix}</span>
                </h1>
              </div>
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed dark:text-slate-400">
                {dict.hero.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link
                href={`/${locale}/signup`}
                className="flex h-14 min-w-[200px] items-center justify-center rounded-xl bg-blue-600 px-8 text-lg font-bold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                {dict.hero.startTrial}
              </Link>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{dict.hero.statusRnds}</span>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="lg:w-1/2 w-full relative">
            <div className="relative rounded-3xl bg-white p-3 dark:bg-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-slate-200 dark:ring-slate-700 group">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
                {/* Dashboard Image */}
                <Image
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200"
                  alt="OdontoFlow Dashboard"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                
                {/* Floating Status Card */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-2xl ring-1 ring-black/5 dark:bg-slate-800/90 dark:ring-white/10 animate-float">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <span className="material-symbols-outlined text-3xl animate-spin-slow">sync</span>
                  </div>
                  <div className="pr-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight">Sincronização RNDS</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">ATIVA E EM DIA</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-blob dark:bg-blue-600/20"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-blob animation-delay-2000 dark:bg-emerald-600/20"></div>
          </div>
        </div>
      </div>
      
      {/* Global background glow */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>
    </section>
  );
}
