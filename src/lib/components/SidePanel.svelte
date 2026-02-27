<script lang="ts">
	import { onMount } from 'svelte';
	import AppHeader from './AppHeader.svelte';
	import ImportHeightmapModal from './ImportHeightmapModal.svelte';
	import ButtonGroup from './ButtonGroup.svelte';
	import PaletteButton from './PaletteButton.svelte';
	import PalettePreviewModal from './PalettePreviewModal.svelte';
	import DashedButton from './DashedButton.svelte';
	import CreditsModal from './CreditsModal.svelte';
	import { displayModes, type DisplayMode } from '$lib/data/displaymode';
	import { heightmaps, type Heightmap } from '$lib/data/heightmaps';
	import { palettes, type Palette } from '$lib/data/palettes';
	import { cn } from '$lib/utils/cn';
	import { Plus } from 'lucide-svelte';
	import SectionTitle from './SectionTitle.svelte';

	interface Props {
		selectedHeightmap: Heightmap;
		selectedPalette: Palette;
		selectedDisplayMode: DisplayMode;
		mobileOpen: boolean;
	}

	let {
		selectedHeightmap = $bindable(),
		selectedPalette = $bindable(),
		selectedDisplayMode = $bindable(),
		mobileOpen = $bindable()
	}: Props = $props();

	let allHeightmaps: Heightmap[] = $state([...heightmaps]);
	let showImportModal = $state(false);
	let showCreditsModal = $state(false);

	const STORAGE_KEY = 'elevatint_custom_palettes';

	function loadCustomPalettes(): Palette[] {
		if (typeof localStorage === 'undefined') return [];
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? (JSON.parse(raw) as Palette[]) : [];
		} catch {
			return [];
		}
	}

	function saveCustomPalettes(customs: Palette[]) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(customs));
		} catch {}
	}

	let allPalettes: Palette[] = $state([...palettes]);
	let previewPalette: Palette | null = $state(null);
	let editPalette: Palette | null = $state(null);

	onMount(() => {
		const customs = loadCustomPalettes();
		if (customs.length > 0) {
			allPalettes = [...palettes, ...customs];
		}
	});

	function selectHeightmap(heightmap: Heightmap) {
		selectedHeightmap = heightmap;
		mobileOpen = false;
	}

	function selectPalette(palette: Palette) {
		selectedPalette = palette;
		mobileOpen = false;
	}

	function selectDisplayMode(mode: DisplayMode) {
		selectedDisplayMode = mode;
		mobileOpen = false;
	}

	function handleImport(heightmap: Heightmap) {
		allHeightmaps = [...allHeightmaps, heightmap];
		selectedHeightmap = heightmap;
		showImportModal = false;
		mobileOpen = false;
	}

	function handleSavePalette(saved: Palette) {
		const oldName = editPalette!.name;
		const updatedCustoms = allPalettes.filter(
			(p) => p.custom && p.name !== saved.name && p.name !== oldName
		);
		allPalettes = [...palettes, ...updatedCustoms, saved];
		saveCustomPalettes(allPalettes.filter((p) => p.custom));
		selectedPalette = saved;
		editPalette = null;
	}

	function handleDeletePalette() {
		allPalettes = allPalettes.filter((p) => p.name !== editPalette!.name);
		saveCustomPalettes(allPalettes.filter((p) => p.custom));
		if (selectedPalette.name === editPalette!.name) selectedPalette = palettes[0];
		editPalette = null;
	}

	function handleDuplicatePalette(copy: Palette) {
		editPalette = null;
		// Delay opening the new palette editor to let the current modal close animation finish
		setTimeout(() => (editPalette = copy), 350);
	}

	function createNewPalette() {
		editPalette = {
			name: '',
			colors: ['#888888'],
			ground: 0,
			custom: true,
			id: crypto.randomUUID()
		};
	}

	function handlePreviewDuplicate(copy: Palette) {
		previewPalette = null;
		editPalette = copy;
	}
</script>

