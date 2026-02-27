<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		onmenutoggle?: () => void;
	}

	let { onmenutoggle }: Props = $props();
</script>

<div
	class={cn(
		'relative flex h-16 w-full shrink-0 items-center justify-center',
		'bg-neutral-800 shadow-lg',
		'font-serif text-3xl font-semibold text-neutral-50 capitalize'
	)}
>
	ELEVATINT
	{#if onmenutoggle}
		<button
			class={cn(
				'absolute top-0 right-4 bottom-0 flex items-center justify-center',
				'text-neutral-300 transition-colors hover:cursor-pointer hover:text-neutral-100'
			)}
			onclick={onmenutoggle}
			aria-label="Toggle menu"
		>
			<Menu size={30} />
		</button>
	{/if}
</div>
