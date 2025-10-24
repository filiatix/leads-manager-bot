# Architecture Overview

This project is a NestJS application that runs as a Telegram bot using Telegraf. It uses TypeORM with PostgreSQL to persist Users, Leads, and outbound notification Messages.

Key characteristics:

- Headless bootstrap: uses `NestFactory.createApplicationContext` (no HTTP server) in `src/main.ts:1`.
- Modular design: `AppModule` composes `BotModule`, `UsersModule`, `LeadsModule`, and `MessagesModule` (see `src/app.module.ts:1`).
- Database layer: Entities and services encapsulate persistence via TypeORM (`src/data-source.ts:1`).
- Messaging loop: A scheduled Cron job every 30 seconds sends pending notifications.

Flow summary:

1) User starts the bot with `/start`.
   - The bot saves/updates the user record in DB (`src/bot/bot.update.ts:1`, `src/users/users.service.ts:1`).
2) User runs `/createLead`.
   - The bot enters a multi-step wizard to collect lead data (`src/bot/wizard/lead.wizard.ts:1`).
   - Input is validated via `class-validator` before persisting the lead.
   - After creating the lead, messages are queued for all active users.
3) Cron job executes every 30 seconds.
   - Reads up to 30 unsent messages and sends them via Telegram.
   - Marks messages as sent to avoid duplication.

Modules and responsibilities:

- `BotModule` — Integrates Telegraf (token, middleware), declares update handlers and wizards.
- `UsersModule` — Manages `User` entity, registration, and queries for active users.
- `LeadsModule` — Manages `Lead` entity and creation flow used by the wizard.
- `MessagesModule` — Manages `Message` entity and the queue of outbound notifications.

Scheduling and rate control:

- The scheduled task (`@Cron(CronExpression.EVERY_30_SECONDS)`) in `src/bot/bot.update.ts:1` queries up to 30 pending `Message` records.
- `MessagesService.getMessagesToSend()` avoids sending to users who had a recent message sent (based on `lastMessageSentAt`).
- Note: The sample code does not update `lastMessageSentAt`; see `docs/notifications.md` for options.

