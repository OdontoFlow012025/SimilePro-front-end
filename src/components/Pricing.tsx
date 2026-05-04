import React from 'react';

export default function Pricing({ dict, locale }: { dict: any, locale: string }) {
  const texts = dict.pricing;

  const getPlanClass = (index: number) => {
    // Make the Annual plan and Monthly plan stand out differently
    if (index === 2) return "ring-2 ring-primary border-transparent dark:ring-blue-500 scale-105 shadow-xl relative z-10 bg-white dark:bg-gray-800";
    return "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm";
  };

  const plansList = [texts.plans.free, texts.plans.monthly, texts.plans.annual, texts.plans.student];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plansList.map((plan, idx) => (
            <div key={idx} className={`rounded-2xl p-8 flex flex-col ${getPlanClass(idx)} transition-all duration-300 hover:shadow-lg`}>
              {idx === 2 && (
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden z-20 pointer-events-none">
                    {/* The ribbon bar itself */}
                    <div className="absolute left-0 top-[32px] rotate-45 transform text-center text-[9px] uppercase tracking-[0.15em] font-extrabold text-white bg-green-500 py-2 w-[141%] shadow-lg">
                        {texts.bestChoice}
                    </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{plan.description}</p>
                <div className="mt-4 flex items-baseline text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-extrabold text-slate-900 dark:text-white relative break-words whitespace-pre-wrap">
                  {plan.price}
                  {plan.period && <span className="ml-1 text-base font-medium text-slate-500 dark:text-slate-400">{plan.period}</span>}
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature: string, fIdx: number) => {
                  const isNegative = idx === 0 && (fIdx === 2 || fIdx === 3);
                  return (
                    <li key={fIdx} className="flex items-start">
                      {isNegative ? (
                        <span className="material-symbols-outlined text-red-500 mr-2 text-xl shrink-0">close</span>
                      ) : (
                        <span className="material-symbols-outlined text-green-500 mr-2 text-xl shrink-0">check_circle</span>
                      )}
                      <span className={`text-sm ${isNegative ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>{feature}</span>
                    </li>
                  );
                })}
              </ul>

              <button
                disabled={plan.blocked}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 mt-auto ${
                  plan.blocked 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700' 
                    : idx === 2 
                      ? 'bg-primary text-white hover:bg-blue-600 shadow-md hover:shadow-lg' 
                      : 'bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
