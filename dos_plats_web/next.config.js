// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['es', 'ca', 'en'],
    defaultLocale: 'es',
  },
};

module.exports = nextConfig;
