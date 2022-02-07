import * as THREE from "three";

type LineSegment2DResult = {
	vertices: THREE.BufferAttribute;
	colors: THREE.BufferAttribute;
};

function makeLineSegment2D(thickness: number, steps: Float32Array): THREE.BufferAttribute {
	const points = steps.length / 2;
	let vertices: Float32Array = new Float32Array((points - 1) * 6);

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

	return new THREE.BufferAttribute(vertices, 3);
}

/*function makeColorBufferContinuous2D(vertices: THREE.BufferAttribute, colorSteps: Float32Array) {
	return new THREE.BufferAttribute(colors, 3);
}*/

class ThreeLUTContinuous2 {
	line: THREE.Mesh;

	constructor() {
		const geometry = new THREE.BufferGeometry();

		THREE.LineSegments;

		// prettier-ignore
		// const vertices = makeLineSegment2D(1, new Float32Array([
		const vertices = new Float32Array([
			0,-0.5,
			0,-0.25,
			0,0,
			0,0.25,
			0,0.5,
		]);
		geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

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

		// this.line = new THREE.Line(geometry, material);
		// this.line.computeLineDistances();

		this.line = new THREE.Mesh(geometry, material);
	}
}

export { ThreeLUTContinuous2 };
