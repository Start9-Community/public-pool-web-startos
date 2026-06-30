<p align="center">
  <img src="icon.svg" alt="Public Pool's Web Logo" width="21%">
</p>

# Public Pool's Web on StartOS

> **Upstream repo:** <https://github.com/martinbarilik/public-pool-web>

A modern web interface for managing your Public Pool's data, built with Ruby on Rails 8.1 and Bootstrap 5, featuring real-time updates with Hotwire. Packaged for StartOS with PostgreSQL and Valkey sidecars.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Architecture](#architecture)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Image             | Source                                | Purpose                       |
| ----------------- | ------------------------------------- | ----------------------------- |
| `public-pool-web` | `martinbarilik/public-pool-web:0.2.0` | Rails web server (Thruster)   |
| `sidekiq`         | `martinbarilik/public-pool-web:0.2.0` | Background job worker         |
| `postgres`        | `postgres:18.4-trixie`                | Database sidecar              |
| `valkey`          | `valkey/valkey:8-alpine`              | Redis-compatible cache/queues |

Architectures: x86_64, aarch64.

---

## Volume and Data Layout

| Volume  | Mount Point           | Mounted Into | Purpose                                  |
| ------- | --------------------- | ------------ | ---------------------------------------- |
| `db`    | `/var/lib/postgresql` | `postgres`   | PostgreSQL data (persistent)             |
| `redis` | —                     | —            | Unused — Valkey runs without persistence |

Valkey is configured ephemeral (`--save '' --appendonly no`); it holds only Sidekiq queues and cache, which are safe to lose on restart.

---

## Installation and First-Run Flow

1. On install, a random PostgreSQL password is generated and stored in the service's `store.json`.
2. On start, the `db` (PostgreSQL) and `valkey` daemons come up first.
3. The web daemon starts via the image's Docker entrypoint, which runs `rails db:prepare` (creates the database and runs migrations) before launching the server with Thruster.
4. Sidekiq starts after the web daemon is healthy.

No user setup is required.

---

## Configuration Management

| Variable           | Value                                                                         | Consumers    |
| ------------------ | ----------------------------------------------------------------------------- | ------------ |
| `DATABASE_URL`     | `postgresql://public_pool_web:<pw>@127.0.0.1:5432/public_pool_web_production` | web, sidekiq |
| `REDIS_URL`        | `redis://127.0.0.1:6379/0`                                                    | web, sidekiq |
| `RAILS_MASTER_KEY` | baked into the package (`startos/utils.ts`)                                   | web, sidekiq |

All inter-daemon communication is over loopback (`127.0.0.1`); PostgreSQL and Valkey are bound to localhost only and are not externally reachable.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose              |
| --------- | ---- | -------- | -------------------- |
| Web UI    | 3000 | HTTP     | Public Pool's Web UI |

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

None.

---

## Backups and Restore

**Included in backup:**

- `db` volume (PostgreSQL data)

**Not included:** Valkey state (ephemeral by design).

**Restore behavior:** Volume is fully restored before the service starts; migrations re-run via `db:prepare` on the next start.

---

## Health Checks

| Check         | Daemon            | Method                             | Shown in UI |
| ------------- | ----------------- | ---------------------------------- | ----------- |
| Database      | `db`              | `pg_isready` against `127.0.0.1`   | Yes         |
| Valkey        | `valkey`          | `valkey-cli ping` (expects `PONG`) | No          |
| Web Interface | `public-pool-web` | Port 3000 listening                | Yes         |
| Sidekiq       | `sidekiq`         | Port 3000 listening (web proxy)    | No          |

Daemon start order: `db` + `valkey` → `public-pool-web` → `sidekiq`.

---

## Dependencies

None (all sidecars are bundled in the package).

---

## Architecture

- `startos/main.ts` — daemon definitions (postgres, valkey, web, sidekiq) and health checks
- `startos/init/initializeService.ts` — generates the PostgreSQL password on install
- `startos/utils.ts` — shared constants (ports, DB names, `REDIS_URL`, master key)
- `startos/manifest/index.ts` — package manifest and image pins
- `startos/i18n/` — translation dictionaries (en, es, de, pl, fr)
- Database migrations are handled by the image's Docker entrypoint (`rails db:prepare`), not by the package code

---

## Quick Reference for AI Consumers

```yaml
package_id: public-pool-web
images:
  public-pool-web: martinbarilik/public-pool-web:0.2.0
  sidekiq: martinbarilik/public-pool-web:0.2.0
  postgres: postgres:18.4-trixie
  valkey: valkey/valkey:8-alpine
architectures: [x86_64, aarch64]
volumes:
  db: /var/lib/postgresql (postgres)
  redis: unused (valkey is ephemeral)
ports:
  ui: 3000
env:
  DATABASE_URL: postgresql://public_pool_web:<generated>@127.0.0.1:5432/public_pool_web_production
  REDIS_URL: redis://127.0.0.1:6379/0
  RAILS_MASTER_KEY: static, defined in startos/utils.ts
dependencies: none
actions: none
backup: db volume only
```
