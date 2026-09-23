export default function FeaturesList({ dict }: { dict: any }) {
  const features = dict.featuresPage.items || [];

  return (
    <section className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10 -z-10 pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
            {dict.featuresPage.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {dict.featuresPage.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any, index: number) => (
            <div 
              key={index} 
              className="group relative flex flex-col rounded-[2rem] bg-white p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:bg-slate-900 dark:hover:bg-slate-800/80 dark:hover:shadow-2xl ring-1 ring-slate-200/50 dark:ring-slate-800/50 hover:ring-blue-100 dark:hover:ring-blue-900/50 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-blue-900/10" />
              
              <div className="relative">
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 dark:bg-blue-900/30 dark:text-blue-400">
                  <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
              
              {/* Decorative corner icon */}
              <div className="absolute top-6 right-6 text-slate-100 dark:text-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                 <span className="material-symbols-outlined text-6xl leading-none">{feature.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
