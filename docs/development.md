# Development Guide

This guide covers local setup, running, testing, and debugging.

Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or use Docker Compose)
- A Telegram bot token

Install dependencies

```
npm ci
```

Set environment

- Create `.env` with `DATABASE_URL` and `TELEGRAM_BOT_TOKEN` (see configuration.md).

Run migrations

```
npm run migration:run
```

Start the bot (watch mode)

```
npm run start:dev
```

Build and run production locally

```
npm run build
npm run start:prod
```

Testing

```
npm test          # Unit tests
npm run test:e2e  # E2E tests
```

Note: The E2E test scaffold expects an HTTP endpoint at `/`, but this app boots a non-HTTP context (`src/main.ts:1`). Either adjust the test or add a minimal HTTP controller if desired.

Debugging tips

- Increase logging by keeping `logger: ['error','warn','debug','log','verbose']` (default in `src/main.ts:1`).
- Inspect TypeORM SQL: logging is `'all'` by default in `src/data-source.ts:1`.
- Telegraf logs are standard console output; consider wrapping `this.bot.telegram.sendMessage` calls in try/catch for verbose output.

Common scripts

- `npm run lint` — Lints and auto-fixes.
- `npm run format` — Formats with Prettier.
- `npm run migration:generate` — Generates migrations based on entity diffs.

