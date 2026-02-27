<script lang="ts">
	import HeightmapCanvas from '$lib/components/HeightmapCanvas.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { displayModes, type DisplayMode } from '$lib/data/displaymode';
	import { heightmaps, type Heightmap } from '$lib/data/heightmaps';
	import { palettes, type Palette } from '$lib/data/palettes';

	let selectedHeightmap: Heightmap = $state(heightmaps[0]);
	let selectedPalette: Palette = $state(palettes[0]);
	let selectedDisplayMode: DisplayMode = $state(displayModes[0]);
	let mobileOpen = $state(false);
</script>

<main class="flex h-dvh w-full bg-neutral-900">
	<SidePanel bind:selectedHeightmap bind:selectedPalette bind:selectedDisplayMode bind:mobileOpen />
	<div class="flex grow flex-col overflow-hidden">
		<div class="relative z-50 md:hidden">
			<AppHeader onmenutoggle={() => (mobileOpen = !mobileOpen)} />
		</div>
		<div class="flex grow items-center justify-center overflow-hidden">
			<HeightmapCanvas
				heightmap={selectedHeightmap}
				palette={selectedPalette}
				displayMode={selectedDisplayMode}
			/>
		</div>
	</div>
</main>
