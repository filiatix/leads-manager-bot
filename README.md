# Leads Manager Bot

A NestJS-powered Telegram bot for capturing leads via a conversational wizard and broadcasting new-lead notifications to all registered users. It uses TypeORM with PostgreSQL for persistence and Telegraf (via `nestjs-telegraf`) for the Telegram integration.

For deeper, topic-focused documentation, see the `docs/` folder:
- docs/README.md

## Table of Contents

- Features
- Architecture
- Getting Started
- Running with Docker
- Database & Migrations
- Bot Usage
- Configuration
- Scripts
- Project Structure
- Testing
- Troubleshooting
- Notes & Limitations

## Features

- Telegram bot with `/start` and `/createLead` commands
- Multi-step wizard to collect lead data (email, phone, first/last name, country ISO)
- Persists Users, Leads, Messages to PostgreSQL with TypeORM
- Periodic job (every 30s) scans unsent Messages and sends lead notifications to users
- Clean, modular NestJS design with dedicated modules for bot, users, leads, and messages

## Architecture

- Core entrypoint: `src/main.ts:1`
  - Bootstraps a Nest application context and wires modules.
- App module: `src/app.module.ts:1`
  - Loads environment via `@nestjs/config`.
  - Configures TypeORM via `src/data-source.ts:1` using `DATABASE_URL`.
  - Imports `BotModule`, `UsersModule`, `LeadsModule`, `MessagesModule`.
- Bot module: `src/bot/bot.module.ts:1`
  - Configures Telegraf bot with `TELEGRAM_BOT_TOKEN` and enables session middleware.
  - Provides `BotUpdate` (handlers/cron) and `LeadWizard` (multi-step lead flow).
- Update handlers: `src/bot/bot.update.ts:1`
  - `/start`: registers the Telegram user in DB.
  - `/createLead`: enters the add-lead wizard.
  - Cron job (every 30s): fetches pending `Message` records and sends notifications.
- Lead wizard: `src/bot/wizard/lead.wizard.ts:1`
  - Guides user through fields; validates using `class-validator`.
  - Creates a `Lead` and schedules `Message`s to all active users upon success.
- Data layer:
  - Entities: `src/leads/leads.entity.ts:1`, `src/users/users.entity.ts:1`, `src/messages/messages.entity.ts:1`
  - Services: `src/leads/leads.service.ts:1`, `src/users/users.service.ts:1`, `src/messages/messages.service.ts:1`
  - Migrations: `src/migrations/1696489702777-migrations.ts:1`

## Getting Started

Prerequisites:

- Node.js 18+
- PostgreSQL 14+ (or use Docker Compose below)
- Telegram bot token from BotFather

1) Create a Telegram Bot

- In Telegram, talk to `@BotFather`, run `/newbot`, and follow prompts.
- Copy the bot token and set it in your environment as `TELEGRAM_BOT_TOKEN`.

2) Configure environment

Create a `.env` file in the repo root (used by Nest and Docker Compose). Example:

