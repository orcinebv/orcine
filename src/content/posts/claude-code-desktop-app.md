---
title: "Claude Code Desktop: De AI Coding Agent Verlaat de Terminal"
description: "Anthropic lanceert een standalone desktop app voor Claude Code. Visuele diff review, parallel sessions, live app preview, en GitHub PR monitoring — allemaal zonder terminal."
pubDate: 2026-02-28
---

Claude Code, Anthropic's agentic coding tool, is niet langer beperkt tot je terminal. Er is nu een **volledige desktop applicatie** beschikbaar voor macOS en Windows.

## Wat is Claude Code Desktop?

Claude Code Desktop is een standalone app die dezelfde engine draait als de CLI, maar dan met een grafische interface. Geen Node.js installatie nodig, geen terminal commando's — gewoon downloaden en coderen.

De app heeft drie tabs:
- **Chat**: Conversatie zonder file access (zoals claude.ai)
- **Cowork**: Autonome background agent die in een cloud VM draait
- **Code**: Interactieve coding assistant met directe toegang tot je lokale bestanden

## Waarom Dit Groot Is

### 1. Visuele Diff Review

In plaats van terminal output krijg je een echte diff view:
- Bekijk wijzigingen file-by-file
- Comment op specifieke regels
- Claude leest je comments en past aan
- Klik op "Review code" en Claude evalueert z'n eigen diffs

### 2. Parallel Sessions met Git Worktrees

Werk aan meerdere taken tegelijk, elk in een eigen Git worktree. Start een refactor in één session, fix een bug in een andere, en merge ze later.

### 3. Live App Preview

Run je dev server direct in de desktop app:
- Claude kan de draaiende app bekijken
- Test endpoints
- Inspecteer logs
- Itereer op basis van wat het ziet

### 4. GitHub PR Monitoring

Na het openen van een PR:
- Claude monitort CI check results
- Kan automatisch failures fixen
- Auto-merge wanneer alle checks slagen

### 5. Remote Sessions

Stuur lange taken naar de cloud zodat ze doorlopen als je de app sluit. Check later terug of ga verder op het web of in je IDE.

## Installatie

**macOS** (Intel en Apple Silicon):
```bash
# Download via de website of:
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows** (x64):
```powershell
irm https://claude.ai/install.ps1 | iex
```

Of download direct:
- [macOS](https://claude.ai/api/desktop/darwin/universal/dmg/latest)
- [Windows x64](https://claude.ai/api/desktop/win32/x64/exe/latest)
- [Windows ARM64](https://claude.ai/api/desktop/win32/arm64/exe/latest) (alleen remote sessions)

## Permission Modes

Je controleert hoeveel autonomie Claude krijgt:

| Mode | Gedrag |
|------|--------|
| **Ask permissions** (default) | Goedkeuring voor elke edit |
| **Auto accept edits** | Accepteer file edits automatisch |
| **Plan mode** | Claude plant zonder files aan te raken |

## CLI vs Desktop

Desktop en CLI draaien dezelfde engine en delen configuratie:
- CLAUDE.md files
- MCP servers
- Hooks
- Skills
- Settings

Je kunt beide tegelijk gebruiken op hetzelfde project.

## Recent Updates (v2.1.63)

De nieuwste versie brengt:
- `/simplify` en `/batch` slash commands
- HTTP hooks voor externe integraties
- Auto-memory die context automatisch opslaat
- Verbeterde MCP OAuth flow
- Memory leak fixes voor lange sessies
- VS Code: Session rename en remove acties

## Mijn Take

De desktop app is een logische stap. Niet iedereen wil in de terminal leven, en visuele diff review is gewoon beter voor het reviewen van grote changes. 

De parallel sessions feature is interessant voor grotere projecten — spin meerdere worktrees op en laat Claude parallel werken aan verschillende features.

De combinatie met GitHub PR monitoring maakt het bijna een volledige CI/CD companion: Claude opent de PR, monitort de checks, fixt failures, en merged automatisch.

## Links

- [Claude Code Docs](https://code.claude.com/docs/en/overview)
- [Desktop Quickstart](https://code.claude.com/docs/en/desktop-quickstart)
- [GitHub Repo](https://github.com/anthropics/claude-code)
- [Discord](https://anthropic.com/discord)

De toekomst van coding is hier — en het heeft een GUI. 🖥️