{#snippet panelFooter()}
	<div
		class={cn(
			'shrink-0',
			'bg-neutral-800 px-3 py-2',
			'flex items-center justify-center gap-1',
			'text-xs text-neutral-400'
		)}
	>
		© 2026
		<a
			class="underline-offset-2 hover:cursor-pointer hover:text-neutral-200 hover:underline"
			href="https://github.com/woldendans"
			rel="noopener noreferrer"
			target="_blank"
		>
			woldendans
		</a>
		<span>·</span>
		<button
			class="underline-offset-2 hover:cursor-pointer hover:text-neutral-200 hover:underline"
			onclick={() => (showCreditsModal = true)}>Credits</button
		>
	</div>
{/snippet}

{#snippet panelContent()}
	<div class="flex flex-col gap-2">
		<SectionTitle>Heightmap</SectionTitle>

		<div class="grid grid-cols-3 justify-items-center gap-2">
			{#each allHeightmaps as heightmap (heightmap.name)}
				<button class="group flex flex-col gap-1" onclick={() => selectHeightmap(heightmap)}>
					<div
						class={cn(
							'h-24 w-24 shadow outline-2 transition-all',
							'group-hover:scale-105 group-hover:rotate-1 group-hover:cursor-pointer group-hover:shadow-lg',
							selectedHeightmap.name === heightmap.name
								? 'outline-neutral-200'
								: 'outline-transparent'
						)}
					>
						<img
							src={heightmap.thumbSrc}
							alt={`${heightmap.name} heightmap`}
							class="h-full w-full object-cover"
						/>
					</div>
					<p class="text-center text-sm text-neutral-50">{heightmap.name}</p>
				</button>
			{/each}
			<div class="group flex flex-col gap-1">
				<DashedButton
					class="h-24 w-24 flex-col rounded-lg p-3 text-sm shadow group-hover:scale-105 group-hover:rotate-1 group-hover:shadow-lg"
					onclick={() => (showImportModal = true)}
				>
					<Plus size={24} />
				</DashedButton>
				<p class="text-center text-sm text-neutral-50">Add Custom</p>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<SectionTitle>Style</SectionTitle>
		<ButtonGroup
			items={displayModes}
			selected={selectedDisplayMode}
			onselect={(m) => selectDisplayMode(m as DisplayMode)}
		/>
	</div>

	<div class="flex flex-col gap-2">
		<SectionTitle>Palette</SectionTitle>
		<div class="flex w-full flex-col items-center gap-2">
			{#each allPalettes as palette (palette.id)}
				<PaletteButton
					{palette}
					selected={selectedPalette.name === palette.name}
					onselect={() => selectPalette(palette)}
					onpreview={() => (previewPalette = palette)}
					onedit={() => (editPalette = palette)}
				/>
			{/each}
			<div class="grid w-full grid-cols-[1fr_auto] gap-x-2 gap-y-1">
				<DashedButton
					class="h-9 w-full text-sm shadow hover:scale-102 hover:shadow-lg"
					onclick={createNewPalette}
				>
					<Plus size={16} />
				</DashedButton>
				<div class="h-8.5 w-8.5"></div>
				<p class="text-center text-sm text-neutral-50">Add Custom</p>
			</div>
		</div>
	</div>
{/snippet}

<div class={cn('hidden md:flex', 'h-full w-sm flex-col', 'bg-neutral-700')}>
	<AppHeader />
	<div class={cn('flex grow flex-col gap-4 overflow-y-auto', 'bg-neutral-600 p-3')}>
		{@render panelContent()}
	</div>
	{@render panelFooter()}
</div>

<div
	class={cn(
		'fixed inset-x-0 top-16 z-40',
		'h-[calc(100dvh-4rem)]',
		'flex flex-col',
		'bg-neutral-700',
		'transition-transform duration-300 ease-in-out',
		'md:hidden'
	)}
	style="transform: translateY({mobileOpen ? '0%' : '-100%'})"
>
	<div class={cn('flex grow flex-col gap-4 overflow-y-auto', 'bg-neutral-600 p-3')}>
		{@render panelContent()}
	</div>
	{@render panelFooter()}
</div>

{#if showCreditsModal}
	<CreditsModal onclose={() => (showCreditsModal = false)} />
{/if}

{#if showImportModal}
	<ImportHeightmapModal
		onimport={handleImport}
		onclose={() => (showImportModal = false)}
		existingHeightmaps={allHeightmaps.map((h) => h.name)}
	/>
{/if}

{#if previewPalette}
	<PalettePreviewModal
		palette={previewPalette}
		existingPalettes={allPalettes}
		mode="view"
		onclose={() => (previewPalette = null)}
		onduplicate={handlePreviewDuplicate}
	/>
{/if}

{#if editPalette}
	<PalettePreviewModal
		palette={editPalette}
		mode="edit"
		onclose={() => (editPalette = null)}
		existingPalettes={allPalettes}
		onsave={handleSavePalette}
		ondelete={handleDeletePalette}
		onduplicate={handleDuplicatePalette}
	/>
{/if}
