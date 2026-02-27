<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger';
		padding?: 'rectangle' | 'square';
		disabled?: boolean;
		class?: string;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'secondary',
		disabled = false,
		padding = 'rectangle',
		class: className,
		onclick,
		children
	}: Props = $props();

	const base =
		'flex items-center justify-center gap-1 rounded-lg border-2 border-transparent font-medium shadow transition-all hover:cursor-pointer p-2 px-3';

	const variants = {
		primary:
			'bg-neutral-200 text-neutral-800 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none',
		secondary:
			'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-50',
		danger:
			'bg-red-900 text-neutral-300 hover:bg-red-800 hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-50'
	};
</script>

<button
	class={cn(base, variants[variant], padding === 'square' && 'p-2', className)}
	{disabled}
	{onclick}
>
	{@render children()}
</button>
