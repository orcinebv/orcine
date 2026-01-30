---
title: "Building AI Features with Azure OpenAI and NestJS"
description: "A practical guide to integrating Azure OpenAI services into a NestJS backend — from setup to streaming responses."
pubDate: 2025-01-02
---

Adding AI capabilities to your app doesn't have to be a science project. Here's how I wire up Azure OpenAI with NestJS to ship intelligent features fast.

## The Setup

Azure OpenAI gives you the same GPT models you know, but with enterprise-grade security, data residency, and SLA guarantees. For production apps, this matters.

```bash
npm install @azure/openai
```

Create a service that wraps the client:

```typescript
import { Injectable } from '@nestjs/common';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

@Injectable()
export class AiService {
  private client: OpenAIClient;

  constructor(private config: ConfigService) {
    this.client = new OpenAIClient(
      config.get('AZURE_OPENAI_ENDPOINT'),
      new AzureKeyCredential(config.get('AZURE_OPENAI_KEY')),
    );
  }

  async complete(prompt: string): Promise<string> {
    const result = await this.client.getChatCompletions(
      'gpt-4',
      [{ role: 'user', content: prompt }],
    );
    return result.choices[0]?.message?.content ?? '';
  }
}
```

## Streaming Responses

Nobody wants to stare at a spinner for 10 seconds. Stream the response:

```typescript
async *streamComplete(prompt: string): AsyncGenerator<string> {
  const events = await this.client.streamChatCompletions(
    'gpt-4',
    [{ role: 'user', content: prompt }],
  );

  for await (const event of events) {
    const delta = event.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
```

On the NestJS side, use Server-Sent Events:

```typescript
@Sse('chat/stream')
chatStream(@Query('prompt') prompt: string): Observable<MessageEvent> {
  return from(this.aiService.streamComplete(prompt)).pipe(
    map((chunk) => ({ data: chunk })),
  );
}
```

## Prompt Engineering Tips

After building several AI features, some patterns consistently work:

1. **Be specific about output format** — "Return JSON with keys: summary, tags, sentiment"
2. **Provide examples** — One-shot or few-shot prompting dramatically improves consistency
3. **Set guardrails in the system message** — "You are a helpful assistant for a project management tool. Only answer questions related to project management."
4. **Use temperature wisely** — 0 for factual extraction, 0.7+ for creative tasks

## Cost Management

Azure OpenAI bills per token. Track usage:

```typescript
const result = await this.client.getChatCompletions(/* ... */);
const usage = result.usage;
this.logger.log(`Tokens: ${usage.promptTokens} in, ${usage.completionTokens} out`);
```

Set up Azure Cost Alerts and consider implementing a token budget per user/tenant.

## What's Next

I'm exploring Azure AI Search (formerly Cognitive Search) for RAG patterns — grounding AI responses in your own data. That's where things get really interesting. Stay tuned.
