<script lang="ts">
	import { LOGOS } from './model';
</script>

<div class="footer__slider">
	<div class="footer__slider__slide footer__slider__slide--first">
		{#each LOGOS as { href, src, alt }}
			<a {href} target="_blank">
				<img {src} {alt} />
			</a>
		{/each}
	</div>

	<div class="footer__slider__slide footer__slider__slide--second">
		{#each LOGOS as { href, src, alt }}
			<a {href} target="_blank">
				<img {src} {alt} />
			</a>
		{/each}
	</div>

	<div class="footer__slider__slide footer__slider__slide--third">
		{#each LOGOS as { href, src, alt }}
			<a {href} target="_blank">
				<img {src} {alt} />
			</a>
		{/each}
	</div>
</div>

<style lang="css">
	@keyframes slideFirst {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(-100%);
		}
	}

	@keyframes slideSecond {
		from {
			transform: translateX(100%);
		}

		to {
			transform: translateX(0%);
		}
	}

	@keyframes slideThird {
		from {
			transform: translateX(200%);
		}

		to {
			transform: translateX(100%);
		}
	}

	:root {
		--animation-duration: 20s;
		--carousel-image-size: 4rem;
		--carousel-image-margin: 1rem;
		--carousel-image-amount: 15;
		--carousel-image-aspect-ratio: 1;
	}

	.footer__slider {
		overflow: hidden;
		position: relative;
		white-space: nowrap;
		height: var(--carousel-image-size);
		width: auto;
	}

	.footer__slider__slide {
		position: absolute;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		flex-direction: row;
		width: calc((var(--carousel-image-size) + var(--carousel-image-margin)) * var(--carousel-image-amount));
		height: var(--carousel-image-size);
	}

	.footer__slider__slide img {
		object-fit: contain;
		width: var(--carousel-image-size);
		aspect-ratio: var(--carousel-image-aspect-ratio);
		margin-right: var(--carousel-image-margin);
		cursor: pointer;
	}

	.footer__slider__slide--first {
		animation: var(--animation-duration) slideFirst infinite linear;
	}

	.footer__slider__slide--second {
		animation: var(--animation-duration) slideSecond infinite linear;
	}

	.footer__slider__slide--third {
		animation: var(--animation-duration) slideThird infinite linear;
	}
</style>
