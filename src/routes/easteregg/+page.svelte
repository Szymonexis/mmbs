<script lang="ts">
	import { onMount } from 'svelte';
	import { drawHangman, type Props } from './model';
	import * as d3 from 'd3';

	let container: HTMLDivElement;

	let offset = $state({ x: 0, y: 0 });
	let scale = $state({ x: 1, y: 1 });
	let step = $state(9);

	let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

	onMount(() => {
		svg = d3
			.select(container)
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('viewBox', '0 0 300 300')
			.attr('preserveAspectRatio', 'xMidYMid meet');

		redraw();
	});

	function redraw() {
		if (!svg) return;
		drawHangman({ offset, scale, step, svg });
	}

	$effect(() => {
		redraw();
	});
</script>

<div class="ludzik">
	<div bind:this={container}></div>
</div>

<style>
	.ludzik {
		position: relative;
		width: 100%;
		min-height: 70vh;
	}

	.ludzik > div {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 700px;
		min-width: 280px;
		aspect-ratio: 1 / 1;
	}
</style>
