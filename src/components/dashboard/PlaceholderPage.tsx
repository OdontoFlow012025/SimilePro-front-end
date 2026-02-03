"use client";

import { useParams } from "next/navigation";

export default function PlaceholderPage({ title }: { title: string }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'pt-BR';

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <div className="size-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-gray-400">construction</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Página em Construção</h2>
        <p className="text-gray-500 max-w-md">
          O módulo <strong>{title}</strong> ainda está sendo desenvolvido. Em breve você terá acesso a todas as funcionalidades desta área.
        </p>
      </div>
    </div>
  );
}
