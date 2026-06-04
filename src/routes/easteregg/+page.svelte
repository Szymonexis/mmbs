<script lang="ts">
	import { onMount } from 'svelte';
	import { draw } from './model';
	import * as d3 from 'd3';

	let container: HTMLDivElement;

	let offset = $state({ x: 0, y: 0 });
	let scale = $state({ x: 1, y: 1 });

	let words = ['PROGRAMOWANIE', 'WISIELEC'];

	let word = $state(''); // wylosowane slowo
	let guessedLetters = $state<string[]>([]);
	let wrongLetters = $state<string[]>([]);
	let inputLetter = $state('');

	let maxMistakes = 10;

	let step = $derived(wrongLetters.length); // liczba bledow

	let displayedWord = $derived(
		word
			.split('')
			.map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
			.join(' ')
	);

	let isWin = $derived(
		word.length > 0 &&
			word.split('').every((letter) => guessedLetters.includes(letter))
	);

	let isLose = $derived(wrongLetters.length >= maxMistakes);

	let message = $derived(
		isWin
			? 'you win'
			: isLose
				? `end game`
				: ''
	);

	let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

	onMount(() => {
		svg = d3
			.select(container)
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('viewBox', '0 0 300 300')
			.attr('preserveAspectRatio', 'xMidYMid meet');

		startGame();
		redraw();
	});

	function startGame() {
		const randomIndex = Math.floor(Math.random() * words.length);

		word = words[randomIndex];
		guessedLetters = [];
		wrongLetters = [];
		inputLetter = '';
	}

	function guessLetter() {
		if (isWin || isLose) return;

		const letter = inputLetter.toUpperCase().trim(); 

		inputLetter = '';

		if (letter.length !== 1) return;
		if (guessedLetters.includes(letter)) return;
		if (wrongLetters.includes(letter)) return;

		if (word.includes(letter)) {
			guessedLetters = [...guessedLetters, letter];
		} else {
			wrongLetters = [...wrongLetters, letter];
		}
	}

	function redraw() {
		if (!svg) return;

		draw({
			offset,
			scale,
			step,
			svg
		});
	}

	$effect(() => {
		redraw();
	});
</script>

<div class="game">
	<div class="ludzik">
		<div bind:this={container}></div>
	</div>

	<div class="panel">
		<h2>{displayedWord}</h2>

		<div class="input-row">
			<input
				bind:value={inputLetter}
				maxlength="1"
				disabled={isWin || isLose}
				onkeydown={(event) => {
					if (event.key === 'Enter') {
						guessLetter();
					}
				}}
			/>

			<button onclick={guessLetter} disabled={isWin || isLose}>
				check
			</button>
		</div>

		<p>wrong letters: {wrongLetters.join(' ')}</p>

		{#if message}
			<h3>{message}</h3>

			<button onclick={startGame}>
				try again
			</button>
		{/if}
	</div>
</div>

<style>
	.game {
		width: 100%;
		min-height: 70vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24px;
	}

	.ludzik {
		position: relative;
		width: 100%;
		max-width: 500px;
		aspect-ratio: 1 / 1;
	}

	.ludzik > div {
		width: 100%;
		height: 100%;
	}

	.panel {
		text-align: center;
	}

	.panel h2 {
		font-size: 32px;
	}

	.input-row {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin: 20px 0;
	}

	input {
		width: 50px;
		height: 40px;
		text-align: center;
		font-size: 24px;
	}

	button {
		padding: 10px 18px;
		background-color: #e2e2e2;
	}
</style>