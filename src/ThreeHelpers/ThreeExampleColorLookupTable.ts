import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Dictionary } from "Types";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";
import { ThreeLUTContinuous } from "./ThreeLUTContinuous";
import { ThreeLUTContinuous2 } from "./ThreeLUTContinuous2";

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_colors_lookuptable.html

const ColorMapKeywords = {
	rainbow: [
		[0.0, 0x0000ff],
		[0.2, 0x00ffff],
		[0.5, 0x00ff00],
		[0.8, 0xffff00],
		[1.0, 0xff0000],
	],
	revrainbow: [
		[0.0, 0xff0000],
		[0.2, 0xffff00],
		[0.5, 0x00ff00],
		[0.8, 0x00ffff],
		[1.0, 0x0000ff],
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

class ThreeExampleColorLookupTable extends ThreeBase {
	private camera: THREE.PerspectiveCamera;
	private orthoCamera: THREE.OrthographicCamera;
	// private sprite: THREE.Sprite;
	private uiScene: THREE.Scene;
	private mesh: THREE.Mesh;
	private lut: ThreeLUTContinuous;
	private lut2: ThreeLUTContinuous2;
	private colorMapChoices = Object.keys(ColorMapKeywords);
	private guiParams = {
		ColorMap: this.colorMapChoices[0],
		Table: {} as Dictionary<number>,
		ClipIntersection: false,
		ShowHelpers: true,
		PlaneConstant: 0,
	};

	// Clipping
	private clipPlanes: THREE.Plane[];
	private helpers?: THREE.Group;

	private controls?: OrbitControls;
	private gui?: dat.GUI;

	constructor(scene: THREE.Scene, public options: ThreeSceneOptions) {
		super(scene, options);

		scene.background = new THREE.Color(0xaaa5b5);

		this.camera = new THREE.PerspectiveCamera(60, options.width / options.height, 1, 100);
		this.camera.position.set(0, 0, 10);
		scene.add(this.camera);

		const pointLight = new THREE.PointLight(0xffffff, 1);
		this.camera.add(pointLight);

		this.orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2);
		this.orthoCamera.position.set(0.5, 0, 1);

		this.lut = new ThreeLUTContinuous(ColorMapKeywords, this.guiParams.ColorMap);

		// this.sprite = new THREE.Sprite(
		// 	new THREE.SpriteMaterial({
		// 		map: new THREE.CanvasTexture(this.lut.createCanvas()),
		// 	})
		// );
		// this.sprite.scale.x = 0.125;

		this.uiScene = new THREE.Scene();
		// this.uiScene.add(this.sprite);

		this.clipPlanes = [new THREE.Plane(new THREE.Vector3(-0.3, -1, 0), this.guiParams.PlaneConstant)];

		this.mesh = new THREE.Mesh(
			undefined,
			new THREE.MeshLambertMaterial({
				side: THREE.DoubleSide,
				color: 0xf5f5f5,
				clippingPlanes: this.clipPlanes,
				clipIntersection: this.guiParams.ClipIntersection,
				vertexColors: true,
			})
		);
		scene.add(this.mesh);

		this.lut2 = new ThreeLUTContinuous2();
		this.uiScene.add(this.lut2.line);

		this.loadModel();
	}

	onCreateRenderer = (renderer: THREE.WebGLRenderer) => {
		renderer.localClippingEnabled = true;
		renderer.autoClear = false;
	};

	onMakeGui = (gui: dat.GUI): void => {
		this.gui = gui;
	};

	public getCamera(): THREE.Camera {
		return this.camera;
	}

	onUpdate = (): void => {
		this.controls?.update();
	};

	onDraw = (renderer: THREE.WebGLRenderer): void => {
		renderer.render(this.uiScene, this.orthoCamera);
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

	private loadModel = () => {
		const loader = new THREE.BufferGeometryLoader();
		loader.load("https://cdn.rawgit.com/mrdoob/three.js/master/examples/models/json/pressure.json", (geometry) => {
			geometry.center();
			geometry.computeVertexNormals();

			// default color attribute
			const colors: number[] = [];

			for (let i = 0, n = geometry.attributes.position.count; i < n; ++i) {
				colors.push(1, 1, 1);
			}

			geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

			this.mesh.geometry = geometry;
			// console.log(this.mesh);

			const helperSize: number = 4;
			this.helpers = new THREE.Group();
			this.helpers.add(new THREE.PlaneHelper(this.clipPlanes[0], helperSize, 0xff0000));
			this.helpers.visible = this.guiParams.ShowHelpers;
			this.scene.add(this.helpers);

			if (!!this.gui) {
				const params = this.gui.addFolder("Parameters");
				params.add(this.guiParams, "ColorMap", this.colorMapChoices).onChange(() => {
					this.updateColors();
					this.updateGuiTable();
				});

				/*params.add(this.guiParams, "ClipIntersection").onChange((value) => {
					const material = this.mesh.material as THREE.MeshLambertMaterial;
					material.clipIntersection = value;
					this.updateColors();
				});*/

				params
					.add(
						this.guiParams,
						"PlaneConstant",
						this.mesh.geometry.boundingBox?.min.y ?? -1,
						this.mesh.geometry.boundingBox?.max.y ?? 1
					)
					.step(0.01)
					.onChange((value) => {
						this.clipPlanes[0].constant = value;
						this.guiParams.PlaneConstant = value;
					});

				params.add(this.guiParams, "ShowHelpers").onChange((value) => {
					if (!!this.helpers) {
						this.helpers.visible = value;
					}
				});
				params.open();

				const table = this.updateGuiTable();

				const lookup = this.gui.addFolder("LookupTable");
				for (let i = 0; i < table.length; ++i) {
					// const min = i > 0 ? table[i - 1][0] : 0.0;
					// const max = i < table.length - 1 ? table[i + 1][0] : 1.0;
					const min = 0.0;
					const max = 1.0;
					console.log(i, min, max);
					lookup.add(this.guiParams.Table, `table[${i}]`, min, max, 0.01).onChange((value) => {
						this.lut.lookupTable[this.guiParams.ColorMap][i][0] = value;
						// this.updateRamp();
						try {
							this.updateColors();
						} catch {}
					});
				}

				lookup.open();
			}

			this.updateColors();
		});
	};

	private updateGuiTable = () => {
		this.guiParams.Table = {};
		const table = this.lut.lookupTable[this.guiParams.ColorMap] ?? [];
		table.forEach((entry, i) => {
			this.guiParams.Table[`table[${i}]`] = entry[0];
		});
		// console.log(this.guiParams.Table);

		return table;
	};

	private updateRamp = () => {
		const table = this.lut.lookupTable[this.guiParams.ColorMap] ?? [];
		if (!!this.gui) {
			const lookup = this.gui.__folders["LookupTable"];
			for (let i = 0; i < table.length; ++i) {
				const min = i > 0 ? table[i - 1][0] : 0.0;
				const max = i < table.length - 1 ? table[i + 1][0] : 1.0;
				const ctrlr = lookup.__controllers[i];
				(ctrlr as any).__min = min;
				(ctrlr as any).__max = max;
				// console.log(i, min, max);
			}
		}
	};

	private updateColors = () => {
		this.lut.setColorMap(this.guiParams.ColorMap);

		this.lut.setMin(0);
		this.lut.setMax(2000);

		const geometry = this.mesh.geometry;
		const pressures = geometry.attributes["pressure"];
		const colors = geometry.attributes.color;

		for (let i = 0; i < pressures.array.length; i++) {
			const colorValue = pressures.array[i];

			const color = this.lut.getColor(colorValue);
			if (!!color) {
				colors.setXYZ(i, color.r, color.g, color.b);
			} else {
				// throw new Error(`Unable to determine color for value: ${colorValue}`);
			}
		}

		colors.needsUpdate = true;

		// const map = this.sprite.material.map;
		// if (!!map) {
		// 	this.lut.updateCanvas(map.image);
		// 	map.needsUpdate = true;
		// }
	};
}

export { ThreeExampleColorLookupTable };
