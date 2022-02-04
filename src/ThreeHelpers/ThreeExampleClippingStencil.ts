import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_clipping_stencil.html

class ThreeExampleClippingStencil extends ThreeBase {
	private clock: THREE.Clock;
	private camera: THREE.PerspectiveCamera;
	private guiParams = {
		animate: true,
		planeX: {
			constant: 0,
			negated: false,
			displayHelper: false,
		},
		planeY: {
			constant: 0,
			negated: false,
			displayHelper: false,
		},
		planeZ: {
			constant: 0,
			negated: false,
			displayHelper: false,
		},
	};

	private group: THREE.Group;
	private helpers: THREE.PlaneHelper[];
	private clipPlanes: THREE.Plane[];
	private planeObjects: THREE.Mesh[];

	private controls?: OrbitControls;

	constructor(scene: THREE.Scene, public options: ThreeSceneOptions) {
		super(scene, options);

		this.camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 100);
		this.camera.position.set(2, 2, 2);

		scene.background = new THREE.Color(0x263238);
		scene.add(new THREE.AmbientLight(0xffffff, 0.5));

		const dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(5, 10, 7.5);
		dirLight.castShadow = true;
		dirLight.shadow.camera.right = 2;
		dirLight.shadow.camera.left = -2;
		dirLight.shadow.camera.top = 2;
		dirLight.shadow.camera.bottom = -2;

		dirLight.shadow.mapSize.width = 1024;
		dirLight.shadow.mapSize.height = 1024;
		scene.add(dirLight);

		this.clipPlanes = [
			new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
			new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
			new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
		];

		this.helpers = [
			new THREE.PlaneHelper(this.clipPlanes[0], 2, 0xff0000),
			new THREE.PlaneHelper(this.clipPlanes[1], 2, 0x00ff00),
			new THREE.PlaneHelper(this.clipPlanes[2], 2, 0x0000ff),
		];
		this.helpers.forEach((ph) => {
			ph.visible = false;
			scene.add(ph);
		});

