export default function Hero({ dict }: { dict: any }) {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6 lg:w-1/2">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl lg:text-6xl leading-[1.15]">
                {dict.hero.titlePrefix} <span className="text-(--primary)">{dict.hero.titleSuffix}</span>
              </h1>
              <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
                {dict.hero.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="flex h-12 min-w-[160px] items-center justify-center rounded-lg bg-(--primary) px-6 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-(--primary-hover) transition-all">
                {dict.hero.startTrial}
              </button>
              <button className="flex h-12 min-w-[160px] items-center justify-center rounded-lg border border-slate-200 bg-surface px-6 text-base font-bold text-text-main hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all gap-2">
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                {dict.hero.watchVideo}
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary dark:text-slate-500 pt-2">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUtTojdIp7mKUJWMVQeBnQdODem0_-mp0AT7sI631K8H9AD6LglyaxK32sigoF1QH2Z09Z0TY31OQkMpjpMIelPdHyWKgBRE8GTABRVBAMx8cDm7VbbAkNNoDTbvDq9lgmja_Q7GMGMbM_l2At-ISfjysw3HYoYhRY2nBZdP6CeRC92IBvqtIdlR-qvq6IKu-aUdLigTw5e49EgMO0ah5ninv-dbYepv4cWO3pt1fPMLK2KljxacLzQ4ioEgcCfKHs7S-oC40l36s')" }}></div>
                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-300 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoiTybBKAMnKaD7ZymxuljxhSCrvkZr0RojtSUK-XINVrCKj0IDpjd3JCpyVjYFigamZgnd0JW7TFQ6TVu42ipzGms3OSrWdk0-Acq5_uhsUtNVMnOmgqerAUJvVSP7Y3UYyfODAx7BQlojPfB5c0-70uPQLNSFU6JEhjBcwFcZVedG8SonO5nC3p_ERNX4zN_1CDm2zC6K3abWw2bpQ-2GR4McN49YVuICCg8w3JFgaXFo7OXz9NJasprgWr7_QMSj2hJ6OYkYFY')" }}></div>
                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-400 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAR6ml5d7A3oMU_pfoWyTVu-kqVjtMuhk_dWDMP1lnixMUMLSBwII-bYjlXgpr1fiPUc9getTISXel7P0yQA4T7Es-1e6QgaXHG-xxuSEnUrUtvVIje1PphIgJpQpL8cDiNphJ_uLJoha2rkX1DJsV67iAss9UmjlfTZtw9RG5obz7JMTya1c7m6BS-_Qccl7aOAXUZYEqrbbLSNhnLXikeSg0M2VmxcUq_6QDNzgkPh2WZGQZkCTw1sqta1Rc3oN2uVc-9XtUBtE')" }}></div>
              </div>
              <p>{dict.hero.trustedBy}</p>
            </div>
          </div>
          {/* Image Content */}
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl bg-linear-to-b from-slate-100 to-slate-200 p-2 dark:from-slate-800 dark:to-slate-900 shadow-2xl ring-1 ring-slate-900/10">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark shadow-inner">
                {/* Simulated Dashboard UI */}
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBI42WLrwQIhZkct9BJbRgiUgFCaQytpWO_m3Q3T3sBxQ9TZkP30Rb77SnlaorvxynmAK8RHdAuwC1AfFoSfuvPBkZ-qXpTtkIoKIA4JVLcd6fhjsO1U_7b81nrjqXC-49tq72d7DGYm4GoTDd4WTU3Ml7n7eNVyDZAP6HSKlREbLabDShWRseY3j9uPbYSueicY69WBw77MAjLQ2NJ_ZGI3gNrDlgTv5SHFGKYbFr4knnGawE9mPFbODJG2owOFXERG2SO-FVrysA')" }}></div>
                {/* Floating Card Element */}
                <div className="absolute -bottom-6 -left-6 hidden md:flex flex-col gap-2 rounded-xl bg-surface-light p-4 shadow-xl ring-1 ring-black/5 dark:bg-surface-dark dark:ring-white/10 max-w-[220px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-secondary dark:text-slate-400">{dict.hero.dailyRevenue}</p>
                      <p className="text-lg font-bold text-text-main dark:text-white">$4,250.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
