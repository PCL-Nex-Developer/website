# PCL Nex Website

`apps/website` is the PCL Nex website. It is based on the official Axolotl Launcher website and uses Nuxt 3, Vue 3, Tailwind CSS, and the imported shared UI and asset packages.

## Development

Run `pnpm dev` from the website workspace root for local development and `pnpm build` for the production build.

## Structure

- `src/pages/` contains file-based routes.
- `src/components/` contains website-specific components.
- `src/layouts/` contains page layouts.
- `src/locales/` contains website messages.
- Shared components and styles belong in `packages/ui` and `packages/assets` when both the website and desktop application can use them.
