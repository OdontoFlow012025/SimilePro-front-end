import Image from "next/image";

export default function RoleSection({ dict }: { dict: any }) {
  const roles = [
    {
      title: dict.roles.dentists.title,
      description: dict.roles.dentists.description,
      icon: "person_search",
    },
    {
      title: dict.roles.receptionists.title,
      description: dict.roles.receptionists.description,
      icon: "headset_mic",
    },
    {
      title: dict.roles.managers.title,
      description: dict.roles.managers.description,
      icon: "insights",
    },
  ];

  return (
    <section className="bg-slate-100 dark:bg-slate-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Illustration Content */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-emerald-50 dark:bg-emerald-900/10 group shadow-2xl ring-1 ring-slate-100 dark:ring-slate-800">
               <Image
                  src="https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=1200"
                  alt="Developed for the whole network"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-emerald-100/20 to-transparent"></div>
            </div>
          </div>

          {/* Text/List Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              {dict.roles.title}
            </h2>
            
            <div className="flex flex-col gap-8">
              {roles.map((role, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all dark:bg-blue-900/30 dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">{role.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{role.title}</h3>
                    <p className="text-slate-600 leading-relaxed dark:text-slate-400">
                      {role.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
