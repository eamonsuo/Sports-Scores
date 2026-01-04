/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sportmonks.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.api-sports.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "p.imgci.com",
        port: "",
        pathname: "/db/PICTURES/CMS/**",
      },
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
      // A-League logos
      {
        protocol: "https",
        hostname: "aleagues.com.au",
        port: "",
        pathname: "/wp-content/themes/keepup/source/images/club-logos/**",
      },
      // Premier League logos
      {
        protocol: "https",
        hostname: "resources.premierleague.com",
        port: "",
        pathname: "/premierleague25/**",
      },
      // NBL, NBA logos
      {
        protocol: "https",
        hostname: "a.espncdn.com",
        port: "",
        pathname: "/combiner/**",
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
