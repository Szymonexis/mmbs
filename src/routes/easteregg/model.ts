import * as d3 from 'd3';

export type Props = {
	offset: {
		x: number;
		y: number;
	};
	scale: {
		x: number;
		y: number;
	};
	step: number;
	svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
};

export function draw({ offset, scale, step, svg }: Props) {
	const { x: offsetX, y: offsetY } = offset;
	const { x: scaleX, y: scaleY } = scale;

	svg.selectAll('*').remove();

	const centerX = 150 + offsetX;
	const centerY = 150 + offsetY;

	const g = svg
		.append('g')
		.attr('transform', `translate(${centerX}, ${centerY}) scale(${scaleX}, ${scaleY})`);

	const parts = [ // 10 elementow wisielca
		() => // podstawa
			g.append('line') 
				.attr('x1', -100)
				.attr('y1', 110)
				.attr('x2', 100)
				.attr('y2', 110)
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // slup
			g.append('line')
				.attr('x1', -70)
				.attr('y1', 110)
				.attr('x2', -70)
				.attr('y2', -120)
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // gora
			g.append('line')
				.attr('x1', -71.5)
				.attr('y1', -120)
				.attr('x2', 31.5)
				.attr('y2', -120)
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // sznurek
			g.append('line')
				.attr('x1', 30)
				.attr('y1', -120)
				.attr('x2', 30)
				.attr('y2', -70)
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // glowa
			g.append('circle')
				.attr('cx', 30)
				.attr('cy', -45)
				.attr('r', 25)
				.attr('fill', 'none')
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // tulow
			g.append('line')
				.attr('x1', 30)
				.attr('y1', -20)
				.attr('x2', 30)
				.attr('y2', 40)
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // lewa reka
			g.append('line')
				.attr('x1', 30)
				.attr('y1', -5)
				.attr('x2', -10)
				.attr('y2', 25)
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // prawa reka
			g.append('line')
				.attr('x1', 30)
				.attr('y1', -5)
				.attr('x2', 70)
				.attr('y2', 25)
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // lewa noga
			g.append('line')
				.attr('x1', 30)
				.attr('y1', 40)
				.attr('x2', 5)
				.attr('y2', 75)
				.attr('stroke', 'black')
				.attr('stroke-width', 3),

		() => // prawa noga
			g.append('line')
				.attr('x1', 30)
				.attr('y1', 40)
				.attr('x2', 55)
				.attr('y2', 75)
				.attr('stroke', 'black')
				.attr('stroke-width', 3)
	];

	for (let i = 0; i < step; i++) {
		parts[i]();
	}
}