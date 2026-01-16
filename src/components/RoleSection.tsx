export default function RoleSection({ dict }: { dict: any }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold text-text-main mb-6">{dict.roles.title}</h2>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all dark:hover:bg-gray-800">
                <div className="mt-1 shrink-0 text-primary">
                  <span className="material-symbols-outlined">stethoscope</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-main">{dict.roles.dentists.title}</h4>
                  <p className="mt-1 text-sm text-text-secondary">{dict.roles.dentists.description}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all dark:hover:bg-gray-800">
                <div className="mt-1 shrink-0 text-primary">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-main">{dict.roles.receptionists.title}</h4>
                  <p className="mt-1 text-sm text-text-secondary">{dict.roles.receptionists.description}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all dark:hover:bg-gray-800">
                <div className="mt-1 shrink-0 text-primary">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-main">{dict.roles.managers.title}</h4>
                  <p className="mt-1 text-sm text-text-secondary">{dict.roles.managers.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="aspect-4/3 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpeB4i0P7FK2jM17j6dDiOXjd4Tv4JJ8nfN6wGi5GExQ5WfJutolUykmRLX4BGqcyIkBqpO1tS30LWEh80asfxXTJYFRNB-GvrWU_RrH7paLbJzQYr_9ZfJ5IuDNMsKJ7H4AvS_NXa-zYg5E4GAj1FoxBXdkC2QS-eR7QBaqp3nxjILmfjHkRgDcZWBfoy9S0X4QaqCUoRwOK1tlifxr7AAzuYYHYkxNGNrCqVypkHySjfh2cP7RqvUnM4x4UeG8YKr4SOBjZ4NLc')" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
