/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.sportmonks.com',
            port: '',
            pathname: '/images/**',
          },
          {
            protocol: 'https',
            hostname: 'media.api-sports.io',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;