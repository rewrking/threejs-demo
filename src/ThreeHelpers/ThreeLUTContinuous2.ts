import * as THREE from "three";

import { Optional } from "@andrew-r-king/react-kitchen";

type LineSegment2DResult = {
	vertices: Float32Array;
	colors: Float32Array;
};

function makeLineSegment2D(
	steps: Float32Array,
	colorSteps: Float32Array,
	thickness: number
): Optional<LineSegment2DResult> {
	const points = steps.length / 2;
	if (points < 2) return null;

	let vertices: Float32Array = new Float32Array();
	let colors: Float32Array = new Float32Array();

	for (let i = 0; i < points - 2; ++i) {
		const xA: number = steps[i];
		const yA: number = steps[i + 1];

		const xB: number = steps[i + 2];
		const yB: number = steps[i + 3];

		const directionX: number = xB - xA;
		const directionY: number = yB - yA;

		const sqroot: number = Math.sqrt(directionX * directionX + directionY * directionY);
		const unitDirectionX: number = directionX / sqroot;
		const unitDirectionY: number = directionY / sqroot;

		const unitPerpendicularX: number = -unitDirectionY;
		const unitPerpendicularY: number = unitDirectionX;

		const offsetX: number = (thickness / 2.0) * unitPerpendicularX;
		const offsetY: number = (thickness / 2.0) * unitPerpendicularY;

		vertices[i] = xA + offsetX;
		vertices[i + 1] = yA + offsetY;

		vertices[i + 2] = vertices[i + 6] = xB + offsetX;
		vertices[i + 3] = vertices[i + 7] = yB + offsetY;

		vertices[i + 4] = vertices[i + 10] = xA - offsetX;
		vertices[i + 5] = vertices[i + 11] = yA - offsetY;

		vertices[i + 8] = xB - offsetX;
		vertices[i + 9] = yB - offsetY;
	}

	return { vertices, colors };
}

class ThreeLUTContinuous2 {
	line: THREE.Line;

	constructor() {
		const geometry = new THREE.BufferGeometry();

		// prettier-ignore
		const vertices = new Float32Array([
			0,-0.5,
			0,-0.25,
			0,0,
			0,0.25,
			0,0.5,
		]);
		geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 2));

		// prettier-ignore
		const colors = new Float32Array([
			1.0, 0.0, 0.0,  // red (normalized)
			1.0, 1.0, 0.0,  // yellow (normalized)
			0.0, 1.0, 0.0,
			0.0, 1.0, 1.0,  // purple (normalized)
			0.0, 0.0, 1.0,  // blue (normalized)
		]);
		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const material = new THREE.LineBasicMaterial({
			vertexColors: true,
		});

		this.line = new THREE.Line(geometry, material);
		this.line.computeLineDistances();
	}
}

export { ThreeLUTContinuous2 };
