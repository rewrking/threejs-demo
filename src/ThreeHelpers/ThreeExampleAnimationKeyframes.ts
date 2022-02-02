import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";

class ThreeExampleAnimationKeyframes extends ThreeBase {
	clock: THREE.Clock;
	camera: THREE.PerspectiveCamera;
	pmremGenerator: Optional<THREE.PMREMGenerator> = null;
	mixer: Optional<THREE.AnimationMixer> = null;
	guiParams = {
		Frame: 0,
		Play: true,
	};

	controls: Optional<OrbitControls> = null;

	dracoLoader: Optional<DRACOLoader> = null;
	animationAction: Optional<THREE.AnimationAction> = null;
	gui: Optional<dat.GUI> = null;

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
			this.onLoadGLTF,
			undefined, // onProgress (send info to progress bar)
			(err) => {
				console.error(err);
			}
		);
	};

	private tempPlay: Optional<boolean> = null;

	private metaData: Optional<any> = {};

	private frameController: Optional<dat.GUIController> = null;
	private changingFrameValue: boolean = false;
	private onLoadGLTF = (gltf: GLTF) => {
		this.metaData = gltf.asset.extras ?? {};

		const model: THREE.Group = gltf.scene;
		model.position.set(1, 1, 0);
		model.scale.set(0.01, 0.01, 0.01);
		this.scene.add(model);

		this.mixer = new THREE.AnimationMixer(model);
		this.animationAction = this.mixer.clipAction(gltf.animations[0]);
		// this.animationAction.getClip().

		if (!!this.gui) {
			if (!!this.metaData) {
				const meta = this.gui.addFolder("Metadata");
				meta.add(this.metaData, "title");
				meta.add(this.metaData, "author");
				meta.add(this.metaData, "license");
				meta.add(this.metaData, "source");
			}

			const folder = this.gui.addFolder("Animation Keyframes");
			this.frameController = folder
				.add(this.guiParams, "Frame", 0, this.animationAction.getClip().duration, 0.01)
				.onChange((value: number) => {
					if (!this.changingFrameValue) {
						if (this.tempPlay === null) {
							this.tempPlay = this.guiParams.Play;
						}
						this.guiParams.Play = false;
						if (!!this.animationAction) {
							this.animationAction.time = value;
							this.mixer?.update(0);
						}
					}
				})
				.onFinishChange((value: number) => {
					if (!this.changingFrameValue) {
						if (this.tempPlay !== null) {
							this.guiParams.Play = this.tempPlay;
							this.tempPlay = null;
						}
					}
				});

			folder.add(this.guiParams, "Play").onChange(this.playAnimation);

			folder.open();
		}

		this.playAnimation(this.guiParams.Play);
	};

	private playAnimation = (value: boolean) => {
		if (value) this.animationAction?.play();
		// else this.animationAction?.stop();
	};

	onMakeGui = (gui: dat.GUI): void => {
		this.gui = gui;
	};

	public getCamera(): THREE.Camera {
		return this.camera;
	}

	onUpdate(): void {
		const delta = this.clock.getDelta();

		if (this.guiParams.Play && !!this.mixer) {
			this.mixer.update(delta);

			if (!!this.frameController && !!this.animationAction) {
				this.changingFrameValue = true;
				this.frameController.setValue(this.animationAction.time);
				this.changingFrameValue = false;
			}
		}

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