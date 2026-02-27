import worldPng from '$lib/assets/heightmaps/world.png';
import worldThumb from '$lib/assets/heightmaps/world_thumb.jpg';
import naPng from '$lib/assets/heightmaps/na.png';
import naThumb from '$lib/assets/heightmaps/na_thumb.jpg';
import swissPng from '$lib/assets/heightmaps/swiss.png';
import swissThumb from '$lib/assets/heightmaps/swiss_thumb.jpg';
import southSudanPng from '$lib/assets/heightmaps/south_sudan.png';
import southSudanThumb from '$lib/assets/heightmaps/south_sudan_thumb.jpg';
import caraibbean from '$lib/assets/heightmaps/caraibbean.png';
import caraibbeanthumb from '$lib/assets/heightmaps/caraibbean_thumb.jpg';
import corsicaPng from '$lib/assets/heightmaps/corsica.png';
import corsicaThumb from '$lib/assets/heightmaps/corsica_thumb.jpg';
import fujiPng from '$lib/assets/heightmaps/fuji.png';
import fujiThumb from '$lib/assets/heightmaps/fuji_thumb.jpg';
import azurPng from '$lib/assets/heightmaps/azur.png';
import azurThumb from '$lib/assets/heightmaps/azur_thumb.jpg';
import grandCanyonPng from '$lib/assets/heightmaps/grand_canyon.png';
import grandCanyonThumb from '$lib/assets/heightmaps/grand_canyon_thumb.jpg';

// Sentinel value for heightmaps with no sea level (land-only regions)
export const NO_SEA_LEVEL = -0.00001;

export const heightmaps = [
	{ name: 'World', src: worldPng, thumbSrc: worldThumb, midpoint: 0.5 },
	{ name: 'North America', src: naPng, thumbSrc: naThumb, midpoint: 0.632833106 },
	{ name: 'Swiss', src: swissPng, thumbSrc: swissThumb, midpoint: NO_SEA_LEVEL },
	{ name: 'South Sudan', src: southSudanPng, thumbSrc: southSudanThumb, midpoint: NO_SEA_LEVEL },
	{ name: 'Caraibbean Sea', src: caraibbean, thumbSrc: caraibbeanthumb, midpoint: 0.627037873 },
	{ name: 'Corsica', src: corsicaPng, thumbSrc: corsicaThumb, midpoint: 0.507741806 },
	{ name: 'Mt. Fuji', src: fujiPng, thumbSrc: fujiThumb, midpoint: NO_SEA_LEVEL },
	{ name: 'French Riviera', src: azurPng, thumbSrc: azurThumb, midpoint: 0.003674299 },
	{ name: 'Grand Canyon', src: grandCanyonPng, thumbSrc: grandCanyonThumb, midpoint: NO_SEA_LEVEL }
];

export type Heightmap = (typeof heightmaps)[number];
