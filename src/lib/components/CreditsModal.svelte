<script lang="ts">
	import Modal from './Modal.svelte';
	import SectionTitle from './SectionTitle.svelte';

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();
</script>

{#snippet creditEntry(author: string, href: string, linkText: string)}
	<p class="text-neutral-200">
		{author} —
		<a
			{href}
			target="_blank"
			rel="noopener noreferrer"
			class="text-neutral-400 underline hover:text-neutral-300">{linkText}</a
		>
	</p>
{/snippet}

<Modal title="Credits" {onclose}>
	<div class="flex flex-col gap-2 text-sm">
		<section class="flex flex-col gap-2">
			<SectionTitle>Heightmaps</SectionTitle>
			<div class="flex flex-col">
				{@render creditEntry(
					'manticorp',
					'https://manticorp.github.io/unrealheightmap/',
					'16-bit Heightmap Generator for Unreal Engine'
				)}
				<p class="text-neutral-400">
					Map data © <a
						href="https://www.mapzen.com"
						target="_blank"
						rel="noopener noreferrer"
						class="underline hover:text-neutral-300">Mapzen</a
					>,
					<a
						href="https://www.openstreetmap.org/copyright"
						target="_blank"
						rel="noopener noreferrer"
						class="underline hover:text-neutral-300">OpenStreetMap</a
					>, and others
				</p>
			</div>
		</section>

		<section class="flex flex-col gap-2">
			<SectionTitle>Palettes</SectionTitle>
			<div class="flex flex-col">
				{@render creditEntry(
					'Tom Patterson & Nathaniel Vaughn Kelso',
					'https://www.naturalearthdata.com',
					'naturalearthdata.com'
				)}
				{@render creditEntry(
					'Nathaniel J. Smith, Stefan van der Walt',
					'https://bids.github.io/colormap/',
					'bids.github.io/colormap'
				)}
				{@render creditEntry(
					'M. Burak Yıkılmaz, Wikipedia collection, Fred M. Erickson, GMT collection',
					'http://seaviewsensing.com/pub/cpt-city/',
					'cpt-city archive'
				)}
			</div>
		</section>
	</div>
</Modal>
