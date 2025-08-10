// @ts-check
import nextI18NextConfig from './next-i18next.config.js';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: nextI18NextConfig.i18n,
  images: {
    unoptimized: true
  }
};
export default nextConfig;
