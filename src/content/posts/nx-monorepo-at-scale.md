---
title: "Nx Monorepo at Scale: Lessons from the Trenches"
description: "Hard-won lessons from managing a large Nx monorepo with multiple Angular apps, NestJS services, and shared libraries."
pubDate: 2024-12-18
---

We've been running an Nx monorepo with 12 apps and 40+ libraries for over a year now. Here's what works, what hurts, and what I wish I'd known from day one.

## Why Monorepo?

The pitch is simple: **shared code without the npm publish dance**. When your Angular frontend and NestJS backend share TypeScript interfaces, a monorepo eliminates an entire class of bugs.

```
apps/
  web-app/          # Angular frontend
  admin-panel/      # Angular admin
  api/              # NestJS backend
  worker/           # Background jobs
libs/
  shared/dto/       # Shared interfaces
  shared/utils/     # Common utilities
  ui/components/    # Angular component library
  api/auth/         # Auth module
  api/database/     # Database module
```

## The Module Boundary Rules

This is the single most important Nx feature. Without it, monorepos become spaghetti repos.

```json
// .eslintrc.json
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          { "sourceTag": "type:app", "onlyDependOnLibsWithTags": ["type:lib", "type:util"] },
          { "sourceTag": "type:api", "onlyDependOnLibsWithTags": ["type:lib", "scope:api"] },
          { "sourceTag": "scope:web", "onlyDependOnLibsWithTags": ["scope:web", "scope:shared"] }
        ]
      }
    ]
  }
}
```

These rules saved us from circular dependencies at least a dozen times.

## Caching is Everything

Nx's computation caching is the difference between a 20-minute CI pipeline and a 3-minute one.

```bash
# Local cache hit
nx build web-app  # 1.2s (cached)

# Remote cache with Nx Cloud
nx affected --target=test  # Only tests what changed
```

Enable Nx Cloud early. The free tier is generous and the speed improvement is transformative.

## Code Generation

Don't hand-write boilerplate. Custom generators are a game-changer:

```bash
nx generate @nx/angular:component --name=feature-card --project=ui-components
nx generate @nx/nest:resource --name=products --project=api
```

We wrote custom generators for our common patterns — new feature modules, API resources with full CRUD, shared DTOs. New features now take minutes to scaffold instead of hours.

## Pain Points

Not everything is sunshine:

- **IDE performance degrades** with 50+ projects. VS Code needs `"typescript.tsserver.maxTsServerMemory": 4096`
- **Dependency updates** are all-or-nothing. When you bump Angular, every app gets it
- **New developer onboarding** takes longer — there's more to understand upfront
- **The Nx daemon** occasionally gets confused. `nx reset` is your friend

## The Verdict

Despite the pain points, I'd choose Nx monorepo again in a heartbeat. The consistency, code sharing, and affected commands make it worthwhile. Just invest in module boundaries and caching from day one.
