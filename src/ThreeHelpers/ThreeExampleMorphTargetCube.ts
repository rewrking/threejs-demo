import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";

// https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/webgl_morphtargets.html

class ThreeExampleMorphTargetCube extends ThreeBase {
	private mesh: THREE.Mesh;
	private camera: THREE.PerspectiveCamera;
	private guiParams = {
		Spherify: 0,
		Twist: 0,
	};

	private controls?: OrbitControls;

	constructor(scene: THREE.Scene, public options: ThreeSceneOptions) {
		super(scene, options);

		this.camera = new THREE.PerspectiveCamera(45, options.width / options.height, 1, 20);
		this.camera.position.z = 10;
		scene.add(this.camera);

		scene.add(new THREE.AmbientLight(0x8fbcd4, 0.4));

		const pointLight = new THREE.PointLight(0xffffff, 1);
		this.camera.add(pointLight);

		const material = new THREE.MeshPhongMaterial({
			color: 0x00ff33,
			flatShading: true,
		});

		const geometry = this.createGeometry();
		this.mesh = new THREE.Mesh(geometry, material);
		scene.add(this.mesh);
	}

	onMakeGui = (gui: dat.GUI): void => {
		const folder = gui.addFolder("Morph Targets");
		folder.add(this.guiParams, "Spherify", 0, 1, 0.01).onChange((value: number) => {
			this.mesh.morphTargetInfluences![0] = value;
		});

		folder.add(this.guiParams, "Twist", 0, 1, 0.01).onChange((value: number) => {
			this.mesh.morphTargetInfluences![1] = value;
		});

		folder.open();
	};

	public getCamera(): THREE.Camera {
		return this.camera;
	}

	onUpdate = (): void => {
		this.controls?.update();
	};

	onWindowResize = (width: number, height: number): void => {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	};

	onCreateControls(element: HTMLElement): void {
		this.controls = new OrbitControls(this.camera, element);
		this.controls.enableZoom = true;
		this.controls.enableDamping = true;
	}

	private createGeometry = (): THREE.BoxGeometry => {
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

		// end positions

		// add the spherical positions as the first morph target
		geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);

		// add the twisted positions as the second morph target
		geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(twistPositions, 3);

		return geometry;
	};
}

export { ThreeExampleMorphTargetCube };
