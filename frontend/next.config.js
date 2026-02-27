const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable experimental features if needed
  experimental: {
    // appDir: true, // Already default in Next.js 14
  },
};

module.exports = withNextIntl(nextConfig);
