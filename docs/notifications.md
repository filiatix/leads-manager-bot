# Notifications & Scheduling

This document details how outbound notifications are queued and sent.

Message lifecycle

1) Lead creation queues messages
   - In `LeadWizard` (`src/bot/wizard/lead.wizard.ts:1`), after successfully creating a `Lead`, the code fetches all active users from `UsersService.findActiveUsers()` and creates a `Message` per user.

2) Scheduler sends messages
   - The `@Cron(CronExpression.EVERY_30_SECONDS)` handler in `src/bot/bot.update.ts:1` calls `MessagesService.getMessagesToSend()` to fetch up to 30 unsent messages.
   - It then sends a Telegram message to `message.user.id` and marks the `Message` as sent via `MessagesService.markMessageAsSent(message.id)`.

Throttling behavior

- `MessagesService.getMessagesToSend()` filters by `user.lastMessageSentAt` such that users who have received a message in the last second are temporarily skipped.
- The demo code does not update `lastMessageSentAt` after a send. For stricter throttling:
  - Update the user’s `lastMessageSentAt` when sending, for example in `BotUpdate.handleCron()`.
  - Alternatively, add a DB-level constraint or locking to ensure per-user rate is enforced even under concurrency.

Suggested enhancement (optional)

- In `BotUpdate.handleCron()` after a successful send:
  - `await usersService.saveUser({ ...message.user, lastMessageSentAt: new Date() });`
  - This requires injecting `UsersService` into `BotUpdate` (already present) and saving the updated timestamp.

Message format

- Markdown-formatted string emphasizing the lead’s email:
  `New lead: *{email}* {phone} {firstName} {lastName} {countryId} created at {createdAt}`

Batch size

- `getMessagesToSend()` uses `take: 30`. Adjust to fit your throughput and rate limits.

