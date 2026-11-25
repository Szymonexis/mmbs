import { Data } from '../utils/data-class';

export type Point = [number, number];

const MIN_CELL_PX = 1;
const MAX_CELL_PX = 80;
const STEP_ZOOM_FACTOR = 1.1;

export class GameViewConfig extends Data {
	pos: Point = [0, 0];
	zoom: number = 1.0;
	span: Point = [1000, 1000];
	cellSize: number = 5;
}

const DEFAULT_GAME_VIEW_CONFIG = GameViewConfig.create({
	pos: [0, 0],
	zoom: 1.0,
	cellSize: 10
});

export class GameView {
	get config() {
		return this.__config;
	}

	get cellPx() {
		return this.__config.cellSize * this.__config.zoom;
	}

	constructor(private __config: GameViewConfig = DEFAULT_GAME_VIEW_CONFIG) {}

	resize(span: Point) {
		this.__config = this.__config.copy({ span });
	}

	worldToScreen([x, y]: Point): Point {
		const {
			pos: [pos_x, pos_y],
			span: [width, height]
		} = this.__config;

		return [width / 2 + pos_x + x * this.cellPx, height / 2 + pos_y + y * this.cellPx];
	}

	screenToCell([screen_x, screen_y]: Point): Point {
		const {
			pos: [pos_x, pos_y],
			span: [width, height]
		} = this.__config;

		return [
			Math.floor((screen_x - width / 2 - pos_x) / this.cellPx),
			Math.floor((screen_y - height / 2 - pos_y) / this.cellPx)
		];
	}

	visibleCellRange(): [min: Point, max: Point] {
		const [width, height] = this.__config.span;
		return [this.screenToCell([0, 0]), this.screenToCell([width, height])];
	}

	pan([x, y]: Point) {
		const [x_pos, y_pos] = this.__config.pos;
		this.__config = this.__config.copy({ pos: [x_pos + x, y_pos + y] });
	}

	centerOn([x, y]: Point) {
		this.__config = this.__config.copy({ pos: [-x * this.cellPx, -y * this.cellPx] });
	}

	zoomAt(factor: number, [focus_x, focus_y]: Point) {
		const {
			zoom,
			cellSize,
			pos: [pos_x, pos_y],
			span: [width, height]
		} = this.__config;

		const nextZoom = Math.min(
			Math.max(zoom * factor, MIN_CELL_PX / cellSize),
			MAX_CELL_PX / cellSize
		);
		const ratio = nextZoom / zoom;
		const fromCenter_x = focus_x - width / 2;
		const fromCenter_y = focus_y - height / 2;

		this.__config = this.__config.copy({
			zoom: nextZoom,
			pos: [
				fromCenter_x - (fromCenter_x - pos_x) * ratio,
				fromCenter_y - (fromCenter_y - pos_y) * ratio
			]
		});
	}

	zoomOut() {
		this.zoomAt(1 / STEP_ZOOM_FACTOR, this.screenCenter());
	}

	zoomIn() {
		this.zoomAt(STEP_ZOOM_FACTOR, this.screenCenter());
	}

	private screenCenter(): Point {
		const [width, height] = this.__config.span;
		return [width / 2, height / 2];
	}
}
