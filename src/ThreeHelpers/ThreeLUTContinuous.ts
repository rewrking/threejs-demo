import { Color } from "three";

import { Dictionary } from "Types";

// https://github.com/mrdoob/three.js/blob/master/examples/jsm/math/Lut.js

class ThreeLUTContinuous {
	private lut: Color[] = [];
	private map: number[][] = [];
	private n: number = 0;
	private minV: number = 0;
	private maxV: number = 1;

	readonly isLut: boolean = true;
	private readonly defaultLookup: string;

	constructor(public lookupTable: Dictionary<number[][]>, colormap: string, count: number = 32) {
		const keys = Object.keys(lookupTable);
		this.defaultLookup = keys.length > 0 ? keys[0] : "";

		this.setColorMap(colormap, count);
	}

	copy = (lut: ThreeLUTContinuous): boolean => {
		if (lut.isLut === true) {
			this.lut = lut.lut;
			this.map = lut.map;
			this.n = lut.n;
			this.minV = lut.minV;
			this.maxV = lut.maxV;
			return true;
		}

		return false;
	};

	setMin = (min: number): void => {
		this.minV = min;
	};

	setMax = (max: number): void => {
		this.maxV = max;
	};

	setColorMap = (colormap: string, count: number = 32): void => {
		this.map = this.lookupTable[colormap] || this.lookupTable[this.defaultLookup];
		this.n = count;

		const step = 1.0 / this.n;

		this.lut.length = 0;

		for (let i = 0; i <= 1; i += step) {
			for (let j = 0; j < this.map.length - 1; j++) {
				if (i >= this.map[j][0] && i < this.map[j + 1][0]) {
					const min = this.map[j][0];
					const max = this.map[j + 1][0];

					const minColor = new Color(this.map[j][1]);
					const maxColor = new Color(this.map[j + 1][1]);

					const color = minColor.lerp(maxColor, (i - min) / (max - min));

					this.lut.push(color);
				}
			}
		}
	};

	getColor = (alpha: number): Color | null => {
		if (alpha <= this.minV) {
			alpha = this.minV;
		} else if (alpha >= this.maxV) {
			alpha = this.maxV;
		}

		alpha = (alpha - this.minV) / (this.maxV - this.minV);

		let colorPosition = Math.round(alpha * this.n);
		if (colorPosition == this.n) {
			colorPosition -= 1;
		}

		return this.lut[colorPosition] ?? null;
	};

	addColorMap = (name: string, arrayOfColors: number[][]): ThreeLUTContinuous => {
		this.lookupTable[name] = arrayOfColors;

		return this;
	};

	createCanvas = (): HTMLCanvasElement => {
		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = this.n;

		this.updateCanvas(canvas);

		return canvas;
	};

	updateCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
		const ctx = canvas.getContext("2d", { alpha: false });
		if (!!ctx) {
			const imageData = ctx.getImageData(0, 0, 1, this.n);

			const data = imageData.data;

			let k = 0;

			const step = 1.0 / this.n;

			for (let i = 1; i >= 0; i -= step) {
				for (let j = this.map.length - 1; j >= 0; j--) {
					if (i < this.map[j][0] && i >= this.map[j - 1][0]) {
						const min = this.map[j - 1][0];
						const max = this.map[j][0];

						const minColor = new Color(this.map[j - 1][1]);
						const maxColor = new Color(this.map[j][1]);

						const color = minColor.lerp(maxColor, (i - min) / (max - min));

						data[k * 4] = Math.round(color.r * 255);
						data[k * 4 + 1] = Math.round(color.g * 255);
						data[k * 4 + 2] = Math.round(color.b * 255);
						data[k * 4 + 3] = 255;

						k += 1;
					}
				}
			}

			ctx.putImageData(imageData, 0, 0);

			return canvas;
		} else {
			throw new Error("not a canvas");
		}
	};
}

export { ThreeLUTContinuous };
