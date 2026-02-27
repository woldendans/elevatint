import { decode } from 'fast-png';
import { interpolate, rgb as toRgb } from 'culori';
import type { DisplayMode } from '$lib/data/displaymode';

interface WorkerInput {
	buffer: ArrayBuffer;
	midpoint: number;
	colors: string[];
	ground: number;
	mode: DisplayMode;
}

function hexToRgb(hex: string): [number, number, number] {
	return [
		parseInt(hex.slice(1, 3), 16),
		parseInt(hex.slice(3, 5), 16),
		parseInt(hex.slice(5, 7), 16)
	];
}

/** Maps a normalized height value to a fractional palette position for interpolated modes. */
function computePos(
	v: number,
	fullRange: boolean,
	min: number,
	max: number,
	seaLevel: number,
	belowRange: number,
	aboveRange: number,
	numBelow: number,
	numAbove: number,
	ground: number,
	numColors: number
): number {
	if (fullRange) {
		const t = max > min ? (v - min) / (max - min) : 0;
		return t * (numColors - 1);
	} else if (v <= seaLevel) {
		const t = belowRange > 0 ? (v - min) / belowRange : 0;
		return t * (numBelow - 1);
	} else {
		const t = aboveRange > 0 ? (v - seaLevel) / aboveRange : 0;
		return ground + t * (numAbove - 1);
	}
}

self.onmessage = (e: MessageEvent<WorkerInput>) => {
	const { buffer, midpoint, colors, ground, mode } = e.data;

	try {
		const png = decode(buffer);
		const { width, height, data, depth, channels } = png;

		const n = width * height;
		const maxVal = depth === 16 ? 65535 : 255;
		const gray = new Float32Array(n);
		for (let i = 0; i < n; i++) gray[i] = data[i * channels] / maxVal;

		let min = 1,
			max = 0;
		for (let i = 0; i < n; i++) {
			if (gray[i] < min) min = gray[i];
			if (gray[i] > max) max = gray[i];
		}

		const fullRange = ground === 0;
		const numBelow = ground;
		const numAbove = colors.length - ground;

		const seaLevel = min + midpoint * (max - min);
		const belowRange = seaLevel - min;
		const aboveRange = max - seaLevel;

		const rgbs = colors.map(hexToRgb);
		const segs =
			mode === 'Continuous' || mode === 'Hillshade'
				? colors.slice(0, -1).map((_, i) => interpolate([colors[i], colors[i + 1]], 'oklch'))
				: null;

		const altitude = 35 * (Math.PI / 180);
		const azimuth = 315 * (Math.PI / 180);
		const HS_LX = Math.cos(altitude) * Math.sin(azimuth);
		const HS_LY = -Math.cos(altitude) * Math.cos(azimuth);
		const HS_LZ = Math.sin(altitude);
		const HS_ZSCALE = 6.0;

		const out = new Uint8ClampedArray(n * 4);
		const step = Math.max(1, Math.floor(n / 50));
		let lastPercent = -1;

		for (let i = 0; i < n; i++) {
			if (i % step === 0) {
				const percent = Math.round((i / n) * 100);
				if (percent !== lastPercent) {
					self.postMessage({ type: 'progress', percent });
					lastPercent = percent;
				}
			}

			const v = gray[i];
			let r: number, g: number, b: number;

			if (mode === 'Continuous') {
				const pos = computePos(
					v,
					fullRange,
					min,
					max,
					seaLevel,
					belowRange,
					aboveRange,
					numBelow,
					numAbove,
					ground,
					colors.length
				);
				const idx = Math.min(Math.floor(pos), segs!.length - 1);
				const col = toRgb(segs![idx](pos - idx))!;
				r = Math.round(Math.max(0, Math.min(1, col.r ?? 0)) * 255);
				g = Math.round(Math.max(0, Math.min(1, col.g ?? 0)) * 255);
				b = Math.round(Math.max(0, Math.min(1, col.b ?? 0)) * 255);
			} else if (mode === 'Bands') {
				let colorIdx: number;
				if (fullRange) {
					const t = max > min ? (v - min) / (max - min) : 0;
					colorIdx = Math.min(Math.floor(t * colors.length), colors.length - 1);
				} else if (v <= seaLevel) {
					const t = belowRange > 0 ? (v - min) / belowRange : 0;
					colorIdx = Math.min(Math.floor(t * numBelow), numBelow - 1);
				} else {
					const t = aboveRange > 0 ? (v - seaLevel) / aboveRange : 0;
					colorIdx = ground + Math.min(Math.floor(t * numAbove), numAbove - 1);
				}
				[r, g, b] = rgbs[colorIdx];
			} else {
				// Hillshade: interpolated color + normal-mapped lighting
				const pos = computePos(
					v,
					fullRange,
					min,
					max,
					seaLevel,
					belowRange,
					aboveRange,
					numBelow,
					numAbove,
					ground,
					colors.length
				);
				const idx = Math.min(Math.floor(pos), segs!.length - 1);
				const col = toRgb(segs![idx](pos - idx))!;
				r = Math.round(Math.max(0, Math.min(1, col.r ?? 0)) * 255);
				g = Math.round(Math.max(0, Math.min(1, col.g ?? 0)) * 255);
				b = Math.round(Math.max(0, Math.min(1, col.b ?? 0)) * 255);

				const px = i % width;
				const py = Math.floor(i / width);
				const gL = gray[py * width + Math.max(0, px - 1)];
				const gR = gray[py * width + Math.min(width - 1, px + 1)];
				const gU = gray[Math.max(0, py - 1) * width + px];
				const gD = gray[Math.min(height - 1, py + 1) * width + px];
				const dzdx = (gR - gL) * 0.5 * HS_ZSCALE;
				const dzdy = (gD - gU) * 0.5 * HS_ZSCALE;
				const len = Math.sqrt(dzdx * dzdx + dzdy * dzdy + 1);
				const hs = Math.max(0, (-dzdx * HS_LX + -dzdy * HS_LY + HS_LZ) / len);
				const factor = Math.max(0.2, hs / HS_LZ);
				r = Math.min(255, Math.round(r * factor));
				g = Math.min(255, Math.round(g * factor));
				b = Math.min(255, Math.round(b * factor));
			}

			out[i * 4] = r;
			out[i * 4 + 1] = g;
			out[i * 4 + 2] = b;
			out[i * 4 + 3] = 255;
		}

		self.postMessage(
			{ type: 'done', buffer: out.buffer, width, height },
			{ transfer: [out.buffer] }
		);
	} catch (err) {
		self.postMessage({ type: 'error', message: String(err) });
	}
};
