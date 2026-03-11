export default function Stats({ dict }: { dict: any }) {
  const partners = [
    { name: dict.partners.institutional, icon: "account_balance" },
    { name: dict.partners.protocols, icon: "security" },
    { name: dict.partners.standard, icon: "gavel" },
    { name: dict.partners.network, icon: "hub" },
  ];

  return (
    <div className="bg-white dark:bg-[#0B1221] py-8 border-y border-gray-200 dark:border-white/5 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-all cursor-default group"
            >
              <span className="material-symbols-outlined text-xl text-gray-900 dark:text-white transition-colors">
                {partner.icon}
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-gray-900 dark:text-white uppercase whitespace-nowrap transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
