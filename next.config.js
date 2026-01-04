/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Allow external scripts and inline code
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://cdn.jsdelivr.net;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
