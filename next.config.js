/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove export output for development mode
  // output: 'export',
  // distDir: 'dist',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Fix for font error - must be a leading slash or absolute URL
  basePath: '',
  assetPrefix: '/',
  trailingSlash: true,
};

module.exports = nextConfig;
