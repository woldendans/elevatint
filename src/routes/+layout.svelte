<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
	<title>ELEVATINT</title>
	<meta
		name="description"
		content="A small prototyping tool for visualizing heightmaps with hypsometric palettes. Quickly preview how a color ramp reads on terrain — useful for map-making and game development."
	/>

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://woldendans.github.io/elevatint" />
	<meta property="og:title" content="ELEVATINT" />
	<meta
		property="og:description"
		content="A small prototyping tool for visualizing heightmaps with hypsometric palettes. Quickly preview how a color ramp reads on terrain — useful for map-making and game development."
	/>
	<meta property="og:image" content="https://woldendans.github.io/elevatint/og-image.png" />

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="ELEVATINT" />
	<meta
		name="twitter:description"
		content="A small prototyping tool for visualizing heightmaps with hypsometric palettes. Quickly preview how a color ramp reads on terrain — useful for map-making and game development."
	/>
	<meta name="twitter:image" content="https://woldendans.github.io/elevatint/og-image.png" />

	<link rel="canonical" href="https://woldendans.github.io/elevatint" />

	<!-- Umami — self-hosted visitor count -->
	<script defer src="https://analytics.wdsrv.fr/script.js" data-website-id="5836d075-cc2a-4d14-aea9-bea8ee539afa" data-domains="woldendans.github.io"></script>
</svelte:head>
{@render children()}
