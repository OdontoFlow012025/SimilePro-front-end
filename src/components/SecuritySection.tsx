import Image from "next/image";

export default function SecuritySection({ dict }: { dict: any }) {
  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Text/List Content */}
          <div className="flex flex-col gap-10 lg:w-1/2">
            <div className="flex flex-col gap-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider dark:bg-green-900/30 dark:text-green-400 self-start">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {dict.security.badge}
              </span>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl leading-tight dark:text-white">
                {dict.security.title}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed dark:text-slate-400">
                {dict.security.description}
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex gap-6 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">draw</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{dict.security.signature.title}</h3>
                  <p className="text-slate-600 leading-relaxed dark:text-slate-400">
                    {dict.security.signature.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{dict.security.compliance.title}</h3>
                  <p className="text-slate-600 leading-relaxed dark:text-slate-400">
                    {dict.security.compliance.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="lg:w-1/2 w-full relative">
             <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
                  alt="Security and Compliance"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
             </div>
             
             {/* Decorative element */}
             <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
