# Elevatint

A small tool for visualizing heightmaps with hypsometric color palettes.

Pick a heightmap and a palette, choose a rendering mode, and see the result instantly.

## Rendering modes

- **Bands** — discrete elevation zones, each filled with a solid color
- **Continuous** — smooth gradient interpolated in Oklab across the full elevation range
- **Hillshade** — continuous colors combined with normal-mapped lighting for a 3D look

## Palettes

Includes a set of built-in palettes (Globe, Natural Earth, Viridis, Topo, and more). You can also create and save your own, with a configurable sea/land boundary.

## Heightmaps

Comes with a handful of pre-set terrain samples at different scales — from world maps to Mt. Fuji. You can also import your own PNG heightmap (8-bit or 16-bit grayscale).

## Color export

Key ramp colors can be copied in Hex, RGB, HSV, or Oklab.

## Running locally

```bash
pnpm install
pnpm dev
```

```bash
pnpm build     # static output in /build
pnpm preview   # preview the build locally
```

## Stack

- [SvelteKit](https://kit.svelte.dev) + Svelte 5
- TypeScript
- Tailwind CSS v4
- [culori](https://culorijs.org) for color interpolation
- [fast-png](https://github.com/image-js/fast-png) for PNG decoding