```
POSTGRES_USER=leads_manager_bot
POSTGRES_PASSWORD=password
POSTGRES_DB=leads_manager_bot
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
TELEGRAM_BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

You can use `local.example.sh` as a reference for variable names.

3) Install dependencies

```
npm ci
```

4) Prepare the database

- Ensure PostgreSQL is running and your `DATABASE_URL` is reachable.
- Run migrations:

```
npm run migration:run
```

5) Start the bot

- Development with watch:

```
npm run start:dev
```

- Production (build + run):

```
npm run build
npm run start:prod
```

## Running with Docker

This repository includes a `Dockerfile` and `docker-compose.yml` for a simple 2-service setup (Postgres + app).

1) Create a `.env` file as above.
2) Build and start services:

```
docker compose up --build
```

This will:

- Start `postgres` with a persisted volume `postgres-data`.
- Build and start the `nestapp` service using a distroless Node.js base image.

Stop services with `docker compose down` (add `-v` to remove volumes if needed).

## Database & Migrations

- TypeORM configuration is provided by `src/data-source.ts:1` and uses `DATABASE_URL`.
- Auto-sync is disabled (`synchronize: false`), so you must run migrations.
- Provided migration: `src/migrations/1696489702777-migrations.ts:1` creates `user`, `lead`, and `message` tables and relations.
- Useful commands:

```
npm run migration:generate   # Generate a migration from your entity changes
npm run migration:run        # Apply latest migrations
npm run migration:revert     # Revert the last migration
```

## Bot Usage

- Start a chat with your bot in Telegram and run `/start`.
  - This registers you as a `User` in the database.
  - You’ll see a welcome message with a hint to `/createLead`.
- Run `/createLead` to begin the lead creation wizard:
  1. Enter email
  2. Enter phone
  3. Enter first name
  4. Enter last name
  5. Enter country ISO (2-letter code, e.g., US)
- Upon success, a `Lead` is created and a `Message` record is queued for each active `User`.
- Every 30 seconds, the bot checks for unsent messages and sends notifications in Markdown format to each user.

Example notification:

```
New lead: *email@example.com* +15551234567 Jane Doe US created at 2023-01-01T12:00:00.000Z
```

## Configuration

Environment variables (via `.env` or your shell):

- `DATABASE_URL` – PostgreSQL connection string
- `POSTGRES_*` – Helper vars for composing `DATABASE_URL` (used by Docker Compose)
- `TELEGRAM_BOT_TOKEN` – Bot token from BotFather
- `NODE_ENV` – Set to `production` in container by default

Libraries and frameworks:

- NestJS 10 (`@nestjs/common`, `@nestjs/core`)
- Telegraf 4 via `nestjs-telegraf`
- TypeORM 0.3 with PostgreSQL
- `class-validator`/`class-transformer` for DTO validation
- `@nestjs/schedule` for Cron

## Scripts

- `npm run start` – Start the app
- `npm run start:dev` – Start in watch mode
- `npm run start:prod` – Run compiled build
- `npm run build` – Compile TypeScript to `dist`
- `npm run lint` – Lint and auto-fix
- `npm run format` – Prettier format
- `npm test` – Unit tests
- `npm run test:e2e` – E2E tests
- `npm run migration:generate` – Generate TypeORM migrations
- `npm run migration:run` – Run migrations
- `npm run migration:revert` – Revert last migration

## Project Structure

```
src/
  app.module.ts            # Root module
  app.constants.ts         # Constants (bot name, scene ids)
  data-source.ts           # TypeORM configuration options
  main.ts                  # App bootstrap

  bot/
    bot.module.ts          # Telegraf integration and providers
    bot.update.ts          # Command handlers and cron job
    wizard/
      lead.wizard.ts       # Multi-step lead creation wizard

  leads/
    leads.module.ts
    leads.entity.ts
    leads.service.ts
    dto/
      create-lead.dto.ts

  messages/
    messages.module.ts
    messages.entity.ts
    messages.service.ts

  users/
    users.module.ts
    users.entity.ts
    users.service.ts

  migrations/
    1696489702777-migrations.ts

middleware/
  session.middleware.ts
interfaces/
  context.interface.ts
```

## Testing

- Unit tests live alongside services (e.g., `src/leads/leads.service.spec.ts:1`).
- E2E tests are under `test/` and configured with `test/jest-e2e.json`.
- Run tests:

```
npm test          # unit
npm run test:e2e  # e2e
```

Note: The scaffolded E2E test expects a GET `/` HTTP endpoint, but this project boots a non-HTTP bot context by default. See “Notes & Limitations”.

## Troubleshooting

- Bot doesn’t respond:
  - Verify `TELEGRAM_BOT_TOKEN` and that the bot is started in Telegram.
  - Check logs for startup errors or migration issues.
- Database errors:
  - Ensure `DATABASE_URL` is correct and the DB is reachable.
  - Run `npm run migration:run` before starting the bot.
- Docker issues:
  - Confirm `.env` is present for both services.
  - Use `docker compose logs -f` to inspect runtime logs.

## Notes & Limitations

- HTTP API: The app boots with `NestFactory.createApplicationContext` (no HTTP server). The default E2E test (`test/app.e2e-spec.ts:1`) will fail unless you add an HTTP module/controller that exposes `/`.
- Message throttling: `MessagesService.getMessagesToSend()` filters by `user.lastMessageSentAt`, but the example code does not update this timestamp after sends. If you need strict rate limiting per user, add an update in `BotUpdate.handleCron()`.
- Entities enforce uniqueness for `User.username`, `Lead.email`, and `Lead.phone`; inserting duplicates will throw.

## License

UNLICENSED (see `package.json`).
