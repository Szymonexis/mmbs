<script lang="ts">
	import { onMount } from 'svelte';
	import { GameState } from './game/game-state';
	import { GameView } from './game/game-view';

	const SIM_MS = 150;
	const MAX_CATCHUP = 5;

	let tickCount = 0;
	let width = 0;
	let height = 0;

	let fps = $state(0);
	let ticks = $state(0);

	let canvas: HTMLCanvasElement;

	const gameState = new GameState([{ pattern: 'Diamond', offset: [0, 0] }]);
	const gameView = new GameView();

	function step(dt: number) {
		console.log({ dt });
		gameState.nextIteration();
	}

	function render(ctx: CanvasRenderingContext2D, alpha: number) {
		console.log({ alpha });

		const {
			cellSize,
			zoom,
			pos: [pos_x, pos_y]
		} = gameView.config;
		ctx.clearRect(0, 0, width, height);

		for (const cell of gameState.world) {
			ctx.fillStyle = 'white';
			const [x, y] = cell.pos;
			ctx.fillRect(
				(x - cellSize / 2) * cellSize + pos_x + width / 2,
				(y - cellSize / 2) * cellSize + pos_y + height / 2,
				cellSize * zoom,
				cellSize * zoom
			);
		}
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		resize();

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		let raf = 0;
		let last = performance.now();
		let acc = 0;
		let frames = 0;
		let fpsTimer = last;

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);

			acc += Math.max(0, Math.min(now - last, SIM_MS * MAX_CATCHUP));
			last = now;

			while (acc >= SIM_MS) {
				step(SIM_MS / 1000);
				tickCount++;
				acc -= SIM_MS;
			}

			render(ctx, acc / SIM_MS);

			frames++;
			if (now - fpsTimer >= 500) {
				fps = Math.round((frames * 1000) / (now - fpsTimer));
				ticks = tickCount;
				frames = 0;
				fpsTimer = now;
			}
		};

		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} class="absolute top-0 left-0 z-1000 h-full w-full bg-black"></canvas>

<div class="pointer-events-none absolute top-2 left-2 z-1001 font-mono text-xs text-white/70">
	{fps} fps · {ticks} ticks
</div>
