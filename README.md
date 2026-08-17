<p align="center">
  <img src="icon.png" alt="Public Pool's Web Logo" width="21%">
</p>

# Public Pool's Web on StartOS

> Everything not listed in this document should behave the same as upstream
> Public Pool's Web. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Public Pool's Web](https://github.com/martinbarilik/public-pool-web) is a richer dashboard for an existing Public Pool: pool statistics, per-worker hashrate charts, and temperatures read from the miners themselves. It is a front end, not a pool — the mining happens in the Public Pool service this one reads from.

- **Upstream repo:** <https://github.com/martinbarilik/public-pool-web>
- **Wrapper repo:** <https://github.com/Start9-Community/public-pool-web-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Three images and four daemons — the application twice, plus two datastores.

| Property      | Value                                                     |
| ------------- | --------------------------------------------------------- |
| Images        | `martinbarilik/public-pool-web`, `postgres`, `valkey`     |
| Architectures | x86_64, aarch64                                           |
| Command       | Each image's own entrypoint, and the worker's own command |

| Subcontainer          | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `public-pool-web-sub` | The web application — attach here for app logs |
| `sidekiq-sub`         | The background worker, from the same image     |
| `postgres-sub`        | The database                                   |
| `valkey-sub`          | The job queue and cache                        |

**The application image runs twice**: once serving HTTP, once as the background worker that does the polling and aggregation. They share nothing but the database and the queue.

**Valkey persists nothing** — both its snapshot and append-only files are disabled, and it binds loopback only. It is a job queue and a cache, and everything in it is re-derivable, which is why it gets no volume.

## Volume and Data Layout

One volume, and it belongs to the database.

| Volume | Mount Point           | Purpose                       |
| ------ | --------------------- | ----------------------------- |
| `db`   | `/var/lib/postgresql` | The PostgreSQL data directory |

| Path         | Written by | Holds                           |
| ------------ | ---------- | ------------------------------- |
| _PGDATA_     | PostgreSQL | Every statistic the app derives |
| `store.json` | Init       | The database password           |

**Neither application container mounts anything.** The web server and the worker are stateless: everything they know is in PostgreSQL, and everything in PostgreSQL is derived from what Public Pool reports.

## File Models

One model, holding one generated value.

| File         | Format | Modelled                | Written by |
| ------------ | ------ | ----------------------- | ---------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | Init       |

**The database password**, generated at install and never regenerated — the PostgreSQL cluster was initialized with it, so replacing it would make the existing data unopenable rather than rotating a credential.

Everything else is **passed as environment**, composed at start: the database URL built from that password, the queue's address, the Rails master key, the port layout, and where to find Public Pool.

Two of those are fixed constants in the package rather than settings: **the Rails master key**, which the published image needs in order to decrypt its own bundled credentials, and **the donation addresses**, which are the upstream author's and appear on the app's donation page.

## Dependencies

One, and it is required.

| Dependency  | Required | Health checks required | Why                    |
| ----------- | -------- | ---------------------- | ---------------------- |
| Public Pool | Yes      | `stratum`, `ui`        | Everything it displays |

**Both of Public Pool's checks are required, not just one.** The dashboard reads over Public Pool's web interface, and a pool whose stratum port is down has nothing meaningful to report — so waiting for both keeps this service in the dependency-waiting state instead of showing an empty dashboard.

**Public Pool is reached over the internal bridge**, at an address resolved from its own binding at start rather than at a fixed hostname. The lookup names the plaintext leg explicitly, because Public Pool's interface publishes both a plaintext and a TLS address. If that address cannot be resolved the service refuses to start and says so, rather than coming up pointed at nothing.

## Network Access and Interfaces

One interface.

| Interface | Id   | Type | Port | Description   |
| --------- | ---- | ---- | ---- | ------------- |
| Web UI    | `ui` | ui   | 3000 | The dashboard |

Bound on the `ui-multi` MultiHost over HTTP and not masked.

**There is no login of any kind** — not the application's, and none added by StartOS. Anyone who can reach the address sees your pool's statistics and your workers. That is a disclosure question rather than a control one: the dashboard is read-only, and nothing on it can change the pool.

The HTTP port in front is a small proxy that forwards to the Rails server on another port inside the container; both PostgreSQL and Valkey are bound to loopback and are not exported.

## Installation and First-Run Flow

Install generates the database password. There is no task, no credential to record, and nothing to configure.

**Public Pool must be installed and running first** — it is a required dependency, and until both of its checks pass this service waits rather than starting.

The first start creates and migrates the database, so it takes noticeably longer than later ones. Once the database and web checks are green, the dashboard is ready; it fills in as the worker polls the pool.

## Actions

**None.** The package ships an empty action set: there is nothing to configure, and everything on the dashboard is derived from the pool.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

Four checks, two of them shown.

| Check             | Displayed as    | Method                                   |
| ----------------- | --------------- | ---------------------------------------- |
| `db`              | "Database"      | PostgreSQL is accepting connections      |
| `public-pool-web` | "Web Interface" | Port 3000 is listening                   |
| `valkey`          | — internal      | The queue answers a ping                 |
| `sidekiq`         | — internal      | A live worker is registered in the queue |

**The worker's check is the interesting one.** Sidekiq has no port to probe, so its liveness is read out of the queue: it registers itself there and refreshes that registration every few seconds, and the check counts the registrations. That is a real liveness signal rather than "the process exists".

Both datastore checks are hidden, because a user cannot act on them: what they would do about a failing queue is the same thing they would do about a failing dashboard.

**None of the four says anything about the pool.** If Public Pool stops reporting, the checks stay green and the dashboard goes stale.

## Backups and Restore

The `db` volume is copied — `sdk.Backups.ofVolumes('db')` — which is the PostgreSQL data directory and the generated password.

**Almost nothing here is irreplaceable.** The database holds statistics derived from Public Pool; what it cannot re-derive is history that Public Pool no longer retains, which is the one reason to keep a backup at all.

**The data directory is copied as files rather than dumped**, so a backup taken while the database is writing is not guaranteed to be crash-consistent, and a restore is only as good as PostgreSQL's own recovery from that state.

A restored instance comes back with the same password and the same history, and resumes polling.

## Limitations and Differences

1. **It is a dashboard, not a pool.** Without the Public Pool service it has nothing to show and will not start.
2. **No authentication at all.** The dashboard is readable by anyone who can reach the address.
3. **No configuration surface** — no actions, no settings.
4. **The Rails master key is a constant in the package**, shared with anyone who reads the source; it decrypts the image's bundled credentials, not yours.
5. **The donation page is the upstream author's** and is not configurable.
6. **The database is backed up as files**, not as a logical dump.
7. **The datastores are private.** Neither PostgreSQL nor Valkey can be shared or substituted.

---

## Quick Reference for AI Consumers

```yaml
package_id: public-pool-web
image: martinbarilik/public-pool-web # plus postgres and valkey
architectures:
  - x86_64
  - aarch64
subcontainers:
  - public-pool-web-sub # Rails behind a small HTTP proxy
  - sidekiq-sub # same image, background worker
  - postgres-sub
  - valkey-sub
volumes:
  db: /var/lib/postgresql # the only volume; store.json also lives here
file_models:
  - store.json # the generated PostgreSQL password
startos_managed_env_vars:
  - PUBLIC_POOL_HOST # resolved from public-pool's `main` host over the bridge, ssl: false
  - PUBLIC_POOL_PORT
  - RAILS_MASTER_KEY # a constant in the package, needed by the published image
  - DATABASE_URL
  - REDIS_URL
  - DONATE_BTC_ADDRESS
  - DONATE_LN_ADDRESS
  - THRUSTER_HTTP_PORT
  - THRUSTER_TARGET_PORT
dependencies:
  - public-pool # required, kind: running, healthChecks: [stratum, ui]
interfaces:
  ui: { type: ui, port: 3000 } # no authentication of any kind
actions: []
tasks: []
health_checks:
  - db # displayed "Database"; pg_isready
  - public-pool-web # displayed "Web Interface"
  - valkey # internal (display: null)
  - sidekiq # internal; counts live workers registered in the queue, since it has no port
```
