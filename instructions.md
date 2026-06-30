# Public Pool's Web

Public Pool's Web is a **dashboard for an existing Public Pool**, not a mining pool itself. Install and start the **Public Pool** service first — without it, this app has no data to show.

## Documentation

- [Public Pool's Web (upstream)](https://github.com/martinbarilik/public-pool-web) — the web app's own README and feature documentation.
- [Public Pool (the pool)](https://github.com/benjamin-wilson/public-pool) — the mining-pool service this dashboard reads from.

## What you get on StartOS

- A richer web interface for browsing your Public Pool data — pool stats, your workers, hashrate charts, and per-worker temperature (read from each AxeOS miner).
- Everything the app needs to run is bundled: the database (PostgreSQL), cache (Valkey), and background worker (Sidekiq) all run inside this package.
- A donation page for the upstream author.

The pool data itself comes from your separate **Public Pool** service over the local network — this package adds the dashboard on top.

## Getting set up

1. **Install and start the Public Pool service** if you haven't already, and point your miners at it. This is required — Public Pool's Web reads everything from it.
2. Start Public Pool's Web and wait until the **Database** and **Web Interface** health checks are green. The first start may take a little longer while the database is created and migrated.
3. Open the **Web UI** interface to launch the dashboard in your browser.

## Using Public Pool's Web

The app cannot detect your miners on its own — you add them in the web UI:

1. Add your **user** — the Bitcoin address your miner uses to connect to Public Pool.
2. Add your **worker name** — the worker name configured on your miner.

Both values must be **identical** to what your miner submits to Public Pool. If they don't match exactly, no data will appear for that worker.

To read per-worker temperature, set each worker's IP address in the UI so the app can query the miner's AxeOS interface directly.
