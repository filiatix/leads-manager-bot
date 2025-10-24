# Business Use Cases & Scaling

This document explains who the app is for, how teams can use it today, and a pragmatic path to scale.

## Who This Is For

- Small sales/CS teams that want a lightweight way to capture leads directly in Telegram and broadcast new-lead alerts to team members.
- Early-stage projects and prototypes that need simple persistence and notifications without building a full CRM.
- Ops teams who want a chat-first intake channel with minimum infrastructure.

## Core Use Case Today

- Lead intake via Telegram:
  - Any Telegram user who sends `/start` to the bot is registered as a user.
  - Running `/createLead` starts a guided wizard to collect: email, phone, first name, last name, 2-letter country.
  - Validation ensures required fields are present and well-formed (email, ISO 3166-1 alpha-2 country code).

- Team notifications:
  - After a lead is created, a Message is queued for every registered user.
  - A 30-second cron job sends up to 30 pending messages per cycle.
  - Notifications include key lead info in a concise, Markdown-formatted message.

- Data persistence and integrity:
  - Unique constraints on `Lead.email` and `Lead.phone` to prevent duplicates.
  - Each notification is tracked via a `Message` row and marked as sent after delivery.

## Roles and Workflow (Practical)

- Contributor (any user): Starts the bot, submits leads via wizard.
- Recipient (any user): Receives notifications of newly created leads.
- Admin (optional practice): In current code, there is no explicit admin role. Teams typically restrict who knows the bot link/token and who starts the bot. Admin-like tasks (migrations, environment setup) are done by whoever deploys.

## Current Options & Behaviors

- Users
  - Auto-registered on `/start` using Telegram `id`, `username`, `first_name`, `last_name`.
  - All registered users are treated as “active” recipients (`UsersService.findActiveUsers()` returns all users).

- Leads
  - Created only via wizard; no update/delete flows out-of-the-box.
  - Email and phone must be unique. Duplicate attempts will throw.

- Notifications
  - Sent in batches (up to 30 per cron run, every 30 seconds).
  - Basic throttling logic exists via `lastMessageSentAt` filter, but the timestamp is not updated on send in the demo code. See docs/notifications.md for recommended enhancement.

- Deployment
  - Works locally or via Docker Compose.
  - No HTTP API exposed by default (headless Nest app). See notes if you want an HTTP health/ops endpoint.

## Common Team Patterns

- Sales standups: Submit leads during a call and broadcast to the team instantly.
- On-call rotations: Everyone receives alerts; later filter recipients by role (enhancement below).
- Field reps: Capture leads on mobile Telegram app without needing a CRM login.

## Limitations (As-Is)

- No role-based access control or approval workflow.
- No lead enrichment, dedup beyond unique email/phone, or updates.
- No dashboards, exports, or HTTP/GraphQL API.
- Throttling is minimal; per-user rate control not persisted unless you add it.

## Scale-Up Roadmap

Short-term (low effort, high impact)

- Add per-user send throttling
  - Update `lastMessageSentAt` upon send to enforce a minimum gap per user.
- Add recipient controls
  - Maintain a user flag (e.g., `isSubscribed`) or roles to target subsets of users for notifications.
- Introduce HTTP health endpoint
  - Minimal Nest controller for `/health` to aid ops and align with E2E tests.

Medium-term (robustness, manageability)

- Webhook mode for Telegram
  - Use Telegram webhooks behind HTTPS/load balancer instead of polling (if applicable) for better scalability.
- Queue-based delivery
  - Move `Message` send pipeline to a job queue (e.g., BullMQ/Redis, RabbitMQ) for retries, backoff, and concurrency control.
- Observability
  - Add structured logging, metrics (Prometheus), and tracing to monitor throughput, failures, and latencies.
- Admin and RBAC
  - Add roles (admin, contributor, viewer), subscription preferences, and possibly teams/tenants.

Long-term (enterprise readiness)

- API surface
  - Add REST/GraphQL endpoints to integrate with CRMs (HubSpot, Salesforce) or downstream systems.
- Data lifecycle & compliance
  - PII considerations for emails/phones; encryption at rest, audit logs, DPA/GPDR compliance.
- Multi-region & reliability
  - Managed Postgres, read replicas, connection pooling, and HA.
  - Horizontal scale for bot workers reading from a queue; idempotent send logic to avoid duplicates.
- Advanced lead management
  - Lead status, ownership/assignment, dedup strategy, merge flows, enrichment (Clearbit, internal rules), and exports.

## Decision Guide: When to Scale

- You’re bumping into Telegram rate limits or missing delivery windows → adopt queue + throttling updates.
- You need targeted notifications (e.g., only “sales” team) → add roles and subscription preferences.
- You need automated integrations → expose an API or build connectors.
- You need auditability and compliance → formalize security, logging, and data retention.

## Summary

Today, the app is a simple, reliable chat-first lead capture and broadcast tool. With small, incremental changes (throttling, roles, queue), it can support larger teams and higher message volumes. Longer-term improvements around APIs, RBAC, observability, and compliance will take it toward production-grade CRM-adjacent use.

