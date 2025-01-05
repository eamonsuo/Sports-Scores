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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/pgatour-prod/**",
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
