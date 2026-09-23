export default function Features({ dict }: { dict: any }) {
  const cards = [
    {
      title: dict.features.scheduling.title,
      description: dict.features.scheduling.description,
      icon: "calendar_today",
    },
    {
      title: dict.features.financial.title,
      description: dict.features.financial.description,
      icon: "account_balance_wallet",
    },
    {
      title: dict.features.charts.title,
      description: dict.features.charts.description,
      icon: "forum",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-slate-100 dark:bg-slate-900" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl font-black tracking-tighter text-slate-900 sm:text-6xl mb-6 dark:text-white">
            {dict.features.title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {dict.features.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col rounded-3xl bg-white p-10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:hover:shadow-2xl ring-1 ring-slate-100 dark:ring-slate-700/50 hover:ring-blue-100 dark:hover:ring-blue-900/50"
            >
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 dark:bg-blue-900/30 dark:text-blue-400">
                <span className="material-symbols-outlined text-3xl">{card.icon}</span>
              </div>
              <h3 className="mb-4 text-2xl font-black text-slate-900 dark:text-white">{card.title}</h3>
              <p className="text-slate-600 leading-relaxed dark:text-slate-400">
                {card.description}
              </p>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-10 dark:text-white transition-opacity">
                 <span className="material-symbols-outlined text-4xl leading-none">add</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
