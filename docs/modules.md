# Modules & Services

App Module — `src/app.module.ts:1`

- Imports `ConfigModule`, `TypeOrmModule.forRootAsync`, `ScheduleModule`.
- Composes domain modules: `BotModule`, `UsersModule`, `LeadsModule`, `MessagesModule`.

Bot Module — `src/bot/bot.module.ts:1`

- Registers Telegraf with token from `TELEGRAM_BOT_TOKEN`.
- Adds `sessionMiddleware` and providers `BotUpdate`, `LeadWizard`.
- Depends on `LeadsModule`, `UsersModule`, `MessagesModule`.

Users Module — `src/users/users.module.ts:1`

- Registers `User` entity repository and `UsersService`.
- Exports `UsersService` for other modules.

Leads Module — `src/leads/leads.module.ts:1`

- Registers `Lead` entity repository, `LeadsService`, and injectable DTO `LeadCreate` used by the wizard.
- Exports `LeadsService` and `LeadCreate`.

Messages Module — `src/messages/messages.module.ts:1`

- Registers `Message` entity repository and `MessagesService`.
- Exports `MessagesService` for bot cron and wizard enqueueing.

Services

UsersService — `src/users/users.service.ts:1`

- `createUser()` — Instantiates a new `User` entity.
- `saveUser(user)` — Persists/updates user.
- `findActiveUsers()` — Returns all users; use this as a placeholder for real “active user” logic.

LeadsService — `src/leads/leads.service.ts:1`

- `createLead(newLead: LeadCreate)` — Creates and saves a `Lead`. Throws on uniqueness violations for email/phone.

MessagesService — `src/messages/messages.service.ts:1`

- `createMessage()` — Instantiates a new `Message` entity.
- `saveMessage(message)` — Persists message.
- `getMessagesToSend()` — Returns up to 30 unsent `Message`s with eligible users.
- `markMessageAsSent(messageId)` — Sets `isSent = true` for the given message.

