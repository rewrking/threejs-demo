import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Optional } from "@andrew-r-king/react-kitchen";

import { ThreeBase } from "./ThreeBase";

// https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/webgl_morphtargets.html

class MorphTargets extends ThreeBase {
	mesh: THREE.Mesh;
	material: THREE.MeshPhongMaterial;
	camera: THREE.PerspectiveCamera;
	guiParams = {
		Spherify: 0,
		Twist: 0,
	};

	controls: Optional<OrbitControls> = null;

	constructor(scene: THREE.Scene) {
		super(scene);

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20);
		this.camera.position.z = 10;
		scene.add(this.camera);

		scene.add(new THREE.AmbientLight(0x8fbcd4, 0.4));

		const pointLight = new THREE.PointLight(0xffffff, 1);
		this.camera.add(pointLight);

		this.material = new THREE.MeshPhongMaterial({
			color: 0xff0000,
			flatShading: true,
		});

		const geometry = this.createGeometry();
		this.mesh = new THREE.Mesh(geometry, this.material);
		scene.add(this.mesh);
	}

	onMakeGui = (gui: dat.GUI): void => {
		const folder = gui.addFolder("Morph Targets");
		folder
			.add(this.guiParams, "Spherify", 0, 1)
			.step(0.01)
			.onChange((value: number) => {
				this.mesh.morphTargetInfluences![0] = value;
			});

		folder
			.add(this.guiParams, "Twist", 0, 1)
			.step(0.01)
			.onChange((value: number) => {
				this.mesh.morphTargetInfluences![1] = value;
			});

		folder.open();
	};

	onFrame(scene: THREE.Scene, renderer: THREE.Renderer): void {
		if (!!this.camera) {
			this.controls?.update();
			renderer.render(scene, this.camera);
		}
	}

	onWindowResize(renderer: THREE.Renderer): void {
		if (!!this.camera) {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}

	onCreateControls(element: HTMLElement): void {
		if (!!this.camera) {
			this.controls = new OrbitControls(this.camera, element);
			this.controls.enableZoom = true;
			this.controls.enableDamping = true;
		}
	}

	private createGeometry = () => {
		const geometry = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32);

		// create an empty array to  hold targets for the attribute we want to morph
		// morphing positions and normals is supported
		geometry.morphAttributes.position = [];

		// the original positions of the cube's vertices
		const positionAttribute = geometry.attributes.position;

		// for the first morph target we'll move the cube's vertices onto the surface of a sphere
		const spherePositions: number[] = [];

		// for the second morph target, we'll twist the cubes vertices
		const twistPositions = [];
		const direction = new THREE.Vector3(1, 0, 0);
		const vertex = new THREE.Vector3();

		for (let i = 0; i < positionAttribute.count; i++) {
			const x = positionAttribute.getX(i);
			const y = positionAttribute.getY(i);
			const z = positionAttribute.getZ(i);

			spherePositions.push(
				x * Math.sqrt(1 - (y * y) / 2 - (z * z) / 2 + (y * y * z * z) / 3),
				y * Math.sqrt(1 - (z * z) / 2 - (x * x) / 2 + (z * z * x * x) / 3),
				z * Math.sqrt(1 - (x * x) / 2 - (y * y) / 2 + (x * x * y * y) / 3)
			);

			// stretch along the x-axis so we can see the twist better
			vertex.set(x * 2, y, z);

			vertex.applyAxisAngle(direction, (Math.PI * x) / 2).toArray(twistPositions, twistPositions.length);
		}

		// add the spherical positions as the first morph target
		geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);

		// add the twisted positions as the second morph target
		geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(twistPositions, 3);

		return geometry;
	};
}

export { MorphTargets };
