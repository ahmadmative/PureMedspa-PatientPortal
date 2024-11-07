/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add any external domains if needed
    unoptimized: true, // This can help with local images if you're having issues
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://stgwbclientapi.azurewebsites.net/:path*',
      },
    ];
  }
}

module.exports = nextConfig 