const i18nConfig = {
    locales: ['en', 'pt-BR', 'es'],
    defaultLocale: 'pt-BR',
    prefixDefault: true, // Optional: to have /en/path for default locale too if desired, or false. Usually false for default.
    serverSetCookie: 'always'
};

module.exports = i18nConfig;
