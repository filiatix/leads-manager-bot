# Bot Behavior

This document covers the bot’s commands, scenes (wizard), middleware, and scheduler.

Entrypoints and setup:

- Bot module: `src/bot/bot.module.ts:1`
  - Configures `TelegrafModule.forRootAsync` with `TELEGRAM_BOT_TOKEN`.
  - Registers `sessionMiddleware` to enable per-user sessions during wizards.
  - Provides `BotUpdate` and `LeadWizard`.

Session middleware:

- Defined in `src/middleware/session.middleware.ts:1` using `telegraf`’s `session()`.
- Enables storing state across wizard steps per user.

Update handlers (`BotUpdate`): `src/bot/bot.update.ts:1`

- `@Start()` — `/start` command handler
  - Creates/updates a `User` entity with the Telegram `from` metadata.
  - Welcomes the user and hints to `/createLead`.

- `@Command('createLead')` — lead creation wizard entry
  - Enters the scene defined by `ADD_LEAD_WIZARD_SCENE_ID`.

- `@Cron(CronExpression.EVERY_30_SECONDS)` — scheduled sender
  - Pulls up to 30 unsent `Message` records with associated `Lead` and `User`.
  - Sends Telegram messages in Markdown format and marks them as sent.

Wizard (`LeadWizard`): `src/bot/wizard/lead.wizard.ts:1`

- Scene ID: `ADD_LEAD_WIZARD_SCENE_ID` (see `src/app.constants.ts:1`).
- Steps:
  1. Prompt for email
  2. Prompt for phone
  3. Prompt for first name
  4. Prompt for last name
  5. Prompt for country ISO (alpha-2)

- Validation:
  - Uses `class-validator` decorators on `LeadCreate` DTO.
  - On validation failure, exits the scene and returns errors.

- Persistence:
  - On success, calls `LeadsService.createLead()` to save the `Lead`.
  - Enqueues `Message` records for all active users via `MessagesService`.

Message format

- Example text:
  `New lead: *{email}* {phone} {firstName} {lastName} {countryId} created at {createdAt}`
- Markdown is used for emphasis on the email field.

