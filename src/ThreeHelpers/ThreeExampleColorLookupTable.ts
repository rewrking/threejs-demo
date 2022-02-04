import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";
import { ThreeLUT } from "./ThreeLUT";

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_colors_lookuptable.html

class ThreeExampleColorLookupTable extends ThreeBase {
	private camera: THREE.PerspectiveCamera;
	private orthoCamera: THREE.OrthographicCamera;
	private sprite: THREE.Sprite;
	private uiScene: THREE.Scene;
	private mesh: THREE.Mesh;
	private lut: ThreeLUT;
	private colorMapChoices = ["rainbow", "cooltowarm", "blackbody", "grayscale"];
	private guiParams = {
		colorMap: this.colorMapChoices[0],
	};

	private controls?: OrbitControls;

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

		this.lut = new ThreeLUT(this.guiParams.colorMap);

		this.sprite = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: new THREE.CanvasTexture(this.lut.createCanvas()),
			})
		);
		this.sprite.scale.x = 0.125;

		this.uiScene = new THREE.Scene();
		this.uiScene.add(this.sprite);

		this.mesh = new THREE.Mesh(
			undefined,
			new THREE.MeshLambertMaterial({
				side: THREE.DoubleSide,
				color: 0xf5f5f5,
				vertexColors: true,
			})
		);
		scene.add(this.mesh);

		this.loadModel();
	}

	onCreateRenderer = (renderer: THREE.WebGLRenderer) => {
		renderer.autoClear = false;
	};

	onMakeGui = (gui: dat.GUI): void => {
		const folder = gui.addFolder("Parameters");
		folder.add(this.guiParams, "colorMap", this.colorMapChoices).onChange(this.updateColors);

		folder.open();
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
			this.updateColors();
		});
	};

	private updateColors = () => {
		this.lut.setColorMap(this.guiParams.colorMap);

		this.lut.setMin(0);
		this.lut.setMax(2000);

		const geometry = this.mesh.geometry;
		const pressures = geometry.attributes.pressure;
		const colors = geometry.attributes.color;

		for (let i = 0; i < pressures.array.length; i++) {
			const colorValue = pressures.array[i];

			const color = this.lut.getColor(colorValue);

			if (color === undefined) {
				console.log("Unable to determine color for value:", colorValue);
			} else {
				colors.setXYZ(i, color.r, color.g, color.b);
			}
		}

		colors.needsUpdate = true;

		const map = this.sprite.material.map;
		if (!!map) {
			this.lut.updateCanvas(map.image);
			map.needsUpdate = true;
		}
	};
}

export { ThreeExampleColorLookupTable };
