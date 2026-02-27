<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Palette } from '$lib/data/palettes';
	import { Search, Pencil } from 'lucide-svelte';
	import Button from './Button.svelte';

	interface Props {
		palette: Palette;
		selected: boolean;
		onselect: () => void;
		onpreview: () => void;
		onedit?: () => void;
	}

	let { palette, selected, onselect, onpreview, onedit }: Props = $props();
</script>

<div class="grid w-full grid-cols-[1fr_auto] gap-x-2 gap-y-1">
	<button
		class={cn(
			'flex h-9 flex-wrap overflow-hidden rounded-lg border-2 shadow transition-all',
			'hover:scale-102 hover:cursor-pointer hover:shadow-lg',
			selected ? 'border-neutral-200' : 'border-transparent'
		)}
		onclick={onselect}
	>
		{#each palette.colors as color, i (i)}
			<div class="h-full grow" style="background-color: {color}"></div>
		{/each}
	</button>
	<Button variant="secondary" padding="square" onclick={palette.custom ? onedit : onpreview}>
		{#if palette.custom}
			<Pencil size={16} />
		{:else}
			<Search size={16} />
		{/if}
	</Button>
	<p class="text-center text-sm text-neutral-50">{palette.name}</p>
</div>
