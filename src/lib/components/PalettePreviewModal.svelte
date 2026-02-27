<script lang="ts">
	import { untrack } from 'svelte';
	import { parse, formatHex, formatHsl, converter } from 'culori';
	import type { Palette } from '$lib/data/palettes';
	import Modal from './Modal.svelte';
	import ButtonGroup from './ButtonGroup.svelte';
	import SectionTitle from './SectionTitle.svelte';
	import Button from './Button.svelte';
	import DashedButton from './DashedButton.svelte';
	import Input, { trailClass } from './Input.svelte';
	import { Copy, Check, Mountain, Waves, Trash2, Plus, Save } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		palette: Palette;
		mode: 'view' | 'edit';
		onclose: () => void;
		onsave?: (palette: Palette) => void;
		ondelete?: () => void;
		onduplicate?: (palette: Palette) => void;
		existingPalettes: Palette[];
	}

	let { palette, mode, onclose, onsave, ondelete, onduplicate, existingPalettes }: Props = $props();

	let copiedHex: string | null = $state(null);

	function copyColor(hex: string) {
		navigator.clipboard.writeText(formatColor(hex));
		copiedHex = hex;
		setTimeout(() => (copiedHex = null), 2000);
	}

	type Format = 'Hex' | 'RGB' | 'HSL' | 'OKLCH';
	const formats: readonly Format[] = ['Hex', 'RGB', 'HSL', 'OKLCH'];
	let format: Format = $state('Hex');

	const toOklch = converter('oklch');

	function formatColor(hex: string): string {
		if (format === 'Hex') return hex.toUpperCase();

		const color = parse(hex);
		if (!color) return hex;

		if (format === 'RGB') {
			const { r, g, b } = color as { r: number; g: number; b: number };
			return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
		}

		if (format === 'HSL') return formatHsl(color) ?? hex;

		if (format === 'OKLCH') {
			const oklch = toOklch(color);
			if (!oklch) return hex;
			const l = (oklch.l ?? 0).toFixed(3);
			const c = (oklch.c ?? 0).toFixed(3);
			const h = (oklch.h ?? 0).toFixed(1);
			return `oklch(${l} ${c} ${h}°)`;
		}

		return hex;
	}

	let isSaved: boolean = $derived(existingPalettes.some((p) => p.id === palette.id));
	let editName: string = $state(
		untrack(() => palette.name || `Palette ${existingPalettes.length + 1}`)
	);
	let editColors: string[] = $state(untrack(() => [...palette.colors]));
	let editGround: number = $state(untrack(() => palette.ground));

	function parseColor(val: string): string | null {
		const trimmed = val.trim().toLowerCase();
		if (
			!trimmed.startsWith('#') &&
			!trimmed.startsWith('hsl') &&
			!trimmed.startsWith('rgb') &&
			!trimmed.startsWith('oklch')
		)
			return null;
		const c = parse(trimmed);
		return c ? (formatHex(c) ?? null) : null;
	}

	let parsedColors = $derived(editColors.map((c) => parseColor(c)));

	function removeColor(i: number) {
		editColors.splice(i, 1);
		if (i <= editGround) editGround = Math.max(0, editGround - 1);
		if (editColors.length < 2) editGround = 0;
	}

	function addColor() {
		const last = editColors.length > 0 ? editColors[editColors.length - 1] : '#888888';
		editColors.push(last);
	}

	let nameError = $derived(
		editName.trim() === ''
			? 'Name is required'
			: existingPalettes.some((p) => p.id !== palette.id && p.name.trim() === editName)
				? 'Name already exists'
				: null
	);

	let canSave = $derived(nameError === null);

	function handleSave() {
		if (!canSave) return;
		onsave?.({
			name: editName.trim(),
			colors: editColors.map((c, i) => parsedColors[i] ?? c),
			ground: editGround,
			custom: true,
			id: palette.id
		});
	}

	function handleDuplicate() {
		onduplicate?.({
			name: '',
			colors: [...editColors],
			ground: editGround,
			custom: true,
			id: crypto.randomUUID()
		});
	}

	let modalTitle = $derived(
		mode === 'edit' ? (palette.name === '' ? 'New Palette' : 'Edit Palette') : palette.name
	);
