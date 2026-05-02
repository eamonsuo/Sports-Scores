import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".dev-cache");

function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCacheFilePath(sportName: string, endpointName: string): string {
  return path.join(CACHE_DIR, `${sportName}_${endpointName}.json`);
}

export function withDevCache<T extends (...args: any[]) => Promise<any>>(
  sportName: string,
  endpointName: string,
  fetchFn: T,
): T {
  if (!process.env.DEV_MODE) {
    return fetchFn;
  }

  const wrapped = (async (...args: any[]) => {
    const cacheFile = getCacheFilePath(sportName, endpointName);

    try {
      if (existsSync(cacheFile)) {
        const cached = JSON.parse(readFileSync(cacheFile, "utf-8"));
        console.log(`🚨 [DevCache] HIT: ${sportName}_${endpointName}`);
        return cached;
      }
    } catch {
      // Cache read failed, fall through to real API call
    }

    console.log(`🚨 [DevCache] MISS (caching): ${sportName}_${endpointName}`);
    const result = await fetchFn(...args);

    try {
      ensureCacheDir();
      writeFileSync(cacheFile, JSON.stringify(result, null, 2), "utf-8");
    } catch (e) {
      console.warn(
        `🚨 [DevCache] Failed to write cache for ${sportName}_${endpointName}:`,
        e,
      );
    }

    return result;
  }) as unknown as T;

  return wrapped;
}
