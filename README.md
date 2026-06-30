<p align="center">
  <img src="icon.svg" alt="Public Pool's Web Logo" width="21%">
</p>

# Public Pool's Web on StartOS

> **Upstream repo:** <https://github.com/martinbarilik/public-pool-web>
>
> Everything not listed in this document should behave the same as upstream
> Public Pool's Web. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable.

[Public Pool's Web](https://github.com/martinbarilik/public-pool-web) is a modern web interface for managing your [Public Pool](https://github.com/benjamin-wilson/public-pool) data — built with Ruby on Rails and Bootstrap, with real-time updates via Hotwire. It is a **dashboard, not a mining pool**: it reads its data from a running Public Pool service over that service's HTTP API.

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
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Image                           | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| `martinbarilik/public-pool-web` | Rails web server (Thruster → Puma) **and** the Sidekiq background worker — one image, two subcontainers |
| `postgres`                      | PostgreSQL database sidecar                       |
| `valkey/valkey`                 | Redis-compatible cache / job queue (Valkey)      |

Architectures: x86_64, aarch64.

The web subcontainer runs through the image's own entrypoint, which executes `rails db:prepare` (create + migrate) before launching the server; Thruster fronts the app and proxies to Puma. The Sidekiq subcontainer runs the same image with `bundle exec sidekiq`.

---

## Volume and Data Layout

| Volume | Mount Point           | Mounted Into | Purpose                      |
| ------ | --------------------- | ------------ | ---------------------------- |
| `db`   | `/var/lib/postgresql` | `postgres`   | PostgreSQL data (persistent) |

Valkey is configured ephemeral (`--save '' --appendonly no`); it holds only Sidekiq queues and cache, which are safe to lose on restart, so it has **no** volume. The service's `store.json` (which holds the generated PostgreSQL password) lives on the `db` volume.

---

## Installation and First-Run Flow

1. On install, a random PostgreSQL password is generated and persisted to the service's `store.json`.
2. On start, the `db` (PostgreSQL) and `valkey` daemons come up first.
3. The web daemon starts via the image's entrypoint, which runs `rails db:prepare` (creates the database and runs migrations) before launching the server.
4. Sidekiq starts after the web daemon is healthy.

No user setup is required to bring the service up, but it will display no data until its **Public Pool** dependency is running and receiving miners (see [Dependencies](#dependencies)).

---

## Configuration Management

All configuration is injected as environment variables by the package; there are no user-facing settings.

| Variable                          | Managed by | Purpose                                                              |
| --------------------------------- | ---------- | ------------------------------------------------------------------- |
| `DATABASE_URL`                    | StartOS    | Points the app at the bundled PostgreSQL over loopback              |
| `REDIS_URL`                       | StartOS    | Points the app at the bundled Valkey over loopback                  |
| `RAILS_MASTER_KEY`                | StartOS    | Static key baked into the package (`startos/utils.ts`)              |
| `PUBLIC_POOL_HOST` / `_PORT`      | StartOS    | Address of the Public Pool dependency (`public-pool.startos`) whose API the app reads |
| `DONATE_BTC_ADDRESS` / `_LN_…`    | StartOS    | Addresses shown on the app's donation page                          |

All inter-daemon communication (web/sidekiq ↔ PostgreSQL ↔ Valkey) is over loopback (`127.0.0.1`); PostgreSQL and Valkey bind to localhost only and are not externally reachable. Pool data is fetched from the Public Pool dependency at `public-pool.startos` over the StartOS internal network.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose              |
| --------- | ---- | -------- | -------------------- |
| Web UI    | 3000 | HTTP     | Public Pool's Web UI |

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address (if a Tor interface is added)
- Custom domains (if configured)

---

## Actions (StartOS UI)

None. The Public Pool host/port are wired to the dependency automatically; per-pool settings (users, workers) are managed inside the app's own web UI.

---

## Backups and Restore

**Included in backup:**

- `db` volume (PostgreSQL data, including the generated password in `store.json`)

**Not included:** Valkey state (ephemeral by design — Sidekiq queues and cache are rebuilt automatically).

**Restore behavior:** the `db` volume is fully restored before the service starts; `rails db:prepare` re-runs on the next start and is a no-op for an already-migrated database.

---

## Health Checks

| Check         | Daemon            | Method                                              | Shown in UI |
| ------------- | ----------------- | --------------------------------------------------- | ----------- |
| Database      | `db`              | `pg_isready` against `127.0.0.1`                    | Yes         |
| Valkey        | `valkey`          | `valkey-cli ping` (expects `PONG`)                  | No          |
| Web Interface | `public-pool-web` | Port 3000 listening                                 | Yes         |
| Sidekiq       | `sidekiq`         | Redis heartbeat — `SCARD processes` reports ≥ 1 live worker | No          |

Daemon start order: `db` + `valkey` → `public-pool-web` → `sidekiq`.

---

## Dependencies

| Dependency      | Required | Health checks that must pass | Purpose                                                                 |
| --------------- | -------- | ---------------------------- | ----------------------------------------------------------------------- |
| **Public Pool** | Yes      | `stratum`, `ui`              | This service is a frontend with no pool of its own. It polls Public Pool's HTTP API (at `public-pool.startos`) for pool, worker, and chart data. |

No dependency volumes are mounted; the integration is purely over the network. The web app degrades gracefully when Public Pool is unreachable — it simply shows no new data rather than failing — so the dependency is declared but not hard-gated in `main.ts`.

---

## Limitations and Differences

1. **It is a dashboard, not a pool.** There is no Stratum server here; miners cannot connect to this package. It is only useful alongside the Public Pool service, which must be installed, running, and receiving miners.
2. **Users and workers are added by hand.** The app cannot auto-discover miners; you add each user (the Bitcoin address your miner uses) and worker name in the web UI, and they must match exactly what the miner submits to Public Pool.
3. **Valkey is not persisted.** Cache and Sidekiq queue state are rebuilt on restart by design.
4. **The Rails master key is baked into the package** (`startos/utils.ts`); it is not user-rotatable. This is a single-tenant, self-hosted deployment, so the key only protects locally stored Rails credentials.

---

## What Is Unchanged from Upstream

The Rails application itself — the dashboard UI, the user/worker/chart views, per-worker temperature via AxeOS, and the donation page — behaves exactly as upstream Public Pool's Web documents. Only the runtime wiring is StartOS-specific: bundled PostgreSQL and Valkey sidecars, the Public Pool host injected via environment, automatic database preparation, and the generated database password.

---

## Contributing

See [AGENTS.md](./AGENTS.md) for how this package is developed and how to work its `TODO.md`.

---

## Quick Reference for AI Consumers

```yaml
package_id: public-pool-web
title: Public Pool's Web
architectures: [x86_64, aarch64]
images:
  - martinbarilik/public-pool-web # Rails web server + Sidekiq worker (two subcontainers)
  - postgres
  - valkey/valkey
volumes:
  db: /var/lib/postgresql
ports:
  ui: 3000
dependencies:
  - public-pool # required; data source via its HTTP API at public-pool.startos
startos_managed_env_vars:
  - DATABASE_URL
  - REDIS_URL
  - RAILS_MASTER_KEY
  - PUBLIC_POOL_HOST
  - PUBLIC_POOL_PORT
  - DONATE_BTC_ADDRESS
  - DONATE_LN_ADDRESS
actions: none
backup: db volume only
```
