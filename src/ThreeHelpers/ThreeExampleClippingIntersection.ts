import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_clipping_intersection.html

class ThreeExampleClippingIntersection extends ThreeBase {
	private camera: THREE.PerspectiveCamera;
	private group: THREE.Group;
	private helpers: THREE.Group;
	private clipPlanes: THREE.Plane[];
	private guiParams = {
		ClipIntersection: true,
		ShowHelpers: false,
		PlaneConstantAll: 0,
		PlaneConstant0: 0,
		PlaneConstant1: 0,
		PlaneConstant2: 0,
	};

	private controls?: OrbitControls;
	private gui?: dat.GUI;

	constructor(scene: THREE.Scene, public options: ThreeSceneOptions) {
		super(scene, options);

		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200);
		this.camera.position.set(-1.5, 2.5, 3.0);
		// scene.add(this.camera);

		scene.background = new THREE.Color(0x121232);

		const light = new THREE.HemisphereLight(0xffffff, 0x080808, 1.5);
		light.position.set(-1.25, 1, 1.25);
		this.scene.add(light);

		this.clipPlanes = [
			new THREE.Plane(new THREE.Vector3(1, 0, 0), this.guiParams.PlaneConstant0),
			new THREE.Plane(new THREE.Vector3(0, -1, 0), this.guiParams.PlaneConstant1),
			new THREE.Plane(new THREE.Vector3(0, 0, -1), this.guiParams.PlaneConstant2),
		];

		this.group = new THREE.Group();

		for (let i = 1; i <= 30; i += 2) {
			const geometry = new THREE.SphereGeometry(i / 30, 48, 24);

			const hue = 0.72 + i / 30;
			const material = new THREE.MeshLambertMaterial({
				color: new THREE.Color().setHSL(hue, 0.5, 0.5),
				side: THREE.DoubleSide,
				clippingPlanes: this.clipPlanes,
				clipIntersection: this.guiParams.ClipIntersection,
			});

			this.group.add(new THREE.Mesh(geometry, material));
		}

		this.scene.add(this.group);

		// helpers

		this.helpers = new THREE.Group();
		this.helpers.add(new THREE.PlaneHelper(this.clipPlanes[0], 2, 0xff0000));
		this.helpers.add(new THREE.PlaneHelper(this.clipPlanes[1], 2, 0x00ff00));
		this.helpers.add(new THREE.PlaneHelper(this.clipPlanes[2], 2, 0x0000ff));
		this.helpers.visible = this.guiParams.ShowHelpers;
		this.scene.add(this.helpers);
	}

	dispose = () => {};

	onCreateRenderer = (renderer: THREE.WebGLRenderer) => {
		renderer.localClippingEnabled = true;
	};

	onMakeGui = (gui: dat.GUI): void => {
		this.gui = gui;

		const params = this.gui.addFolder("Parameters");
		params.add(this.guiParams, "ClipIntersection").onChange((value) => {
			for (const child of (this.group?.children ?? []) as THREE.Mesh[]) {
				const material = child.material as THREE.MeshLambertMaterial;
				material.clipIntersection = value;
			}
		});

		params
			.add(this.guiParams, "PlaneConstantAll", -1, 1)
			.step(0.01)
			.onChange((value) => {
				for (const plane of this.clipPlanes) {
					plane.constant = value;
				}
				this.guiParams.PlaneConstant0 = value;
				this.guiParams.PlaneConstant1 = value;
				this.guiParams.PlaneConstant2 = value;
			});

		params
			.add(this.guiParams, "PlaneConstant0", -1, 1)
			.step(0.01)
			.onChange((value) => (this.clipPlanes[0].constant = value));

		params
			.add(this.guiParams, "PlaneConstant1", -1, 1)
			.step(0.01)
			.onChange((value) => (this.clipPlanes[1].constant = value));

		params
			.add(this.guiParams, "PlaneConstant2", -1, 1)
			.step(0.01)
			.onChange((value) => (this.clipPlanes[2].constant = value));

		params.add(this.guiParams, "ShowHelpers").onChange((value) => {
			if (!!this.helpers) {
				this.helpers.visible = value;
			}
		});
		// params.add(this.guiParams, "Test");
		params.open();

		if (!!this.group) {
			const objFolder = this.gui.addFolder("Objects");
			let i = 0;
			this.group.traverse((object) => {
				objFolder.add(object, "visible").name(`sphere[${i}]`);
				++i;
			});

			objFolder.open();
		}
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
		this.controls.minDistance = 1;
		this.controls.maxDistance = 10;
		this.controls.enablePan = false;
		this.controls.enableZoom = true;
		this.controls.enableDamping = true;
	}
}

export { ThreeExampleClippingIntersection };
