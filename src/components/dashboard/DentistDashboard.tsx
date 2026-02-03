"use client";


interface DentistDashboardProps {
  locale: string;
}

export default function DentistDashboard({ locale, dictionary }: { locale: string, dictionary: any }) {
  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-lg border-4 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center h-96">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Área do Dentista</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Funcionalidades específicas para dentistas serão implementadas aqui.
            </p>
        </div>
      </div>
    </div>
  );
}
