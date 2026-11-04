# Updating the upstream version

This package wraps the Public Pool's Web application, published as `martinbarilik/public-pool-web`, plus official PostgreSQL and Valkey sidecar images. All three pins live in `startos/manifest/index.ts` under `images.*.source.dockerTag`.

## Determining the upstream version

- **Public Pool's Web** ([martinbarilik/public-pool-web](https://github.com/martinbarilik/public-pool-web)): the image tags on Docker Hub are the versions. The repository's git tags don't follow them.

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/martinbarilik/public-pool-web/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

- **PostgreSQL** (`postgres:<major>.<minor>`): the newest minor of the pinned major on Docker Hub. A new major needs a data migration, so it is a package change of its own, not a bump.
- **Valkey** (`valkey/valkey:8-alpine`): floats on its major tag; there is nothing to bump within it.

## Applying the bump

Update the relevant `dockerTag` in `startos/manifest/index.ts`. The web app has a single `public-pool-web` image entry, used by both the web and Sidekiq subcontainers, so one bump covers both.
