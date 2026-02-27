export default function Stats({ dict }: { dict: any }) {
  const partners = [
    { name: dict.partners.institutional, icon: "corporate_fare" },
    { name: dict.partners.protocols, icon: "clinical_notes" },
    { name: dict.partners.standard, icon: "verified_user" },
    { name: dict.partners.network, icon: "hub" },
  ];

  return (
    <div className="bg-white py-10 border-y border-slate-100 dark:bg-slate-950 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center lg:justify-start gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                <span className="material-symbols-outlined text-2xl">{partner.icon}</span>
              </div>
              <span className="text-xs font-black tracking-widest text-slate-900 uppercase dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
