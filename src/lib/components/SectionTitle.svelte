<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<p class="font-medium text-neutral-200">{@render children()}</p>
	<div class="mx-2 my-3 h-px w-full rounded-full bg-neutral-700"></div>
</div>
