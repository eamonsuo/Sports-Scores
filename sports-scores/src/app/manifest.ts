import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sports Scores",
    short_name: "SportsScores",
    description: "An app to track results for all your sports",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "icon.ico",
        sizes: "192x192",
        type: "image/vnd.microsoft.icon",
      },
      {
        src: "icon.ico",
        sizes: "512x512",
        type: "image/vnd.microsoft.icon",
      },
      {
        src: "apple-icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
