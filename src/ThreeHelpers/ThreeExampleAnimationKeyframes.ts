import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { Optional } from "@andrew-r-king/react-kitchen";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";

// https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/webgl_morphtargets.html

class ThreeExampleAnimationKeyframes extends ThreeBase {
	clock: THREE.Clock;
	camera: THREE.PerspectiveCamera;
	pmremGenerator: Optional<THREE.PMREMGenerator> = null;
	mixer: Optional<THREE.AnimationMixer> = null;
	guiParams = {
		Spherify: 0,
		Twist: 0,
	};

	controls: Optional<OrbitControls> = null;

	dracoLoader: Optional<DRACOLoader> = null;

	constructor(scene: THREE.Scene, public options: ThreeSceneOptions) {
		super(scene, options);

		this.camera = new THREE.PerspectiveCamera(40, options.width / options.height, 1, 100);
		this.camera.position.set(5, 2, 8);
		// scene.add(this.camera);

		scene.background = new THREE.Color(0xbfe3dd);

		this.clock = new THREE.Clock();
	}

	dispose = () => {
		if (!!this.dracoLoader) {
			this.dracoLoader.dispose();
			this.dracoLoader = null;
		}
	};

	onCreateRenderer = (renderer: THREE.WebGLRenderer) => {
		renderer.outputEncoding = THREE.sRGBEncoding;
		this.pmremGenerator = new THREE.PMREMGenerator(renderer);
		this.scene.environment = this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

		this.dracoLoader = new DRACOLoader();
		this.dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

		const loader = new GLTFLoader();
		loader.setDRACOLoader(this.dracoLoader);
		loader.load(
			"https://cdn.rawgit.com/mrdoob/three.js/master/examples/models/gltf/LittlestTokyo.glb",
			(gltf) => {
				const model = gltf.scene;
				model.position.set(1, 1, 0);
				model.scale.set(0.01, 0.01, 0.01);
				this.scene.add(model);

				this.mixer = new THREE.AnimationMixer(model);
				this.mixer.clipAction(gltf.animations[0]).play();

				// animate();
			},
			undefined, // onProgress (send info to progress bar)
			(err) => {
				console.error(err);
			}
		);
	};

	onMakeGui = (gui: dat.GUI): void => {};

	public getCamera(): THREE.Camera {
		return this.camera;
	}

	onUpdate(): void {
		const delta = this.clock.getDelta();

		this.mixer?.update(delta);

		this.controls?.update();
	}

	onWindowResize = (width: number, height: number): void => {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	};

	onCreateControls(element: HTMLElement): void {
		this.controls = new OrbitControls(this.camera, element);
		this.controls.target.set(0, 0.5, 0);
		this.controls.enableZoom = true;
		this.controls.enableDamping = true;
	}
}

export { ThreeExampleAnimationKeyframes };
