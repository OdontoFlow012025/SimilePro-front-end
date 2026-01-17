export default function CTABanner({ dict }: { dict: any }) {
  return (
    <div className="relative py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-(--cta-green) dark:bg-surface px-6 py-16 md:px-12 md:py-20 shadow-2xl text-white relative overflow-hidden border border-transparent dark:border-slate-800">
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl mb-6">{dict.cta.title}</h2>
          <p className="relative text-lg text-white/90 dark:text-slate-300 mb-10 max-w-2xl mx-auto">{dict.cta.description}</p>
          <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex h-12 items-center justify-center rounded-lg bg-(--primary) px-8 text-base font-bold text-white hover:bg-(--primary-hover) transition-colors shadow-lg">
              {dict.cta.getStarted}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
