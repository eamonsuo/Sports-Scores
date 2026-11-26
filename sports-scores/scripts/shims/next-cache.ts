// No-op replacement for "next/cache" when running scripts with tsx outside the
// Next.js runtime, where cacheLife/cacheTag would otherwise throw.
// Wired up via the "paths" mapping in scripts/tsconfig.json.

export function cacheLife(..._args: unknown[]): void {}
export function cacheTag(..._tags: string[]): void {}
export function revalidateTag(..._args: unknown[]): void {}
export function revalidatePath(..._args: unknown[]): void {}
export function updateTag(..._args: unknown[]): void {}
export function refresh(): void {}
export function unstable_noStore(): void {}
export function unstable_cache<T extends (...args: any[]) => any>(fn: T): T {
  return fn
}
