---
title: "Integrating Azure AI Services in NestJS"
description: "A hands-on guide to using Azure OpenAI, AI Search, and Document Intelligence in your NestJS backend."
pubDate: 2026-01-20
---

Azure AI services pair naturally with NestJS. Here's how I've been integrating them in production apps.

## Setting Up the Azure OpenAI Module

First, create a dedicated module. NestJS's dependency injection makes it clean:

```typescript
// azure-ai.module.ts
@Module({
  providers: [
    {
      provide: 'AZURE_OPENAI_CLIENT',
      useFactory: () => {
        return new AzureOpenAI({
          endpoint: process.env.AZURE_OPENAI_ENDPOINT,
          apiKey: process.env.AZURE_OPENAI_KEY,
          apiVersion: '2024-10-21',
        });
      },
    },
    AzureAiService,
  ],
  exports: [AzureAiService],
})
export class AzureAiModule {}
```

## Streaming Responses with SSE

For chat features, Server-Sent Events give you that ChatGPT-like streaming experience:

```typescript
@Controller('ai')
export class AiController {
  constructor(private aiService: AzureAiService) {}

  @Post('chat')
  @Sse()
  async chat(@Body() dto: ChatDto): Promise<Observable<MessageEvent>> {
    return new Observable((subscriber) => {
      this.aiService.streamChat(dto.messages).then(async (stream) => {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            subscriber.next({ data: JSON.stringify({ content }) });
          }
        }
        subscriber.complete();
      });
    });
  }
}
```

## Azure AI Search for RAG

The real power comes when you combine Azure OpenAI with Azure AI Search:

```typescript
async searchAndAnswer(query: string): Promise<string> {
  // 1. Search relevant documents
  const searchResults = await this.searchClient.search(query, {
    queryType: 'semantic',
    semanticSearchOptions: {
      configurationName: 'my-semantic-config',
    },
    top: 5,
  });

  // 2. Build context from results
  const context = searchResults.results
    .map(r => r.document.content)
    .join('\n\n');

  // 3. Generate answer with context
  const response = await this.openaiClient.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: `Answer based on this context:\n${context}` },
      { role: 'user', content: query },
    ],
  });

  return response.choices[0].message.content;
}
```

## Document Intelligence for PDF Processing

Azure Document Intelligence (formerly Form Recognizer) is incredible for extracting structured data from PDFs:

```typescript
async processInvoice(fileBuffer: Buffer): Promise<InvoiceData> {
  const poller = await this.diClient.beginAnalyzeDocument(
    'prebuilt-invoice',
    fileBuffer
  );
  const result = await poller.pollUntilDone();
  
  return {
    vendor: result.documents[0].fields.VendorName?.content,
    total: result.documents[0].fields.InvoiceTotal?.value,
    date: result.documents[0].fields.InvoiceDate?.value,
    lineItems: result.documents[0].fields.Items?.values.map(item => ({
      description: item.fields.Description?.content,
      amount: item.fields.Amount?.value,
    })),
  };
}
```

## Error Handling & Retry

Azure services can be flaky. Always add retry logic:

```typescript
// Use the built-in NestJS retry with rxjs
import { retry, timer } from 'rxjs';

this.aiService.generateResponse(prompt).pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => timer(retryCount * 1000),
  })
);
```

## Cost Management

Azure AI costs add up fast. Three tips:
1. **Cache embeddings** — don't re-embed unchanged documents
2. **Use GPT-4o-mini** for classification and simple tasks, GPT-4o for complex reasoning
3. **Set token limits** — always pass `max_tokens` to prevent runaway costs

The NestJS + Azure AI combo is production-solid. The DI system keeps your AI services testable and the modular architecture makes it easy to swap providers later.
