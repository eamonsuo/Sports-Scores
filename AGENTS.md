# AGENTS.md

Instructions for AI coding agents working in this repository.

## Scope and Working Directory

- Primary app lives in [sports-scores](sports-scores).
- Run Node and Next.js commands from [sports-scores](sports-scores).
- Root-level workflows live in [.github/workflows](.github/workflows).

## Quick Start Commands

From [sports-scores](sports-scores):

- npm run dev
- npm run build
- npm start
- npm run lint

Notes:

- Dev script runs with TZ=UTC.
- This workspace prefers cmd terminal (see repository memory).

## Project Shape

- App Router pages and route handlers: [sports-scores/src/app](sports-scores/src/app)
- Reusable UI by domain: [sports-scores/src/components](sports-scores/src/components)
- External data fetchers: [sports-scores/src/endpoints](sports-scores/src/endpoints)
- Domain service layer: [sports-scores/src/services](sports-scores/src/services)
- Shared utilities and routing map: [sports-scores/src/lib](sports-scores/src/lib)
- Shared and sport-specific types: [sports-scores/src/types](sports-scores/src/types)
- Dataverse upload and matrix tooling: [sports-scores/scripts](sports-scores/scripts)

## Core Conventions

- Keep sport-specific logic in the service + endpoint + type trio:
  - [sports-scores/src/services](sports-scores/src/services)
  - [sports-scores/src/endpoints](sports-scores/src/endpoints)
  - [sports-scores/src/types](sports-scores/src/types)
- Register new sports/leagues in:
  - [sports-scores/src/lib/constants.ts](sports-scores/src/lib/constants.ts)
  - [sports-scores/src/lib/routeConfig.ts](sports-scores/src/lib/routeConfig.ts)
- Reuse the shared service contract in [sports-scores/src/types/misc.ts](sports-scores/src/types/misc.ts).
- Prefer existing mapping helpers in [sports-scores/src/lib/eventMapping.ts](sports-scores/src/lib/eventMapping.ts), [sports-scores/src/lib/imageMapping.ts](sports-scores/src/lib/imageMapping.ts), and [sports-scores/src/lib/projUtils.ts](sports-scores/src/lib/projUtils.ts).
- Keep route slugs aligned with SPORT enum values in [sports-scores/src/types/misc.ts](sports-scores/src/types/misc.ts).

## Data and Integration Notes

- Sofascore-style services commonly extend [sports-scores/src/services/sofascore.service.ts](sports-scores/src/services/sofascore.service.ts).
- Dataverse supplement data is handled in [sports-scores/src/services/dataverse.service.ts](sports-scores/src/services/dataverse.service.ts).
- Dev API response caching wrapper is in [sports-scores/src/lib/devCache.ts](sports-scores/src/lib/devCache.ts) and writes to .dev-cache when DEV_MODE is set.
- Scheduled and manual bulk uploads are orchestrated by [.github/workflows/bulk-upload-latest-events.yml](.github/workflows/bulk-upload-latest-events.yml) and [sports-scores/scripts/bulk-upload-events.ts](sports-scores/scripts/bulk-upload-events.ts).

## Agent Guardrails

- Do not move files between root and [sports-scores](sports-scores) unless explicitly requested.
- Keep changes localized by sport/domain where possible.
- Avoid broad refactors when adding one league, route, or API integration.
- Preserve existing naming style (kebab-case files for services/endpoints, PascalCase component symbols).
- Validate by running lint for touched app code when feasible.

## Existing Documentation to Link

- Project overview: [README.md](README.md)
- App-level baseline README: [sports-scores/README.md](sports-scores/README.md)
- Dataverse/script workflows: [sports-scores/scripts/README.md](sports-scores/scripts/README.md)
- Existing reusable chat prompt: [sports-scores/.github/prompts/scrape-schedule.prompt.md](sports-scores/.github/prompts/scrape-schedule.prompt.md)

## High-Value Next Customizations

- Create a file-scoped instruction for services and endpoints at .github/instructions/services-endpoints.instructions.md to enforce service-interface and endpoint-wrapper patterns.
- Create a prompt at .github/prompts/add-sport.prompt.md for the repeatable add-new-sport workflow (constants, route config, service, endpoint, types, and page wiring checklist).
- Create a prompt at .github/prompts/update-upload-matrix.prompt.md to safely update matrix JSON plus workflow league choices via scripts/generate-matrix.ts.