		const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 220, 60);
		this.group = new THREE.Group();
		scene.add(this.group);

		// Set up clip plane rendering
		this.planeObjects = [];
		const planeGeom = new THREE.PlaneGeometry(4, 4);

		for (let i = 0; i < 3; i++) {
			const poGroup = new THREE.Group();
			const plane = this.clipPlanes[i];
			const stencilGroup = this.createPlaneStencilGroup(geometry, plane, i + 1);

			// plane is clipped by the other clipping this.clipPlanes
			const planeMat = new THREE.MeshStandardMaterial({
				color: 0xe91e63,
				metalness: 0.1,
				roughness: 0.75,
				clippingPlanes: this.clipPlanes.filter((p) => p !== plane),

				stencilWrite: true,
				stencilRef: 0,
				stencilFunc: THREE.NotEqualStencilFunc,
				stencilFail: THREE.ReplaceStencilOp,
				stencilZFail: THREE.ReplaceStencilOp,
				stencilZPass: THREE.ReplaceStencilOp,
			});
			const po = new THREE.Mesh(planeGeom, planeMat);
			po.onAfterRender = (renderer) => renderer.clearStencil();

			po.renderOrder = i + 1.1;

			this.group.add(stencilGroup);
			poGroup.add(po);
			this.planeObjects.push(po);
			scene.add(poGroup);
		}

		const material = new THREE.MeshStandardMaterial({
			color: 0xffc107,
			metalness: 0.1,
			roughness: 0.75,
			clippingPlanes: this.clipPlanes,
			clipShadows: true,
			shadowSide: THREE.DoubleSide,
		});

		// add the color
		const clippedColorFront = new THREE.Mesh(geometry, material);
		clippedColorFront.castShadow = true;
		clippedColorFront.renderOrder = 6;
		this.group.add(clippedColorFront);

		const ground = new THREE.Mesh(
			new THREE.PlaneGeometry(9, 9, 1, 1),
			new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.25, side: THREE.DoubleSide })
		);

		ground.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
		ground.position.y = -1;
		ground.receiveShadow = true;
		scene.add(ground);

		this.clock = new THREE.Clock();
	}

	onCreateRenderer = (renderer: THREE.WebGLRenderer) => {
		renderer.localClippingEnabled = true;
		renderer.shadowMap.enabled = true;
	};

	private createPlaneStencilGroup = (geometry: THREE.TorusKnotGeometry, plane: THREE.Plane, renderOrder: number) => {
		const group = new THREE.Group();
		const baseMat = new THREE.MeshBasicMaterial();
		baseMat.depthWrite = false;
		baseMat.depthTest = false;
		baseMat.colorWrite = false;
		baseMat.stencilWrite = true;
		baseMat.stencilFunc = THREE.AlwaysStencilFunc;

		// back faces
		const mat0 = baseMat.clone();
		mat0.side = THREE.BackSide;
		mat0.clippingPlanes = [plane];
		mat0.stencilFail = THREE.IncrementWrapStencilOp;
		mat0.stencilZFail = THREE.IncrementWrapStencilOp;
		mat0.stencilZPass = THREE.IncrementWrapStencilOp;

		const mesh0 = new THREE.Mesh(geometry, mat0);
		mesh0.renderOrder = renderOrder;
		group.add(mesh0);

		// front faces
		const mat1 = baseMat.clone();
		mat1.side = THREE.FrontSide;
		mat1.clippingPlanes = [plane];
		mat1.stencilFail = THREE.DecrementWrapStencilOp;
		mat1.stencilZFail = THREE.DecrementWrapStencilOp;
		mat1.stencilZPass = THREE.DecrementWrapStencilOp;

		const mesh1 = new THREE.Mesh(geometry, mat1);
		mesh1.renderOrder = renderOrder;

		group.add(mesh1);

		return group;
	};

	onMakeGui = (gui: dat.GUI): void => {
		gui.add(this.guiParams, "animate");

		const planeX = gui.addFolder("planeX");
		planeX.add(this.guiParams.planeX, "displayHelper").onChange((v) => (this.helpers[0].visible = v));
		planeX
			.add(this.guiParams.planeX, "constant")
			.min(-1)
			.max(1)
			.onChange((d) => (this.clipPlanes[0].constant = d));
		planeX.add(this.guiParams.planeX, "negated").onChange(() => {
			this.clipPlanes[0].negate();
			this.guiParams.planeX.constant = this.clipPlanes[0].constant;
		});
		planeX.open();

		const planeY = gui.addFolder("planeY");
		planeY.add(this.guiParams.planeY, "displayHelper").onChange((v) => (this.helpers[1].visible = v));
		planeY
			.add(this.guiParams.planeY, "constant")
			.min(-1)
			.max(1)
			.onChange((d) => (this.clipPlanes[1].constant = d));
		planeY.add(this.guiParams.planeY, "negated").onChange(() => {
			this.clipPlanes[1].negate();
			this.guiParams.planeY.constant = this.clipPlanes[1].constant;
		});
		planeY.open();

		const planeZ = gui.addFolder("planeZ");
		planeZ.add(this.guiParams.planeZ, "displayHelper").onChange((v) => (this.helpers[2].visible = v));
		planeZ
			.add(this.guiParams.planeZ, "constant")
			.min(-1)
			.max(1)
			.onChange((d) => (this.clipPlanes[2].constant = d));
		planeZ.add(this.guiParams.planeZ, "negated").onChange(() => {
			this.clipPlanes[2].negate();
			this.guiParams.planeZ.constant = this.clipPlanes[2].constant;
		});
		planeZ.open();
	};

	public getCamera(): THREE.Camera {
		return this.camera;
	}

	onUpdate = (): void => {
		this.controls?.update();

		const delta = this.clock.getDelta();

		if (this.guiParams.animate) {
			this.group.rotation.x += delta * 0.5;
			this.group.rotation.y += delta * 0.2;
		}

		for (let i = 0; i < this.planeObjects.length; ++i) {
			const plane = this.clipPlanes[i];
			const po = this.planeObjects[i];
			plane.coplanarPoint(po.position);
			po.lookAt(po.position.x - plane.normal.x, po.position.y - plane.normal.y, po.position.z - plane.normal.z);
		}
	};

	onWindowResize = (width: number, height: number): void => {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	};

	onCreateControls(element: HTMLElement): void {
		this.controls = new OrbitControls(this.camera, element);
		this.controls.minDistance = 2;
		this.controls.maxDistance = 20;
		this.controls.enableZoom = true;
		this.controls.enableDamping = true;
	}
}

export { ThreeExampleClippingStencil };
