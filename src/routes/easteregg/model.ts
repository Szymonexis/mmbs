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

	const orange = '#fb923c';
	const red = '#dc2626';
	const pink = '#ef476f';
	const rope = '#7c2d12';
	const body = '#333333';

	svg.selectAll('*').remove();

	const centerX = 150 + offsetX;
	const centerY = 150 + offsetY;

	const g = svg
		.append('g')
		.attr('transform', `translate(${centerX}, ${centerY}) scale(${scaleX}, ${scaleY})`);

	const parts = [
		() =>
			g
				.append('line')
				.attr('x1', -110)
				.attr('y1', 110)
				.attr('x2', 110)
				.attr('y2', 110)
				.attr('stroke', orange)
				.attr('stroke-width', 10)
				.attr('stroke-linecap', 'round'),

		() =>
			g
				.append('line')
				.attr('x1', -70)
				.attr('y1', 110)
				.attr('x2', -70)
				.attr('y2', -120)
				.attr('stroke', red)
				.attr('stroke-width', 10)
				.attr('stroke-linecap', 'round'),

		() =>
			g
				.append('line')
				.attr('x1', -70)
				.attr('y1', -120)
				.attr('x2', 80)
				.attr('y2', -120)
				.attr('stroke', orange)
				.attr('stroke-width', 10)
				.attr('stroke-linecap', 'round'),

		() =>
			g
				.append('line')
				.attr('x1', -65)
				.attr('y1', -50)
				.attr('x2', -20)
				.attr('y2', -115)
				.attr('stroke', pink)
				.attr('stroke-width', 10)
				.attr('stroke-linecap', 'round'),

		() =>
			g
				.append('line')
				.attr('x1', 45)
				.attr('y1', -120)
				.attr('x2', 45)
				.attr('y2', -70)
				.attr('stroke', rope)
				.attr('stroke-width', 8)
				.attr('stroke-linecap', 'round'),

		() =>
			g
				.append('circle')
				.attr('cx', 45)
				.attr('cy', -45)
				.attr('r', 24)
				.attr('fill', 'none')
				.attr('stroke', body)
				.attr('stroke-width', 4),

		() =>
			g
				.append('line')
				.attr('x1', 45)
				.attr('y1', -20)
				.attr('x2', 45)
				.attr('y2', 38)
				.attr('stroke', body)
				.attr('stroke-width', 4),

		() =>
			g
				.append('line')
				.attr('x1', 45)
				.attr('y1', -5)
				.attr('x2', 5)
				.attr('y2', 25)
				.attr('stroke', body)
				.attr('stroke-width', 4),

		() =>
			g
				.append('line')
				.attr('x1', 45)
				.attr('y1', -5)
				.attr('x2', 85)
				.attr('y2', 25)
				.attr('stroke', body)
				.attr('stroke-width', 4),

		() =>
			g
				.append('line')
				.attr('x1', 45)
				.attr('y1', 38)
				.attr('x2', 18)
				.attr('y2', 75)
				.attr('stroke', body)
				.attr('stroke-width', 4),

		() =>
			g
				.append('line')
				.attr('x1', 45)
				.attr('y1', 38)
				.attr('x2', 72)
				.attr('y2', 75)
				.attr('stroke', body)
				.attr('stroke-width', 4)
	];

	for (let i = 0; i < step; i++) {
		parts[i]();
	}
}
