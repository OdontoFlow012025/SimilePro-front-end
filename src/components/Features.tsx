export default function Features({ dict }: { dict: any }) {
  return (
    <div className="py-20 lg:py-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl mb-4">
            {dict.features.title}
          </h2>
          <p className="text-lg text-text-secondary">
            {dict.features.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group flex flex-col rounded-2xl border border-slate-200 bg-surface-light p-8 transition-all hover:border-primary/50 hover:shadow-lg dark:border-slate-800 dark:bg-surface-dark">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
            <h3 className="mb-3 text-xl font-bold text-text-main">{dict.features.scheduling.title}</h3>
            <p className="text-text-secondary leading-relaxed">
              {dict.features.scheduling.description}
            </p>
          </div>
          {/* Feature 2 */}
          <div className="group flex flex-col rounded-2xl border border-slate-200 bg-surface-light p-8 transition-all hover:border-primary/50 hover:shadow-lg dark:border-slate-800 dark:bg-surface-dark">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <h3 className="mb-3 text-xl font-bold text-text-main">{dict.features.financial.title}</h3>
            <p className="text-text-secondary leading-relaxed">
              {dict.features.financial.description}
            </p>
          </div>
          {/* Feature 3 */}
          <div className="group flex flex-col rounded-2xl border border-slate-200 bg-surface-light p-8 transition-all hover:border-primary/50 hover:shadow-lg dark:border-slate-800 dark:bg-surface-dark">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <span className="material-symbols-outlined">description</span>
            </div>
            <h3 className="mb-3 text-xl font-bold text-text-main">{dict.features.charts.title}</h3>
            <p className="text-text-secondary leading-relaxed">
              {dict.features.charts.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
