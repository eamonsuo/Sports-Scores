/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 604800, // 7 days
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
        pathname: "/**",
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
      // The Sports DB images
      {
        protocol: "https",
        hostname: "www.thesportsdb.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "r2.thesportsdb.com",
        port: "",
        pathname: "/images/**",
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
