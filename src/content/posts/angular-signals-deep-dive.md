---
title: "Angular Signals: A Deep Dive into Reactive State"
description: "Exploring Angular's new Signals API and how it transforms the way we think about reactivity in modern Angular applications."
pubDate: 2025-01-15
---

Angular Signals have fundamentally changed how we approach state management in Angular apps. After months of building production features with them, here's what I've learned.

## Why Signals Matter

The old change detection story in Angular was always... complex. Zone.js monkey-patching every async operation, components re-rendering when they didn't need to, and developers reaching for `OnPush` as a band-aid.

Signals flip the model. Instead of Angular guessing what changed, **you tell it exactly what changed**. It's explicit, predictable, and fast.

```typescript
import { signal, computed, effect } from '@angular/core';

const count = signal(0);
const doubled = computed(() => count() * 2);

effect(() => {
  console.log(`Count is ${count()}, doubled is ${doubled()}`);
});

count.set(5); // logs: Count is 5, doubled is 10
```

## Signals in Practice

The real power shows up in component architecture. Consider a dashboard that pulls data from multiple sources:

```typescript
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="metrics">
      <app-metric [value]="totalRevenue()" label="Revenue" />
      <app-metric [value]="activeUsers()" label="Active Users" />
      <app-metric [value]="conversionRate()" label="Conversion" />
    </div>
  `,
})
export class DashboardComponent {
  private analytics = inject(AnalyticsService);

  totalRevenue = computed(() => this.analytics.revenue().total);
  activeUsers = computed(() => this.analytics.users().active);
  conversionRate = computed(() => {
    const users = this.activeUsers();
    const conversions = this.analytics.conversions();
    return users > 0 ? (conversions / users * 100).toFixed(1) : '0';
  });
}
```

Each `computed` only recalculates when its dependencies actually change. No wasted cycles.

## Migrating from RxJS

You don't have to ditch RxJS entirely. The `toSignal()` and `toObservable()` bridges make gradual adoption painless:

```typescript
// Convert an Observable to a Signal
const data = toSignal(this.http.get('/api/data'), { initialValue: [] });

// Convert a Signal to an Observable
const data$ = toObservable(mySignal);
```

My rule of thumb: **use Signals for synchronous state, RxJS for async streams**. They complement each other beautifully.

## What I'd Like to See Next

- Signal-based forms (the RFC looks promising)
- Better DevTools integration for signal graphs
- Signal queries for `@ViewChild` and friends (already landing!)

Signals aren't just a new API — they're a shift in Angular's mental model. The sooner you internalize it, the better your apps will be.
