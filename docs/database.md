# Database & Entities

The app uses TypeORM with PostgreSQL. Configuration is loaded from `DATABASE_URL` via `@nestjs/config` in `src/data-source.ts:1`.

Migrations

- Migrations are used; `synchronize: false` is set in TypeORM options.
- Initial migration: `src/migrations/1696489702777-migrations.ts:1`
  - Creates tables: `user`, `lead`, `message`.
  - Sets unique constraints and foreign keys.

Entities

User — `src/users/users.entity.ts:1`

- `id: number` — Primary key (Telegram user id).
- `username: string` — Unique username.
- `firstName: string`, `lastName: string` — Display names.
- `createdAt: Date` — Auto timestamp.
- `lastMessageSentAt: Date | null` — Optional timestamp used for throttling.
- Relations: `messages: Message[]` (one-to-many).

Lead — `src/leads/leads.entity.ts:1`

- `id: number` — Primary key.
- `email: string` — Unique email.
- `phone: string` — Unique phone.
- `firstName: string`, `lastName: string` — Names.
- `countryId: string` — 2-letter ISO code.
- `createdAt: Date` — Auto timestamp.
- Relations: `messages: Message[]` (one-to-many inverse side).

Message — `src/messages/messages.entity.ts:1`

- `id: number` — Primary key.
- `user: User` — Many-to-one relation to `User`.
- `lead: Lead` — Many-to-one relation to `Lead`.
- `isSent: boolean` — Default `false`; set to `true` after delivery.

Relations Summary

- `User (1) — (n) Message` via `user` foreign key.
- `Lead (1) — (n) Message` via `lead` foreign key.

Query behaviors

- `MessagesService.getMessagesToSend()` loads up to 30 messages with relations `{ lead: true, user: true }` and filters for `isSent = false` and users whose `lastMessageSentAt` is either null or older than 1 second.

