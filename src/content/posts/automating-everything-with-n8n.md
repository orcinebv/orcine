---
title: "Automating Everything with n8n: Beyond Simple Workflows"
description: "How I use n8n to automate deployments, notifications, data pipelines, and more — with practical examples you can steal."
pubDate: 2024-11-28
---

n8n is the automation tool I didn't know I needed. Self-hosted, open-source, and wildly flexible. Here's how it became the glue that holds our dev operations together.

## Why n8n Over Zapier?

Three words: **self-hosted and free**. Plus:

- You own your data — nothing leaves your infrastructure
- No per-task pricing that punishes success
- Custom code nodes when visual logic isn't enough
- The community nodes ecosystem is massive

## Workflow 1: Deploy Notifications

Every push to `main` triggers a GitHub webhook → n8n → Slack notification with build status:

```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "github-deploy",
        "httpMethod": "POST"
      }
    },
    {
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [{
            "value1": "={{ $json.action }}",
            "operation": "equals",
            "value2": "completed"
          }]
        }
      }
    },
    {
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#deployments",
        "text": "🚀 Deploy {{ $json.deployment.environment }}: {{ $json.deployment.status }}"
      }
    }
  ]
}
```

## Workflow 2: Automated PR Reviews

When a PR is opened, n8n fetches the diff, sends it to Azure OpenAI for analysis, and posts a review summary as a comment:

1. **GitHub Webhook** — PR opened event
2. **HTTP Request** — Fetch the diff via GitHub API
3. **Azure OpenAI** — Analyze code changes
4. **GitHub** — Post review comment

The AI catches things like missing error handling, inconsistent naming, and potential security issues. It's not a replacement for human review, but it's a great first pass.

## Workflow 3: Data Pipeline

Every morning at 6 AM:

1. Pull analytics from multiple sources (Plausible, Stripe, custom API)
2. Transform and aggregate in a Code node
3. Push to a Google Sheet for the team
4. Send a Slack summary with key metrics

```javascript
// Code node: aggregate metrics
const analytics = $input.first().json;
const stripe = $input.last().json;

return [{
  json: {
    date: new Date().toISOString().split('T')[0],
    pageViews: analytics.visitors,
    revenue: stripe.amount / 100,
    mrr: stripe.mrr / 100,
    churn: stripe.churn_rate,
  }
}];
```

## Tips for Production n8n

- **Use environments** — separate dev and prod n8n instances
- **Version your workflows** — export JSON and commit to git
- **Error handling** — always add an Error Trigger workflow that alerts you
- **Credentials** — use environment variables, never hardcode
- **Execution data** — prune old executions to keep the database lean

## The Big Picture

n8n isn't just an automation tool — it's an integration platform. It bridges the gap between services that don't natively talk to each other. Combined with custom code nodes and AI, it becomes remarkably powerful.

If you're still manually doing repetitive tasks, stop. Automate it with n8n.
