<script lang="ts" module>
	export const trailClass =
		'rounded-r-lg border-y-2 border-r-2 border-transparent bg-neutral-800 p-2 px-3 transition-colors peer-focus:border-neutral-400';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		id?: string;
		type?: 'text' | 'number';
		value?: string;
		placeholder?: string;
		error?: boolean;
		readonly?: boolean;
		disabled?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		trail?: Snippet;
	}

	let {
		id,
		type = 'text',
		value = $bindable(''),
		placeholder,
		error = false,
		readonly = false,
		disabled = false,
		class: className,
		oninput,
		onchange,
		trail
	}: Props = $props();

	const base =
		'border-transparent bg-neutral-900 p-2 px-3 text-neutral-300 outline-none placeholder:text-neutral-600 transition-colors focus:border-neutral-400';
</script>

{#if trail}
	<div class="flex">
		<input
			{id}
			{type}
			bind:value
			{placeholder}
			{readonly}
			{disabled}
			{oninput}
			{onchange}
			class={cn(base, 'peer w-full rounded-l-lg border-y-2 border-l-2', className)}
		/>
		{@render trail()}
	</div>
{:else}
	<input
		{id}
		{type}
		bind:value
		{placeholder}
		{readonly}
		{disabled}
		{oninput}
		{onchange}
		class={cn(base, 'rounded-lg border-2', error && 'border-red-500', className)}
	/>
{/if}
