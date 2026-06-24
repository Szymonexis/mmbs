<script lang="ts">
	import { onMount } from 'svelte';
	import { draw } from './model';
	import * as d3 from 'd3';

	let container: HTMLDivElement;

	let offset = $state({ x: 0, y: 0 });
	let scale = $state({ x: 1, y: 1 });

	let words = ['PROGRAMOWANIE', 'WISIELEC'];

	let word = $state('');
	let guessedLetters = $state<string[]>([]);
	let wrongLetters = $state<string[]>([]);
	let inputLetter = $state('');

	let maxMistakes = 11;
	let step = $derived(wrongLetters.length);

	let displayedWord = $derived(
		word
			.split('')
			.map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
			.join(' ')
	);

	let isWin = $derived(
		word.length > 0 && word.split('').every((letter) => guessedLetters.includes(letter))
	);

	let isLose = $derived(wrongLetters.length >= maxMistakes);

	let message = $derived(isWin ? 'YOU WIN' : isLose ? 'END GAME' : '');

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

			<button onclick={guessLetter} disabled={isWin || isLose}>check</button>
		</div>

		<div class="wrong-letters">
			<p>Wrong letters:</p>

			<div class="letters">
				{#each wrongLetters as letter}
					<span>{letter}</span>
				{/each}
			</div>
		</div>

		{#if message}
			<h3 class:win={isWin} class:lose={isLose}>{message}</h3>

			<button onclick={startGame}>try again</button>
		{/if}
	</div>
</div>

<style>
	.game {
		margin: 20px auto;
		width: 80%;
		min-height: 70vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 22px;
		background-color: #fff8df;
		border-radius: 20px;
		padding: 20px;
	}

	.ludzik {
		position: relative;
		width: 100%;
		max-width: 500px;
		aspect-ratio: 1 / 1;
		border: 2px solid #f4d98c;
		border-radius: 15px;
		background-color: #fffbea;
	}

	.ludzik > div {
		width: 100%;
		height: 100%;
	}

	.panel {
		text-align: center;
	}

	.panel h2 {
		font-size: 40px;
		letter-spacing: 12px;
		margin: 0 0 20px;
		color: #8e44ad;
	}

	.input-row {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin: 20px 0;
	}

	input {
		width: 60px;
		height: 50px;
		text-align: center;
		font-size: 24px;
		font-weight: bold;
		border: 2px solid #f4a340;
		border-radius: 10px;
		background-color: white;
		color: #333;
	}

	input:focus {
		outline: none;
		border-color: #ef476f;
	}

	button {
		padding: 10px 18px;
		background-color: #f97316;
		color: white;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		font-weight: bold;
	}

	button:hover {
		background-color: #ea580c;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	p {
		margin: 6px 0;
		color: #444;
	}

	.wrong-letters {
		margin-top: 20px;
	}

	.wrong-letters p {
		margin-bottom: 10px;
		font-size: 18px;
		font-weight: 600;
		color: #555;
	}

	.letters {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	.letters span {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ef4444;
		color: white;
		border-radius: 10px;
		font-weight: bold;
		font-size: 18px;
	}

	h3 {
		margin-top: 20px;
		margin-bottom: 20px;
		font-size: 24px;
	}

	.win {
		color: #22c55e;
	}

	.lose {
		color: #ef4444;
	}
</style>
