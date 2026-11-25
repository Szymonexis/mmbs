import { Data } from '../utils/data-class';

export class GameViewConfig extends Data {
	pos: [number, number] = [0, 0];
	zoom: number = 1.0;
	span: [number, number] = [1000, 1000];
	cellSize: number = 5;
}

const DEFAULT_GAME_VIEW_CONFIG = GameViewConfig.create({
	pos: [0, 0],
	zoom: 1.0,
	cellSize: 5
});

export class GameView {
	get config() {
		return this.__config;
	}

	constructor(private __config: GameViewConfig = DEFAULT_GAME_VIEW_CONFIG) {}

	pan([x, y]: [number, number]) {
		const [x_pos, y_pos] = this.__config.pos;
		this.__config.pos = [x_pos + x, y_pos + y];
	}

	zoomOut() {
		this.__config.zoom *= 0.9;
	}

	zoomIn() {
		this.__config.zoom *= 1.1;
	}
}
