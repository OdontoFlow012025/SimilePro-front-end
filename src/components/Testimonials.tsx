export default function Testimonials({ dict }: { dict: any }) {
  return (
    <div className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-text-main text-center sm:text-4xl mb-16">
          {dict.testimonials.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800/50 dark:border dark:border-slate-700">
            <div>
              <div className="flex text-yellow-400 mb-4">
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
              </div>
              <p className="text-text-main italic mb-6">"{dict.testimonials.t1}"</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClgA21gakJO7uNFDueMSqAnbdZohz7er_82WLMiWZaeA7HYPMse8eIpdvV5OLBNQu72UF7cpcMjj-ZiOBzQBpOu5Hpbpmdht1VaiizPxaXp3nhmS_lYTi1UBAngzEj05EjhGzhAHQiBEaArMfykP5oxda8DKIxtIljeKKDSJWH6CA5c0s7PYTvxbqvnjZso1whBTEuKVsIBi_9hSMKewAoZ0ga7PLwZG3xEAkaixl0F-qYX0jrc5DapccgawN7ptVYflUFdA3xXl8')" }}></div>
              <div>
                <p className="text-sm font-bold text-text-main">Dr. Sarah Jenkins</p>
                <p className="text-xs text-text-secondary">{dict.testimonials.t1_role}</p>
              </div>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800/50 dark:border dark:border-slate-700">
            <div>
              <div className="flex text-yellow-400 mb-4">
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
              </div>
              <p className="text-text-main italic mb-6">"{dict.testimonials.t2}"</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8pNKR3PfajGR5j8nQJSezC_kMyEXCsNm7EvWDuK9rbR33hmu1SbrRQH_SlySIuI9hA21WBqr9A0hNVnMoUzFx-BGfeA38zwOc9ksldgoZkFqpjvPkDmA_QsNkiPj_8KXnTETVf0vkJeGV2FH1AMYburjmz-SePzgf1NwSHIFCWhUJUm9RvKWL2eO759FVPLBs1HQdUem-ziNAaDPpaGtLKBTUmPWL0Cbxov9IXXKOQXQY2dB2XrMEmy-Rj-bmdbdKMQXad87r3D4')" }}></div>
              <div>
                <p className="text-sm font-bold text-text-main">Dr. Carlos Mendez</p>
                <p className="text-xs text-text-secondary">{dict.testimonials.t2_role}</p>
              </div>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800/50 dark:border dark:border-slate-700">
            <div>
              <div className="flex text-yellow-400 mb-4">
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
                <span className="material-symbols-outlined text-[20px]">star</span>
              </div>
              <p className="text-text-main italic mb-6">"{dict.testimonials.t3}"</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCsNsEO6_lujjqZlWKGSxcwImzRAMefz82GrQmF85TrnDzS5knOzqwNTdxFPdS6X6raRrmVktV_LPtDXjqlAoWsM2bjRjmEWqL9u8t9p1q438Zumspt7qKnxpLBTNj5_i13TvpQCzWBFTyaESLnnqRfiFlUy_p2zJAp5gjYzk7dg6c9gkrkyDKfLpHPPuNrjRqknADUMtirZ5Novb-yGeShr_6DFIn7noXq7wSWb7fQD_nPli26gRDLv5m1-Iahb4GVVjlnffOb0qY')" }}></div>
              <div>
                <p className="text-sm font-bold text-text-main">Emily Chen</p>
                <p className="text-xs text-text-secondary">{dict.testimonials.t3_role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