</script>

<Modal title={modalTitle} {onclose}>
	<div class="flex flex-col gap-4">
		{#if mode === 'view'}
			<div class="flex flex-col gap-2">
				<SectionTitle>Type</SectionTitle>
				<ButtonGroup items={formats} selected={format} onselect={(f) => (format = f as Format)} />
			</div>
		{:else}
			<div class="flex flex-col gap-1">
				<label class="font-medium text-neutral-200" for="palette-name">Name</label>
				<Input
					id="palette-name"
					error={!!nameError}
					value={editName}
					oninput={(e) => (editName = (e.currentTarget as HTMLInputElement).value)}
					placeholder="My Palette"
				/>
				{#if nameError}
					<p class="text-xs text-red-400">{nameError}</p>
				{/if}
			</div>
		{/if}
		<div class="flex flex-col gap-2">
			<SectionTitle>Colors</SectionTitle>
			{#each editColors as hex, i (i)}
				<div
					class={cn(
						'grid items-center gap-2',
						mode === 'edit' ? 'grid-cols-[auto_1fr_2fr]' : 'grid-cols-[1fr_2fr]'
					)}
				>
					{#if mode === 'edit'}
						<Button
							variant="secondary"
							padding="square"
							class="h-10 w-10"
							onclick={() => (editGround = i)}
						>
							{#if i < editGround}
								<Waves size={16} />
							{:else}
								<Mountain size={16} />
							{/if}
						</Button>
					{/if}
					<button
						class={cn(
							'h-10 w-full shrink-0 rounded-lg',
							'border-2 border-transparent',
							'transition-transform hover:scale-102 hover:cursor-pointer'
						)}
						style="background-color: {hex}"
						onclick={() => copyColor(hex)}
						title={formatColor(hex)}
					></button>
					<Input
						class="font-mono text-sm"
						value={mode === 'edit' ? editColors[i] : formatColor(hex)}
						oninput={(e) => {
							editColors[i] = (e.currentTarget as HTMLInputElement).value;
						}}
						placeholder="#888888"
						readonly={mode === 'view'}
						disabled={mode === 'view'}
					>
						{#snippet trail()}
							<button
								class={cn(
									trailClass,
									'text-neutral-300 hover:cursor-pointer hover:bg-neutral-700',
									copiedHex === hex && 'text-green-400'
								)}
								onclick={() => (mode === 'edit' ? removeColor(i) : copyColor(hex))}
							>
								{#if mode === 'edit'}
									<Trash2 size={16} />
								{:else if copiedHex === hex}
									<Check size={16} />
								{:else}
									<Copy size={16} />
								{/if}
							</button>
						{/snippet}
					</Input>
				</div>
			{/each}
			{#if mode === 'edit'}
				<div class="flex w-full gap-2">
					<DashedButton class="h-10 w-full gap-1 text-sm shadow" onclick={addColor}>
						<Plus size={16} />Add Color
					</DashedButton>
				</div>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<SectionTitle>Actions</SectionTitle>
			<div class="grid grid-cols-3 gap-x-2">
				{#if isSaved}
					<Button
						variant="secondary"
						onclick={handleDuplicate}
						class={cn(mode === 'view' && 'col-span-3')}
					>
						<Copy size={16} /> Duplicate
					</Button>
				{/if}
				{#if mode === 'edit' && isSaved}
					<Button variant="danger" onclick={ondelete} disabled={!canSave}>
						<Trash2 size={16} /> Delete
					</Button>
				{/if}
				{#if mode === 'edit'}
					<Button
						variant="primary"
						onclick={handleSave}
						disabled={!canSave}
						class={cn(!isSaved && 'col-span-3')}
					>
						<Save size={16} /> Save
					</Button>
				{/if}
			</div>
		</div>
	</div>
</Modal>
