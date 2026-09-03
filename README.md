# PCL Nex Website

The PCL Nex website is based on the official Axolotl Launcher website at
[`Mystic-Stars/Axolotl`](https://github.com/Mystic-Stars/Axolotl/tree/main/apps/website).
The upstream website is licensed under AGPL-3.0-only; its license and copying
notice are retained in `apps/website/`.

## Development

```sh
pnpm install
pnpm dev
```

Generate the static production site with `pnpm build`. Output is written to
`apps/website/.output/public/`.

Set `NUXT_PUBLIC_SITE_URL` to the production origin before generating a release.
