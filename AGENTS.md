# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`masterKey` is upstream's Rails master key, checked in deliberately** — the published image needs it to decrypt its own bundled `credentials.yml.enc`. It is not a per-install secret and must match whatever the pinned image was built with, so bump it only if upstream rotates theirs.
- **Sidekiq's health check reads the queue, not a port.** It counts entries in Valkey's `processes` set (each worker refreshes its registration every few seconds) because Sidekiq binds nothing. Don't replace it with a process check.
- **Valkey persists nothing on purpose** (`--save ''`, `--appendonly no`, bound to loopback, no volume) — it is a job queue and cache. Don't give it a volume.
- **PostgreSQL is started with `listen_addresses=127.0.0.1`** so it is reachable only inside the service's own namespace.
- **The dependency requires both of Public Pool's checks** (`stratum` and `ui`), so the dashboard waits rather than rendering an empty page against a half-up pool.
- **The donation addresses are the upstream author's** and are passed as env by design — they are not ours and are not configurable.
