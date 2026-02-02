---
title: "Clawdbot: My Personal AI Assistant That Lives in My Terminal"
description: "How I set up Clawdbot as my always-on AI companion — connected to Telegram, managing my server, building websites, and handling voice messages."
pubDate: 2026-02-02
---

A few days ago I discovered [Clawdbot](https://github.com/openclaw/openclaw) (now OpenClaw) — an open-source personal AI assistant you run on your own server. After spending a weekend setting it up, I can honestly say: this is what AI assistants should feel like.

## What is Clawdbot?

Clawdbot is a self-hosted AI gateway that connects to the messaging platforms you already use — Telegram, WhatsApp, Discord, Signal, Slack, iMessage, and more. It's not a chatbot in a browser tab. It's an always-on assistant that lives where you live: in your pocket.

The architecture is simple:

```
Your phone (Telegram/WhatsApp/etc.)
    ↓
Gateway (your server)
    ↓
AI Model (Claude, GPT-4, etc.)
    ↓
Tools, Skills, Automations
```

You send a message. It responds. But unlike ChatGPT or other web-based tools, it has access to your server, your files, your tools — and it remembers you across sessions.

## Why I Love It

### It actually does things

This isn't a chatbot that gives you advice and wishes you luck. I asked Clawdbot to run a security audit on my server. It checked open ports, SSH config, firewall status, and pending updates. Then it hardened SSH, installed fail2ban, and ran all updates — including a kernel upgrade with reboot.

All from a Telegram message.

### Voice messages work

I can send voice notes in Dutch, and it transcribes them using Whisper, understands the request, and responds — sometimes even with a voice message back using ElevenLabs TTS. It feels natural.

### It builds things

I asked it to build me a personal website. It scaffolded an Astro project, wrote blog posts, configured GitHub Actions for deployment, and pushed it to GitHub Pages — all while I watched from Telegram. When I wanted changes (different font, dark mode toggle, photo on the about page), I just told it and it pushed the updates.

### Skills are extensible

Clawdbot has a skill system. Need a resume builder? Install it from ClawdHub. Need weather? There's a skill for that. GitHub integration? Just add your token and you've got full repo management from your chat app.

## My Setup

Here's what my Clawdbot setup looks like:

- **Server:** Ubuntu 24.04 VPS
- **Channel:** Telegram (@Orcinebot)
- **Model:** Claude Opus 4.5 via Anthropic
- **Skills:** Whisper transcription, ElevenLabs TTS, GitHub CLI, weather, resume builder
- **Workspace:** `/root/clawd` with memory files, daily notes, and project files

The whole thing runs as a systemd service. It starts on boot, reconnects automatically, and has been rock solid.

## The Memory System

What sets Clawdbot apart from other AI tools is its memory architecture. It maintains:

- **SOUL.md** — personality and behavior rules
- **USER.md** — info about you (timezone, preferences, tech stack)
- **MEMORY.md** — long-term curated memories
- **Daily notes** — raw logs of what happened each day

Every session, it reads these files and picks up where it left off. It's not perfect memory, but it's effective. It knows my name, my stack, my timezone, and what we worked on last time.

## Privacy First

Everything runs on your own infrastructure. Your messages, your API keys, your data — none of it goes through a third party (beyond the AI model API itself). If you use a local model via Ollama, it's fully private.

## Getting Started

If you want to try it:

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

The wizard walks you through everything: model setup, channel configuration, workspace creation. It took me about 15 minutes from zero to a working Telegram bot.

## The Bottom Line

Clawdbot turned my VPS into a personal AI assistant that I talk to throughout the day. It's not a toy — it manages my server, builds my projects, and handles tasks I'd normally SSH in for. The fact that it all happens from Telegram makes it feel effortless.

If you're a developer who wants an AI assistant that actually integrates into your workflow instead of living in a separate browser tab, give it a try. You won't go back.
