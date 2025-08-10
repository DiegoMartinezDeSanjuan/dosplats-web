module.exports = {
  i18n: {
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'es',
    locales: ['es', 'ca', 'en'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
