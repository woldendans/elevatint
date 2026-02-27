<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		title: string;
		onclose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { title, onclose, children, footer }: Props = $props();

	const isDesktop =
		typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-60 bg-black/60"
	transition:fade={{ duration: 200 }}
	role="presentation"
	onclick={onclose}
></div>

<div
	class={cn(
		'fixed z-60 flex flex-col overflow-hidden bg-neutral-600 shadow-2xl',
		'right-0 bottom-0 left-0 mx-auto max-h-dvh w-full max-w-2xl rounded-t-2xl',
		'md:top-1/2 md:right-auto md:bottom-auto md:left-1/2',
		'md:max-h-[85dvh] md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl'
	)}
	transition:fly={isDesktop
		? { y: -20, duration: 250, easing: cubicOut }
		: { y: 800, duration: 350, easing: cubicOut }}
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
>
	<div class="flex shrink-0 items-center justify-between bg-neutral-900 px-4 py-3">
		<h2 id="modal-title" class="font-semibold text-neutral-100">{title}</h2>
		<button
			class="text-neutral-400 transition-colors hover:cursor-pointer hover:text-neutral-100"
			onclick={onclose}
			aria-label="Close"
		>
			✕
		</button>
	</div>

	<div class="flex flex-1 flex-col overflow-y-auto p-4">
		{@render children()}
	</div>

	{#if footer}
		{@render footer()}
	{/if}
</div>
