# Configuration

Environment variables drive both the Nest application and Docker Compose setup.

Required variables

- `DATABASE_URL` — Complete Postgres connection string.
- `TELEGRAM_BOT_TOKEN` — Bot token from BotFather.

Helper variables used by Docker Compose

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`
- These assemble into `DATABASE_URL` in examples.

Examples

```
POSTGRES_USER=leads_manager_bot
POSTGRES_PASSWORD=password
POSTGRES_DB=leads_manager_bot
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
TELEGRAM_BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

Configuration code

- Nest config: `ConfigModule.forRoot()` in `src/app.module.ts:1`.
- TypeORM options: `src/data-source.ts:1`.
  - `type: 'postgres'`, `url: process.env.DATABASE_URL`, `synchronize: false`.
  - Entities: `Lead`, `User`, `Message`.
  - Migrations: `Migrations1696489702777`.

Runtime logging

- TypeORM logging is set to `'all'` in `src/data-source.ts:1`. Adjust as desired for production.

