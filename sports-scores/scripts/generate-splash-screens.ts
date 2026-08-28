/**
 * Generates iOS PWA splash screens into /public/splash.
 *
 * Composites the app logo onto a solid background at every device resolution
 * listed in src/lib/appleSplashScreens.ts (portrait + landscape).
 *
 * Usage: npm run generate:splash
 */

import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";
import sharp from "sharp";

import {
    APPLE_SPLASH_IMAGES,
    SPLASH_BACKGROUND,
} from "@/lib/appleSplashScreens";

const LOGO_PATH = resolve(__dirname, "../public/sportsscoreslogo.png")
const OUTPUT_DIR = resolve(__dirname, "../public/splash")

/** Logo occupies this fraction of the shortest screen edge. */
const LOGO_SCALE = 0.4

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })
  const logo = await sharp(LOGO_PATH).png().toBuffer()

  for (const { url, pixels } of APPLE_SPLASH_IMAGES) {
    const logoSize = Math.round(Math.min(pixels.width, pixels.height) * LOGO_SCALE)
    const resizedLogo = await sharp(logo)
      .resize(logoSize, logoSize, { fit: "contain", background: "#00000000" })
      .toBuffer()

    const image = await sharp({
      create: {
        width: pixels.width,
        height: pixels.height,
        channels: 4,
        background: SPLASH_BACKGROUND,
      },
    })
      .composite([{ input: resizedLogo, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toBuffer()

    await writeFile(resolve(OUTPUT_DIR, url.replace("/splash/", "")), image)
    console.log(`${url} (${pixels.width}x${pixels.height})`)
  }

  console.log(`\nGenerated ${APPLE_SPLASH_IMAGES.length} splash screens.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
