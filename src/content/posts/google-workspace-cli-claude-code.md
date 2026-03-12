---
title: "Managing Google Workspace with GAM and Claude Code"
description: "Combine the power of GAM (Google Workspace CLI) with Claude Code for automated domain management. Bulk user operations, groups, and reporting — all through natural language."
pubDate: 2026-03-12
---

As a Google Workspace admin, you know the drill: managing hundreds of users, updating group memberships, running bulk operations through the Admin Console. Click, wait, click some more. There's a better way: **GAM** (Google Apps Manager) combined with **Claude Code**.

## What is GAM?

[GAM](https://github.com/GAM-team/GAM) is a command-line tool for Google Workspace admins. It provides direct access to virtually all Admin SDK APIs without the web interface.

```bash
# Installation (macOS/Linux)
bash <(curl -s -S -L https://gam-shortn.appspot.com/gam-install)

# Windows: download the MSI from GitHub Releases
```

After installation and OAuth setup, you can do things like:

```bash
# Create a new user
gam create user john.doe@company.com firstname John lastname Doe password 'TempPass123!'

# Add someone to a group
gam update group sales@company.com add member john.doe@company.com

# Export all users to CSV
gam print users > users.csv
```

## Why Claude Code + GAM?

This is where it gets interesting. Claude Code can:
- Execute GAM commands via the terminal
- Translate complex queries into the right syntax
- Script bulk operations based on natural language
- Analyze and fix errors

### Example: Bulk User Provisioning

Instead of manually creating 50 new employees:

```
Create users for all rows in onboarding.csv. 
Add them to the all-staff@company.com group and 
send a welcome email to their personal email.
```

Claude Code reads the CSV, generates the GAM commands, and executes them:

```bash
# Claude generates and runs:
gam csv onboarding.csv gam create user ~email firstname ~firstname lastname ~lastname password ~temppass notify ~personal_email
gam update group all-staff@company.com add members users "~email"
```

### Example: Audit & Reporting

```
Give me an overview of all users who haven't logged in 
during the last 30 days, sorted by department.
```

Claude Code builds the query:

```bash
gam print users fields lastLoginTime,orgUnitPath \
  | gam csv - matchfield lastLoginTime "^$|^Never$" print
```

### Example: Group Management

```
Sync the marketing-team group with all users 
in the /Marketing OU, and remove anyone who no longer belongs.
```

```bash
# Get current members
gam print group-members group marketing-team@company.com > current.csv

# Get users in OU
gam print users query "orgUnitPath='/Marketing'" > expected.csv

# Claude analyzes the diff and generates sync commands
gam update group marketing-team@company.com sync members file expected.csv
```

## Claude Code Desktop Workflow

With the new [Claude Code Desktop app](/posts/claude-code-desktop-app), this becomes even easier:

1. **Open a terminal session** in Claude Code Desktop
2. **Describe what you want** in natural language
3. **Review the commands** before execution
4. **View the output** in the visual interface

The desktop app gives you:
- **Permission controls** — approve each command
- **Output formatting** — clean tables instead of raw CSV
- **History** — return to previous admin sessions
- **Parallel sessions** — multiple admin tasks at once

## Best Practices

### 1. Use Plan Mode for Audits

```bash
claude --permission-mode plan
```

In Plan Mode, Claude analyzes your Workspace configuration without making changes. Perfect for security audits.

### 2. Create a CLAUDE.md for Admin Tasks

```markdown
# Workspace Admin Context

## GAM Configuration
- Config path: ~/.gam/
- Primary domain: company.com
- Service account: gam@company.iam.gserviceaccount.com

## Standard Groups
- all-staff@company.com - All employees
- managers@company.com - All managers

## Naming Conventions
- Users: firstname.lastname@company.com
- Groups: team-name@company.com
```

### 3. Test with Dry Runs

Ask Claude to do a dry run first:

```
Show me which commands you would execute to suspend 
all inactive users, but don't run them yet.
```

## Advanced Use Cases

### Offboarding Automation

```
Offboard user john.smith@company.com:
1. Suspend the account
2. Transfer Drive files to manager
3. Remove from all groups
4. Forward email to hr@company.com
5. Wipe mobile devices
```

Claude Code generates the complete offboarding script.

### License Management

```
Give me an overview of all Enterprise licenses 
and who isn't actively using them (< 1 login per month).
```

### Compliance Reporting

```
Generate a GDPR-compliant report of all users 
with their data locations and sharing settings.
```

## Links

- [GAM GitHub](https://github.com/GAM-team/GAM)
- [GAM Wiki](https://github.com/GAM-team/GAM/wiki)
- [Claude Code Docs](https://code.claude.com/docs)
- [Google Admin SDK](https://developers.google.com/workspace/admin)

## Conclusion

The combination of GAM and Claude Code transforms Google Workspace management. No more endless clicking in the Admin Console, no complex API calls to write. Describe what you want in natural language, and let Claude handle the rest.

The real power lies in the combination: GAM's complete API coverage + Claude's understanding of context and intent + the safety of permission-based execution.

Try it with a simple query:

```bash
claude -p "list all Google Workspace users created this month using gam"
```

Happy automating! 🚀
