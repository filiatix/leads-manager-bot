# Deployment

This document describes container images, Compose usage, and runtime considerations.

Container images

- Multi-stage Dockerfile: `Dockerfile`
  - `build` stage: installs deps, compiles TypeScript.
  - `dependencies` stage: prunes devDeps (`npm prune --omit=dev`).
  - `app` stage: distroless Node.js 18; copies `node_modules` and compiled `dist`.
  - Entrypoint: `CMD ["/srv/app/main.js"]`.

Docker Compose

- File: `docker-compose.yml`
- Services:
  - `postgres`: official Postgres image, volume `postgres-data`, port `5432:5432`.
  - `nestapp`: builds from `Dockerfile`, depends on `postgres`, uses `.env`.

Usage

1) Create `.env` with DB and Telegram settings.
2) Build and start:

```
docker compose up --build -d
```

3) Run migrations (inside the `nestapp` container or via a one-off run):

```
docker compose exec nestapp npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts
```

4) Tail logs:

```
docker compose logs -f
```

Operational notes

- Ensure the bot token is valid and the bot is not blocked by users.
- Consider tightening TypeORM logging in production.
- Use a managed PostgreSQL service for reliability.

