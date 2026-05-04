import Link from "next/link";

export default function CTABanner({ dict, locale }: { dict: any; locale: string }) {
  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[3rem] bg-blue-600 px-8 py-20 text-center shadow-2xl shadow-blue-500/30 overflow-hidden group">
          {/* Decorative background circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl">
              {dict.cta.title}
            </h2>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed">
              {dict.cta.description}
            </p>
            <Link
              href={`/${locale}/signup`}
              className="flex h-14 min-w-[200px] items-center justify-center rounded-xl bg-white px-8 text-lg font-bold text-blue-600 shadow-xl hover:bg-slate-50 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              {dict.cta.getStarted}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
