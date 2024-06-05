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
        ],
      },
};

export default nextConfig;