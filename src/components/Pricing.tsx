import React from 'react';

export default function Pricing({ dict, locale }: { dict: any, locale: string }) {
  const texts = dict.pricing;

  const getPlanClass = (index: number) => {
    // Make the Annual plan and Monthly plan stand out differently
    if (index === 1) return "border border-gray-200 dark:border-gray-700 dark:ring-blue-500 scale-105 shadow-xl hover:shadow-2xl relative z-10 bg-white dark:bg-gray-800";
    return "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl";
  };

  const plansList = [texts.plans.monthly, texts.plans.annual, texts.plans.student];

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900 bg-grid-slate-100 dark:bg-grid-slate-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            {texts.title}
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-300">
            {texts.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plansList.map((plan, idx) => (
            <div key={idx} className={`relative rounded-2xl p-8 flex flex-col ${getPlanClass(idx)} transition-all duration-300`}>
              {/* Soft inner shadow on the borders of the box */}
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] pointer-events-none z-10"></div>
              
              {/* Coming Soon overlay for the whole card */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <span className="text-slate-800 dark:text-slate-100 text-4xl font-extrabold px-6 py-2 transform -rotate-3 drop-shadow-md">
                  {texts.comingSoon}
                </span>
              </div>

              {idx === 1 && (
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden z-20 pointer-events-none">
                    {/* The ribbon bar itself */}
                    <div className="absolute left-0 top-[32px] rotate-45 transform text-center text-[9px] uppercase tracking-[0.15em] font-extrabold text-white bg-green-500 py-2 w-[141%] shadow-lg">
                        {texts.bestChoice}
                    </div>
                </div>
              )}
              
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              </div>

              {/* Description (Blurred on all plans) */}
              <div className="mb-6 blur-[6px] opacity-70 select-none pointer-events-none">
                <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{plan.description}</p>
              </div>

              {/* Price Area */}
              <div className="mb-6 mt-4 relative inline-block">
                <div className="flex items-baseline text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-extrabold text-slate-900 dark:text-white break-words whitespace-pre-wrap select-none blur-[8px] opacity-30 pointer-events-none">
                  {plan.price}
                  {plan.period && <span className="ml-1 text-base font-medium text-slate-500 dark:text-slate-400">{plan.period}</span>}
                </div>
              </div>

              {/* Features and Button (Blurred on all plans) */}
              <div className="flex flex-col flex-1 blur-[6px] opacity-70 select-none pointer-events-none">
                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature: string, fIdx: number) => {
                    return (
                      <li key={fIdx} className="flex items-start">
                        <span className="material-symbols-outlined text-green-500 mr-2 text-xl shrink-0">check_circle</span>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                      </li>
                    );
                  })}
                </ul>

                <button
                  disabled={true}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 mt-auto bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
