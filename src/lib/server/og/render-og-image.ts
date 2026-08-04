import { read } from '$app/server';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

import logoUrl from './assets/mmbs-logo.png';
import rethinkSans400Url from './assets/rethink-sans-400.ttf';
import rethinkSans700Url from './assets/rethink-sans-700.ttf';
import unbounded600Url from './assets/unbounded-600.ttf';

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_WIDTH = 280;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 373) / 720);

const BLUE = '#193cb8';
const BACKGROUND = '#fcfdf7';
const TEXT = '#1f2937';

const assets = Promise.all([
	read(logoUrl).arrayBuffer(),
	read(unbounded600Url).arrayBuffer(),
	read(rethinkSans400Url).arrayBuffer(),
	read(rethinkSans700Url).arrayBuffer()
]);

function ogElement(logoSrc: string, heading: string, description: string) {
	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '100%',
				height: '100%',
				padding: '60px 72px 72px',
				backgroundColor: BACKGROUND,
				fontFamily: 'Rethink Sans'
			},
			children: [
				{
					type: 'img',
					props: { src: logoSrc, width: LOGO_WIDTH, height: LOGO_HEIGHT }
				},
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column', gap: '28px' },
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontFamily: 'Unbounded',
										fontWeight: 600,
										fontSize: '68px',
										color: BLUE
									},
									children: heading
								}
							},
							{
								type: 'div',
								props: {
									style: {
										fontSize: '32px',
										lineHeight: 1.4,
										color: TEXT,
										maxWidth: '980px'
									},
									children: description
								}
							}
						]
					}
				},
				{
					type: 'div',
					props: {
						style: { display: 'flex', fontWeight: 700, fontSize: '28px', color: BLUE },
						children: 'mmbs.pl'
					}
				},
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							left: 0,
							bottom: 0,
							width: `${WIDTH}px`,
							height: '20px',
							backgroundColor: BLUE
						}
					}
				}
			]
		}
	};
}

export async function renderOgImage(
	heading: string,
	description: string
): Promise<Uint8Array<ArrayBuffer>> {
	const [logo, unbounded600, rethinkSans400, rethinkSans700] = await assets;
	const logoSrc = `data:image/png;base64,${Buffer.from(logo).toString('base64')}`;

	const svg = await satori(ogElement(logoSrc, heading, description), {
		width: WIDTH,
		height: HEIGHT,
		fonts: [
			{ name: 'Unbounded', data: unbounded600, weight: 600, style: 'normal' },
			{ name: 'Rethink Sans', data: rethinkSans400, weight: 400, style: 'normal' },
			{ name: 'Rethink Sans', data: rethinkSans700, weight: 700, style: 'normal' }
		]
	});

	return new Uint8Array(
		new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng()
	);
}
