<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		onclick?: () => void;
		children: Snippet;
	}

	let { class: className, onclick, children }: Props = $props();
</script>

<button
	class={cn(
		'flex items-center justify-center rounded-lg border-2 border-dashed border-neutral-400 bg-neutral-800 text-neutral-400 transition-all hover:cursor-pointer hover:border-neutral-200 hover:text-neutral-200',
		className
	)}
	{onclick}
>
	{@render children()}
</button>
