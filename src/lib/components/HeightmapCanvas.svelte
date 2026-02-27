<script lang="ts">
	import type { DisplayMode } from '$lib/data/displaymode';
	import type { Heightmap } from '$lib/data/heightmaps';
	import type { Palette } from '$lib/data/palettes';
	import HeightmapWorker from '$lib/workers/heightmap.worker?worker';
	import { cn } from '$lib/utils/cn';

	interface Props {
		heightmap: Heightmap;
		palette: Palette;
		displayMode: DisplayMode;
	}

	let { heightmap, palette, displayMode }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let container: HTMLDivElement | undefined = $state();
	let naturalWidth = $state(0);
	let naturalHeight = $state(0);
	let progress: number | null = $state(null);
	let panX = $state(0);
	let panY = $state(0);
	let zoom = $state(1);
	let baseScale = $state(0);
	let isDragging = $state(false);

	let touch = {
		lastX: 0,
		lastY: 0,
		isPinching: false,
		dist: 0,
		zoom: 1,
		panX: 0,
		panY: 0,
		midX: 0,
		midY: 0
	};

	function fit() {
		if (!container || !canvas || !naturalWidth || !naturalHeight) return;
		const { width: cw, height: ch } = container.getBoundingClientRect();
		if (cw === 0 || ch === 0) return;
		baseScale = Math.min(cw / naturalWidth, ch / naturalHeight);
		clampPan();
		applyTransform();
	}

	function clampPan() {
		if (!container || !naturalWidth || !naturalHeight || baseScale === 0) return;
		const { width: cw, height: ch } = container.getBoundingClientRect();
		const effectiveW = naturalWidth * baseScale * zoom;
		const effectiveH = naturalHeight * baseScale * zoom;
		const maxPanX = Math.max(0, (effectiveW - cw) / 2);
		const maxPanY = Math.max(0, (effectiveH - ch) / 2);
		panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
		panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
	}

	function applyTransform() {
		if (!canvas || !container || !naturalWidth || !naturalHeight || baseScale === 0) return;
		const { width: cw, height: ch } = container.getBoundingClientRect();
		const effectiveW = naturalWidth * baseScale * zoom;
		const effectiveH = naturalHeight * baseScale * zoom;
		canvas.style.position = 'absolute';
		canvas.style.width = `${effectiveW}px`;
		canvas.style.height = `${effectiveH}px`;
		canvas.style.left = `${(cw - effectiveW) / 2 + panX}px`;
		canvas.style.top = `${(ch - effectiveH) / 2 + panY}px`;
	}

	function zoomAt(cursorX: number, cursorY: number, newZoom: number) {
		const clamped = Math.max(1, Math.min(8, newZoom));
		const ratio = clamped / zoom;
		panX = cursorX - ratio * (cursorX - panX);
		panY = cursorY - ratio * (cursorY - panY);
		zoom = clamped;
		clampPan();
		applyTransform();
	}

	function handleMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;
		isDragging = true;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		panX += e.movementX;
		panY += e.movementY;
		clampPan();
		applyTransform();
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleMouseLeave() {
		isDragging = false;
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const cx = e.clientX - rect.left - rect.width / 2;
		const cy = e.clientY - rect.top - rect.height / 2;
		zoomAt(cx, cy, zoom * (e.deltaY > 0 ? 0.9 : 1.1));
	}

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length === 1) {
			touch.isPinching = false;
			isDragging = true;
			touch.lastX = e.touches[0].clientX;
			touch.lastY = e.touches[0].clientY;
		} else if (e.touches.length === 2) {
			isDragging = false;
			touch.isPinching = true;
			const [t0, t1] = [e.touches[0], e.touches[1]];
			touch.dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
			touch.zoom = zoom;
			touch.panX = panX;
			touch.panY = panY;
			if (container) {
				const rect = container.getBoundingClientRect();
				touch.midX = (t0.clientX + t1.clientX) / 2 - rect.left - rect.width / 2;
				touch.midY = (t0.clientY + t1.clientY) / 2 - rect.top - rect.height / 2;
			}
		}
	}

	function handleTouchMove(e: TouchEvent) {
		e.preventDefault();
		if (e.touches.length === 1 && isDragging) {
			panX += e.touches[0].clientX - touch.lastX;
			panY += e.touches[0].clientY - touch.lastY;
			touch.lastX = e.touches[0].clientX;
			touch.lastY = e.touches[0].clientY;
			clampPan();
			applyTransform();
		} else if (e.touches.length === 2 && touch.isPinching && container) {
			const [t0, t1] = [e.touches[0], e.touches[1]];
			const newDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
			const newZoom = Math.max(1, Math.min(8, touch.zoom * (newDist / touch.dist)));
			const rect = container.getBoundingClientRect();
			const midX = (t0.clientX + t1.clientX) / 2 - rect.left - rect.width / 2;
			const midY = (t0.clientY + t1.clientY) / 2 - rect.top - rect.height / 2;
			const ratio = newZoom / touch.zoom;
			panX = touch.panX + (midX - touch.midX) + (1 - ratio) * (touch.midX - touch.panX);
			panY = touch.panY + (midY - touch.midY) + (1 - ratio) * (touch.midY - touch.panY);
			zoom = newZoom;
			clampPan();
			applyTransform();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		const panStep = 30;
		switch (e.key) {
			case 'ArrowLeft':
				panX += panStep;
				clampPan();
				applyTransform();
				e.preventDefault();
				break;
			case 'ArrowRight':
				panX -= panStep;
				clampPan();
				applyTransform();
				e.preventDefault();
				break;
			case 'ArrowUp':
				panY += panStep;
				clampPan();
				applyTransform();
				e.preventDefault();
				break;
			case 'ArrowDown':
				panY -= panStep;
				clampPan();
				applyTransform();
				e.preventDefault();
				break;
			case '+':
				zoomAt(0, 0, zoom * 1.2);
				e.preventDefault();
				break;
			case '-':
				zoomAt(0, 0, zoom * 0.8);
				e.preventDefault();
				break;
			case '0':
				zoom = 1;
				panX = 0;
				panY = 0;
				fit();
				e.preventDefault();
				break;
		}
	}

	function handleTouchEnd(e: TouchEvent) {
		if (e.touches.length < 2) touch.isPinching = false;
		if (e.touches.length === 1) {
			isDragging = true;
			touch.lastX = e.touches[0].clientX;
			touch.lastY = e.touches[0].clientY;
		}
		if (e.touches.length === 0) isDragging = false;
	}

	$effect(() => {
		const c = canvas;
		if (!c) return;

		const ctx = c.getContext('2d');
		if (!ctx) return;

		const src = heightmap.src;
		const midpoint = heightmap.midpoint;
		const colors = $state.snapshot(palette.colors);
		const ground = palette.ground;
		const mode = displayMode;

		const fullRange = ground === 0;
		const numBelow = ground;
		const numAbove = colors.length - ground;
		if (!fullRange && (numBelow === 0 || numAbove === 0)) return;

		const controller = new AbortController();
		const worker = new HeightmapWorker();
		progress = 0;

		worker.onmessage = (e: MessageEvent) => {
			const msg = e.data;
			if (msg.type === 'progress') {
				progress = msg.percent;
			} else if (msg.type === 'done') {
				const { buffer, width, height } = msg;
				naturalWidth = width;
				naturalHeight = height;
				c.width = width;
				c.height = height;
				ctx.putImageData(new ImageData(new Uint8ClampedArray(buffer), width, height), 0, 0);
				zoom = 1;
				panX = 0;
				panY = 0;
				fit();
				progress = null;
				worker.terminate();
			} else if (msg.type === 'error') {
				console.error('HeightmapWorker error:', msg.message);
				progress = null;
				worker.terminate();
			}
		};

		fetch(src, { signal: controller.signal })
			.then((r) => r.arrayBuffer())
			.then((buffer) => {
				worker.postMessage({ buffer, midpoint, colors, ground, mode }, [buffer]);
			})
			.catch((err) => {
				if (err.name !== 'AbortError') throw err;
			});

		return () => {
			controller.abort();
			worker.terminate();
			progress = null;
		};
	});

	$effect(() => {
		if (!container) return;
		const ro = new ResizeObserver(() => fit());
		ro.observe(container);
		return () => ro.disconnect();
	});

	$effect(() => {
		if (!container) return;
		container.addEventListener('wheel', handleWheel, { passive: false });
		container.addEventListener('touchmove', handleTouchMove, { passive: false });
		return () => {
			container!.removeEventListener('wheel', handleWheel);
			container!.removeEventListener('touchmove', handleTouchMove);
		};
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={container}
	class={cn(
		'relative h-full w-full overflow-hidden',
		isDragging ? 'cursor-grabbing' : 'cursor-grab'
	)}
	role="application"
	aria-label="Heightmap canvas"
	tabindex="0"
	onkeydown={handleKeyDown}
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseLeave}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
>
	{#if progress !== null}
		<div
			class={cn('absolute inset-0 z-10 flex flex-col items-center justify-center', 'bg-black/40')}
		>
			<div class={cn('w-48 overflow-hidden rounded-full', 'bg-white/20')}>
				<div
					class="h-1.5 bg-white transition-[width] duration-100"
					style="width: {progress}%"
				></div>
			</div>
		</div>
	{/if}
	<canvas bind:this={canvas}></canvas>
</div>
