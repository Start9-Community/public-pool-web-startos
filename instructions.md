# Public Pool's Web

You've installed Public Pool's Web — a modern web interface for managing your Public Pool's data, with real-time updates and a responsive design.

## What you get on StartOS

- **A web interface** for browsing and managing your Public Pool's data.
- **Everything bundled** — the database (PostgreSQL), cache (Valkey), and background worker (Sidekiq) run inside the package. There is nothing to install separately.
- **No technical setup required** — the database is created and prepared automatically on first start.

## Getting set up

There's no setup wizard, no admin password, no first-run prompt — the service is usable the moment it starts and reports healthy.

1. Open Public Pool's Web's **Dashboard** tab.
2. Wait until the **Database** and **Web Interface** health checks are green.
3. Click the **Web UI** interface to open the app in your browser.

> The very first start may take a little longer while the database is created and migrated.

## Adding your user and worker

Public Pool's Web cannot detect your miners on its own — you must add them manually in the web UI:

1. Add your **user** — the Bitcoin address your miner uses to connect to Public Pool.
2. Add your **worker name** — the worker name configured on your miner.

Both values must be **identical** to what your miner submits to the Public Pool app. If they don't match exactly, no data will appear.

## Backups

StartOS backups include all of your Public Pool's Web data (the PostgreSQL database). Cache and job-queue state are intentionally excluded — they are rebuilt automatically.

## Limitations

- The service is configured automatically; there are no user-facing settings in the StartOS UI.
