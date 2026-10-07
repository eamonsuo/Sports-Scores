"use client"
import { searchSports } from "@/app/actions/searchSports"
import { Button } from "@/components/shadcn/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog"
import { Input } from "@/components/shadcn/input"
import { SPORT } from "@/types/misc"
import { Sofascore_SearchResult } from "@/types/sofascore"
import { Search } from "lucide-react"
import Link from "next/link"
import { FormEvent, useState, useTransition } from "react"

type SearchSportProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  sport: SPORT
}

export default function SearchSports({
  open,
  onOpenChange,
  sport,
}: SearchSportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<Sofascore_SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedSearchTerm = searchTerm.trim()
    if (!trimmedSearchTerm) return

    setError(null)
    startTransition(async () => {
      try {
        const response = await searchSports(sport, trimmedSearchTerm)
        setResults(response?.results ?? [])
      } catch {
        setResults([])
        setError("Unable to search right now.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-200">Search</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input
              aria-label="Search sports"
              autoFocus
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search teams, players, or tournaments"
              value={searchTerm}
            />
            <Button
              aria-label="Search"
              disabled={isPending || !searchTerm.trim()}
              size="icon"
              type="submit"
            >
              <Search />
            </Button>
          </form>

          {error && (
            <p className="text-destructive mt-3 text-sm" role="alert">
              {error}
            </p>
          )}

          {isPending && (
            <p className="text-muted-foreground mt-4 text-sm">Searching...</p>
          )}

          {!isPending && results.length > 0 && (
            <ul className="mt-4 space-y-2" aria-label="Search results">
              {results.map((result) => (
                <li
                  className="border-border rounded-md border p-3"
                  key={`${result.type}-${result.entity.id}`}
                >
                  <Link
                    href={`/sports/${sport}/${result.type}/${result.entity.id}`}
                    onClick={() => onOpenChange?.(false)}
                  >
                    <p className="text-foreground font-medium">
                      {result.entity.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {result.type === "player" && result.entity.team?.name
                        ? `${result.entity.team.name} - `
                        : ""}
                      {result.type === "uniqueTournament" &&
                      result.entity.category?.name
                        ? `${result.entity.category.name} - `
                        : ""}
                      {result.type}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!isPending &&
            !error &&
            searchTerm.trim() &&
            results.length === 0 && (
              <p className="text-muted-foreground mt-4 text-sm">
                No results found.
              </p>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
