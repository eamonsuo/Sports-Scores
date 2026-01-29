/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // National Flags
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
      // Cricket Logos
      {
        protocol: "https",
        hostname: "static-files.cricket-australia.pulselive.com",
        port: "",
        pathname: "/flag/**",
      },
      // ABL Logos
      {
        protocol: "https",
        hostname: "assets.baseball.com.au",
        port: "",
        pathname: "/uploads/**",
      },
      // ESPN logos
      {
        protocol: "https",
        hostname: "a.espncdn.com",
        port: "",
        pathname: "/combiner/**",
      },
      // Wikipedia logos
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
};

export default nextConfig;
