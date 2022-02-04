import { Color } from "three";

// https://github.com/mrdoob/three.js/blob/master/examples/jsm/math/Lut.js

class ThreeLUT {
	lut: Color[] = [];
	map: number[] = [];
	n: number = 0;
	minV: number = 0;
	maxV: number = 1;
	readonly isLut: boolean = true;

	constructor(colormap: string, count: number = 32) {
		this.setColorMap(colormap, count);
	}

	set = (value: ThreeLUT) => {
		if (value.isLut === true) {
			this.copy(value);
		}

		return this;
	};

	setMin = (min: number) => {
		this.minV = min;

		return this;
	};

	setMax = (max: number) => {
		this.maxV = max;

		return this;
	};

	setColorMap = (colormap: string, count: number = 32) => {
		this.map = ColorMapKeywords[colormap] || ColorMapKeywords.rainbow;
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

		return this;
	};

	copy = (lut: ThreeLUT) => {
		this.lut = lut.lut;
		this.map = lut.map;
		this.n = lut.n;
		this.minV = lut.minV;
		this.maxV = lut.maxV;

		return this;
	};

	getColor = (alpha: number) => {
		if (alpha <= this.minV) {
			alpha = this.minV;
		} else if (alpha >= this.maxV) {
			alpha = this.maxV;
		}

		alpha = (alpha - this.minV) / (this.maxV - this.minV);

		let colorPosition = Math.round(alpha * this.n);
		colorPosition == this.n ? (colorPosition -= 1) : colorPosition;

		return this.lut[colorPosition];
	};

	addColorMap = (name: string, arrayOfColors: number[]) => {
		ColorMapKeywords[name] = arrayOfColors;

		return this;
	};

	createCanvas = () => {
		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = this.n;

		this.updateCanvas(canvas);

		return canvas;
	};

	updateCanvas = (canvas: HTMLCanvasElement) => {
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

const ColorMapKeywords = {
	rainbow: [
		[0.0, 0x0000ff],
		[0.2, 0x00ffff],
		[0.5, 0x00ff00],
		[0.8, 0xffff00],
		[1.0, 0xff0000],
	],
	cooltowarm: [
		[0.0, 0x3c4ec2],
		[0.2, 0x9bbcff],
		[0.5, 0xdcdcdc],
		[0.8, 0xf6a385],
		[1.0, 0xb40426],
	],
	blackbody: [
		[0.0, 0x000000],
		[0.2, 0x780000],
		[0.5, 0xe63200],
		[0.8, 0xffff00],
		[1.0, 0xffffff],
	],
	grayscale: [
		[0.0, 0x000000],
		[0.2, 0x404040],
		[0.5, 0x7f7f80],
		[0.8, 0xbfbfbf],
		[1.0, 0xffffff],
	],
};

export { ThreeLUT, ColorMapKeywords };
