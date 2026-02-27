# Project: Elevatint

A small tool for visualizing heightmaps with hypsometric color palettes. Pick a heightmap and a palette, choose a rendering mode, and see the result instantly. Originally built to prototype color ramps for hand-drawn game maps.

## Features

- **Rendering modes:** Bands (discrete zones), Continuous (Oklab interpolation), Hillshade (continuous + normal-mapped lighting)
- **Palettes:** built-in set + custom palette creation/editing, persisted in localStorage
- **Heightmaps:** built-in set + custom PNG import (8-bit or 16-bit grayscale)
- **Color export:** key ramp colors as Hex, RGB, HSV, Oklab

## Tech Stack

- **SvelteKit** with **Svelte 5** (runes)
- **TypeScript**
- **Tailwind CSS v4** (no plugins)
- **Static adapter** (fully static site)
- Package manager: **pnpm**

## Styling Conventions

### `cn()` utility — `$lib/utils/cn`

All non-trivial `class` attributes use the `cn()` helper (`clsx` + `tailwind-merge`):

```svelte
<script lang="ts">
  import { cn } from '$lib/utils/cn';
</script>

<div class={cn('base classes', conditionalBool && 'extra-class', variant === 'a' ? 'class-a' : 'class-b')}>
```

**Rules:**

- Use `cn()` for any class list that is conditional, long (>50 chars), or spans multiple concerns.
- Group related classes as separate string arguments to aid readability (e.g. layout, colors, interactions, responsive).
- Skip `cn()` only for very short, purely static class lists (≤ 3 classes) where it adds no clarity.
- Never mix `class:` directives with `cn()` on the same element — consolidate into `cn()`.
- `twMerge` inside `cn()` resolves conflicting Tailwind utilities, making it safe for prop-forwarded classes.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
