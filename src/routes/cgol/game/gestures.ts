import type { Point } from './game-view';

const DRAW_SLOP_PX = 6;
const WHEEL_ZOOM_PER_PX = 0.0015;
const PINCH_WHEEL_ZOOM_PER_PX = 0.01;
const PINCH_WHEEL_MAX_STEP_PX = 12;
const WHEEL_LINE_PX = 16;

const PRIMARY_BUTTON = 0;
const SECONDARY_BUTTON = 2;

export interface GestureHandlers {
	draw(from: Point, to: Point): void;
	pan(delta: Point): void;
	zoom(factor: number, focus: Point): void;
}

type Mode = 'idle' | 'pressing' | 'drawing' | 'panning' | 'multitouch';

interface Pinch {
	distance: number;
	midpoint: Point;
}

export function attachGestures(element: HTMLElement, handlers: GestureHandlers): () => void {
	const pointers = new Map<number, Point>();
	let activePointerType: string | null = null;
	let mode: Mode = 'idle';
	let pressStart: Point = [0, 0];
	let pinch: Pinch | null = null;

	const toLocal = (event: MouseEvent): Point => {
		const rect = element.getBoundingClientRect();
		return [event.clientX - rect.left, event.clientY - rect.top];
	};

	const currentPinch = (): Pinch => {
		const [[a_x, a_y], [b_x, b_y]] = pointers.values();
		return {
			distance: Math.hypot(b_x - a_x, b_y - a_y),
			midpoint: [(a_x + b_x) / 2, (a_y + b_y) / 2]
		};
	};

	const track = (event: PointerEvent) => {
		element.setPointerCapture(event.pointerId);
		pointers.set(event.pointerId, toLocal(event));
		activePointerType = event.pointerType;
	};

	const release = (pointerId: number) => {
		pointers.delete(pointerId);

		if (pointers.size === 0) {
			mode = 'idle';
			pinch = null;
			activePointerType = null;
		} else if (mode === 'multitouch') {
			pinch = pointers.size >= 2 ? currentPinch() : null;
		}
	};

	const onMouseLikeDown = (event: PointerEvent) => {
		if (pointers.size > 0) return;
		if (event.button !== PRIMARY_BUTTON && event.button !== SECONDARY_BUTTON) return;

		track(event);
		pressStart = toLocal(event);
		mode = event.button === SECONDARY_BUTTON ? 'panning' : 'pressing';
	};

	const onTouchDown = (event: PointerEvent) => {
		track(event);
		if (pointers.size === 1) {
			pressStart = toLocal(event);
			mode = 'pressing';
		} else {
			mode = 'multitouch';
			pinch = currentPinch();
		}
	};

	const onPointerDown = (event: PointerEvent) => {
		if (activePointerType !== null && activePointerType !== event.pointerType) return;

		if (event.pointerType === 'touch') {
			onTouchDown(event);
		} else {
			onMouseLikeDown(event);
		}
	};

	const onPointerMove = (event: PointerEvent) => {
		const previous = pointers.get(event.pointerId);
		if (!previous) return;

		const current = toLocal(event);
		pointers.set(event.pointerId, current);

		switch (mode) {
			case 'panning':
				handlers.pan([current[0] - previous[0], current[1] - previous[1]]);
				return;
			case 'pressing':
				if (Math.hypot(current[0] - pressStart[0], current[1] - pressStart[1]) < DRAW_SLOP_PX) {
					return;
				}
				mode = 'drawing';
				handlers.draw(pressStart, current);
				return;
			case 'drawing':
				handlers.draw(previous, current);
				return;
			case 'multitouch': {
				if (pointers.size < 2) return;

				const next = currentPinch();
				if (pinch) {
					handlers.pan([
						next.midpoint[0] - pinch.midpoint[0],
						next.midpoint[1] - pinch.midpoint[1]
					]);
					if (pinch.distance > 0 && next.distance > 0) {
						handlers.zoom(next.distance / pinch.distance, next.midpoint);
					}
				}
				pinch = next;
				return;
			}
		}
	};

	const onPointerUp = (event: PointerEvent) => {
		if (!pointers.has(event.pointerId)) return;

		if (mode === 'pressing') {
			handlers.draw(pressStart, pressStart);
		}
		release(event.pointerId);
	};

	const onPointerCancel = (event: PointerEvent) => {
		if (!pointers.has(event.pointerId)) return;
		release(event.pointerId);
	};

	const onWheel = (event: WheelEvent) => {
		event.preventDefault();

		const unitPx =
			event.deltaMode === WheelEvent.DOM_DELTA_LINE
				? WHEEL_LINE_PX
				: event.deltaMode === WheelEvent.DOM_DELTA_PAGE
					? element.clientHeight
					: 1;
		const deltaPx = event.deltaY * unitPx;
		// Trackpad pinches arrive as ctrl+wheel with small deltas, but so does a ctrl+mouse-wheel
		// notch (~100px), which is capped so it cannot jump several zoom levels at once.
		const zoomExponent = event.ctrlKey
			? Math.min(Math.max(deltaPx, -PINCH_WHEEL_MAX_STEP_PX), PINCH_WHEEL_MAX_STEP_PX) *
				PINCH_WHEEL_ZOOM_PER_PX
			: deltaPx * WHEEL_ZOOM_PER_PX;

		handlers.zoom(Math.exp(-zoomExponent), toLocal(event));
	};

	const preventDefault = (event: Event) => event.preventDefault();

	element.addEventListener('pointerdown', onPointerDown);
	element.addEventListener('pointermove', onPointerMove);
	element.addEventListener('pointerup', onPointerUp);
	element.addEventListener('pointercancel', onPointerCancel);
	element.addEventListener('lostpointercapture', onPointerCancel);
	element.addEventListener('wheel', onWheel, { passive: false });
	element.addEventListener('contextmenu', preventDefault);
	element.addEventListener('gesturestart', preventDefault);

	return () => {
		element.removeEventListener('pointerdown', onPointerDown);
		element.removeEventListener('pointermove', onPointerMove);
		element.removeEventListener('pointerup', onPointerUp);
		element.removeEventListener('pointercancel', onPointerCancel);
		element.removeEventListener('lostpointercapture', onPointerCancel);
		element.removeEventListener('wheel', onWheel);
		element.removeEventListener('contextmenu', preventDefault);
		element.removeEventListener('gesturestart', preventDefault);
	};
}
