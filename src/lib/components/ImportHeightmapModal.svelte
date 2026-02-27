<script lang="ts">
	import { NO_SEA_LEVEL, type Heightmap } from '$lib/data/heightmaps';
	import { capitalizeFirstLetter } from '$lib/utils/string';
	import { cn } from '$lib/utils/cn';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import Input, { trailClass } from './Input.svelte';

	interface Props {
		onimport: (heightmap: Heightmap) => void;
		onclose: () => void;
		existingHeightmaps: string[];
	}

	let { onimport, onclose, existingHeightmaps }: Props = $props();

	let file: File | null = $state(null);
	let name = $state('');
	let min = $state('');
	let max = $state('');
	let error = $state('');

	function handleFileChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const f = input.files?.[0] ?? null;
		file = f;
		error = '';
		if (f) {
			name = capitalizeFirstLetter(f.name.replace(/\.[^.]+$/, ''));
		}
	}

	function handleSubmit() {
		if (!file) {
			error = 'Please select a PNG file.';
			return;
		}
		const trimmedName = name.trim();
		if (!trimmedName) {
			error = 'Please enter a name.';
			return;
		}
		if (existingHeightmaps.includes(trimmedName)) {
			error = 'A heightmap with this name already exists.';
			return;
		}

		const parsedMin = parseFloat(min);
		const parsedMax = parseFloat(max);
		let midpoint = NO_SEA_LEVEL;
		if (
			parsedMin &&
			parsedMax &&
			!isNaN(parsedMin) &&
			!isNaN(parsedMax) &&
			parsedMin < 0.0 &&
			parsedMax > 0.0
		) {
			midpoint = -parsedMin / (-parsedMin + parsedMax);
		} else if ((min && isNaN(parsedMin)) || (max && isNaN(parsedMax))) {
			error = 'Please enter valid numbers as min/max, using "." as decimal separator.';
			return;
		}

		const objectUrl = URL.createObjectURL(file);
		const heightmap: Heightmap = {
			name: trimmedName,
			src: objectUrl,
			thumbSrc: objectUrl,
			midpoint: midpoint
		};
		onimport(heightmap);
	}
</script>

<Modal title="Import Heightmap" {onclose}>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-1">
			<p class="font-medium text-neutral-200">PNG File</p>
			<p class="text-sm text-neutral-400">
				8-bit or 16-bit single-channel grayscale PNG. Values map linearly from black (low) to white
				(high).
			</p>
			<div class="mt-1 flex items-stretch gap-2">
				<input
					id="heightmap-file"
					type="file"
					accept=".png,image/png"
					onchange={handleFileChange}
					class="sr-only"
				/>
				<label
					for="heightmap-file"
					class={cn(
						'shrink-0 cursor-pointer rounded-lg bg-neutral-800 px-3 py-2',
						'border-2 border-transparent',
						'font-medium text-neutral-300 shadow transition-all',
						'hover:bg-neutral-700 hover:text-neutral-200'
					)}
				>
					+ Choose File
				</label>
				<div
					class={cn(
						'flex flex-1 items-center overflow-hidden rounded-lg',
						'bg-neutral-900 px-3 py-2'
					)}
				>
					{#if file}
						<span class="truncate text-neutral-300">{file.name}</span>
					{:else}
						<span class="text-neutral-600">No file selected</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-1">
			<label class="font-medium text-neutral-200" for="heightmap-name">Name</label>
			<Input id="heightmap-name" bind:value={name} placeholder="My heightmap" />
		</div>

		<div class="grid grid-cols-2 gap-2">
			<p class="mt-1 font-medium text-neutral-200">Min</p>
			<p class="mt-1 font-medium text-neutral-200">Max</p>
			<Input
				id="min-height"
				type="number"
				onchange={(e) => (min = (e.currentTarget as HTMLInputElement).value)}
				placeholder="-3567"
			>
				{#snippet trail()}
					<div class={cn(trailClass, 'flex items-center text-neutral-400')}>m</div>
				{/snippet}
			</Input>
			<Input
				id="max-height"
				type="number"
				onchange={(e) => (max = (e.currentTarget as HTMLInputElement).value)}
				placeholder="2975"
			>
				{#snippet trail()}
					<div class={cn(trailClass, 'flex items-center text-neutral-400')}>m</div>
				{/snippet}
			</Input>
		</div>

		{#if error}
			<p class="text-red-400">{error}</p>
		{/if}
	</div>

	{#snippet footer()}
		<div class="flex shrink-0 justify-end gap-2 px-4 pt-2 pb-4">
			<Button variant="secondary" onclick={onclose}>Cancel</Button>
			<Button variant="primary" disabled={!file} onclick={handleSubmit}>Import</Button>
		</div>
	{/snippet}
</Modal>
