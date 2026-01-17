export default function Stats({ dict }: { dict: any }) {
  return (
    <div className="bg-(--surface) py-12 border-y border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center justify-center text-center gap-1 p-4">
            <p className="text-3xl lg:text-4xl font-extrabold text-(--text-main)">500+</p>
            <p className="text-sm font-medium text-(--text-secondary)">{dict.stats.clinics}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-1 p-4">
            <p className="text-3xl lg:text-4xl font-extrabold text-(--text-main)">2,500+</p>
            <p className="text-sm font-medium text-(--text-secondary)">{dict.stats.dentists}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-1 p-4">
            <p className="text-3xl lg:text-4xl font-extrabold text-(--text-main)">1M+</p>
            <p className="text-sm font-medium text-(--text-secondary)">{dict.stats.patients}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-1 p-4">
            <p className="text-3xl lg:text-4xl font-extrabold text-(--text-main)">99.9%</p>
            <p className="text-sm font-medium text-(--text-secondary)">{dict.stats.uptime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
