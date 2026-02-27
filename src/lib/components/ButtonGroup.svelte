<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		items: readonly string[];
		selected: string;
		onselect: (item: string) => void;
	}

	let { items, selected, onselect }: Props = $props();
</script>

<div class="group flex w-full items-center justify-center shadow">
	{#each items as item (item)}
		<button
			class={cn(
				'grow border-y-2 border-r-2 border-neutral-900 p-2 px-3 transition-all',
				'first:rounded-l-lg first:border-l-2 last:rounded-r-lg',
				'hover:z-10 hover:cursor-pointer',
				selected === item
					? 'bg-neutral-200 text-neutral-700 shadow-inner hover:bg-neutral-200'
					: 'bg-neutral-800 text-neutral-50 hover:bg-neutral-700'
			)}
			onclick={() => onselect(item)}
		>
			{item}
		</button>
	{/each}
</div>
