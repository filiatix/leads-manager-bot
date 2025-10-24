# Troubleshooting

Common issues and resolutions.

Bot does not respond

- Verify `TELEGRAM_BOT_TOKEN` is valid.
- Ensure the bot has been started by the user in Telegram (send `/start`).
- Check container/app logs for startup errors or invalid migrations.

Database connection errors

- Confirm `DATABASE_URL` is correct and reachable from the running container/host.
- Ensure migrations have been applied: `npm run migration:run`.

Duplicate lead errors

- `Lead.email` and `Lead.phone` are unique. Attempting to create a lead with duplicate values will throw.

E2E test failures at `GET /`

- The project boots an application context only (no HTTP server). Either:
  - Add a minimal HTTP controller for `/`, or
  - Remove/adjust the scaffolded E2E test (`test/app.e2e-spec.ts:1`).

High message volume or rate limits

- Increase the batch size (`take`) cautiously.
- Implement `lastMessageSentAt` updates to throttle per user.
- Consider exponential backoff or retry strategies on send failures.

Docker-specific issues

- Ensure `.env` exists and is mounted for both services (`postgres`, `nestapp`).
- Use `docker compose logs -f` to inspect runtime logs.
- Remove volumes with `docker compose down -v` if you need a clean DB.

