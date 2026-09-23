import 'server-only';

interface Dictionaries {
    [key: string]: () => Promise<any>;
}

const dictionaries: Dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default ?? module),
  'pt-BR': () => import('@/dictionaries/pt-BR.json').then((module) => module.default ?? module),
  es: () => import('@/dictionaries/es.json').then((module) => module.default ?? module),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
};
