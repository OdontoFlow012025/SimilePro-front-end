import 'server-only';

interface Dictionaries {
    [key: string]: () => Promise<any>;
}

const dictionaries: Dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  'pt-BR': () => import('@/dictionaries/pt-BR.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
};
