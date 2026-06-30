# Updating the upstream version

This package wraps the Public Pool's Web application, published as `martinbarilik/public-pool-web`, plus official PostgreSQL and Valkey sidecar images. All image pins live in `startos/manifest/index.ts` under `images.*.source.dockerTag`.

## Image pins

| Image                           | Used for     | Current pin                           |
| ------------------------------- | ------------ | ------------------------------------- |
| `martinbarilik/public-pool-web` | web, sidekiq | `martinbarilik/public-pool-web:0.2.0` |
| `postgres`                      | database     | `postgres:18.4-alpine`                |
| `valkey/valkey`                 | cache/queues | `valkey/valkey:8-alpine`              |

## Applying a bump

1. Update the relevant `dockerTag` in `startos/manifest/index.ts`. The web app image is used by both the `public-pool-web` and `sidekiq` entries — bump both together.
2. Bump the package `version` in `startos/versions/current.ts` and update `releaseNotes` (all languages).
3. Rebuild with `make` and test the `.s9pk`.
