---
title: "Google Workspace Beheren met GAM en Claude Code"
description: "Combineer de kracht van GAM (Google Workspace CLI) met Claude Code voor geautomatiseerd domeinbeheer. Bulk user management, groepen, en rapportages — allemaal via natuurlijke taal."
pubDate: 2026-03-12
---

Als Google Workspace admin ken je het wel: honderden gebruikers beheren, groepslidmaatschappen updaten, of bulk-operaties uitvoeren via de Admin Console. Klikken, wachten, nog meer klikken. Er is een betere manier: **GAM** (Google Apps Manager) gecombineerd met **Claude Code**.

## Wat is GAM?

[GAM](https://github.com/GAM-team/GAM) is een command-line tool voor Google Workspace admins. Het biedt directe toegang tot vrijwel alle Admin SDK APIs zonder de web interface.

```bash
# Installatie (macOS/Linux)
bash <(curl -s -S -L https://gam-shortn.appspot.com/gam-install)

# Windows: download de MSI van GitHub Releases
```

Na installatie en OAuth setup kun je dingen doen als:

```bash
# Maak een nieuwe gebruiker
gam create user john.doe@company.com firstname John lastname Doe password 'TempPass123!'

# Voeg iemand toe aan een groep
gam update group sales@company.com add member john.doe@company.com

# Exporteer alle gebruikers naar CSV
gam print users > users.csv
```

## Waarom Claude Code + GAM?

Hier wordt het interessant. Claude Code kan:
- GAM commands uitvoeren via de terminal
- Complexe queries vertalen naar de juiste syntax
- Bulk operaties scripten op basis van natuurlijke taal
- Fouten analyseren en oplossen

### Voorbeeld: Bulk User Provisioning

In plaats van handmatig 50 nieuwe medewerkers aanmaken:

```
Maak gebruikers aan voor alle rijen in onboarding.csv. 
Voeg ze toe aan de groep all-staff@company.com en 
stuur een welkomstmail naar hun persoonlijke email.
```

Claude Code leest de CSV, genereert de GAM commands, en voert ze uit:

```bash
# Claude genereert en runt:
gam csv onboarding.csv gam create user ~email firstname ~firstname lastname ~lastname password ~temppass notify ~personal_email
gam update group all-staff@company.com add members users "~email"
```

### Voorbeeld: Audit & Rapportage

```
Geef me een overzicht van alle gebruikers die de laatste 30 dagen 
niet hebben ingelogd, gesorteerd op afdeling.
```

Claude Code bouwt de query:

```bash
gam print users fields lastLoginTime,orgUnitPath \
  | gam csv - matchfield lastLoginTime "^$|^Never$" print
```

### Voorbeeld: Groepsbeheer

```
Synchroniseer de marketing-team groep met alle gebruikers 
in de /Marketing OU, en verwijder iedereen die er niet meer hoort.
```

```bash
# Huidige leden ophalen
gam print group-members group marketing-team@company.com > current.csv

# Gebruikers in OU ophalen
gam print users query "orgUnitPath='/Marketing'" > expected.csv

# Claude analyseert de diff en genereert sync commands
gam update group marketing-team@company.com sync members file expected.csv
```

## Claude Code Desktop Workflow

Met de nieuwe [Claude Code Desktop app](/posts/claude-code-desktop-app) wordt dit nog makkelijker:

1. **Open een terminal session** in Claude Code Desktop
2. **Beschrijf wat je wilt** in natuurlijke taal
3. **Review de commands** voordat ze uitvoeren
4. **Bekijk de output** in de visuele interface

De desktop app geeft je:
- **Permission controls** — approve elke command
- **Output formatting** — mooie tabellen in plaats van raw CSV
- **History** — terug naar eerdere admin sessies
- **Parallel sessions** — meerdere admin taken tegelijk

## Best Practices

### 1. Gebruik Plan Mode voor Audits

```bash
claude --permission-mode plan
```

In Plan Mode analyseert Claude je Workspace configuratie zonder wijzigingen te maken. Perfect voor security audits.

### 2. Maak een CLAUDE.md voor Admin Taken

```markdown
# Workspace Admin Context

## GAM Configuratie
- Config path: ~/.gam/
- Primary domain: company.com
- Service account: gam@company.iam.gserviceaccount.com

## Standaard Groepen
- all-staff@company.com - Alle medewerkers
- managers@company.com - Alle managers

## Naming Conventions
- Users: voornaam.achternaam@company.com
- Groups: team-naam@company.com
```

### 3. Test met `--dry-run`

Vraag Claude om eerst een dry-run te doen:

```
Toon me welke commands je zou uitvoeren om alle 
inactieve gebruikers te suspenderen, maar voer ze nog niet uit.
```

## Geavanceerde Use Cases

### Offboarding Automatisering

```
Offboard gebruiker jan.jansen@company.com:
1. Suspend het account
2. Transfer Drive bestanden naar manager
3. Verwijder uit alle groepen
4. Forward email naar hr@company.com
5. Wipe mobile devices
```

Claude Code genereert het volledige offboarding script.

### License Management

```
Geef me een overzicht van alle Enterprise licenties 
en wie ze niet actief gebruikt (< 1 login per maand).
```

### Compliance Rapportages

```
Genereer een GDPR-compliant rapport van alle gebruikers 
met hun data locations en sharing settings.
```

## Links

- [GAM GitHub](https://github.com/GAM-team/GAM)
- [GAM Wiki](https://github.com/GAM-team/GAM/wiki)
- [Claude Code Docs](https://code.claude.com/docs)
- [Google Admin SDK](https://developers.google.com/workspace/admin)

## Conclusie

De combinatie van GAM en Claude Code transformeert Google Workspace beheer. Geen eindeloos klikken meer in de Admin Console, geen complexe API calls schrijven. Beschrijf wat je wilt in natuurlijke taal, en laat Claude de rest doen.

De echte kracht zit in de combinatie: GAM's complete API coverage + Claude's begrip van context en intentie + de veiligheid van permission-based execution.

Probeer het uit met een simpele query:

```bash
claude -p "list all Google Workspace users created this month using gam"
```

Happy automating! 🚀
