import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { Optional } from "Types";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";

class ThreeExampleAnimationKeyframes extends ThreeBase {
	private clock: THREE.Clock;
	private camera: THREE.PerspectiveCamera;
	private guiParams = {
		Frame: 0,
		Speed: 1,
		Play: true,
	};

	private pmremGenerator?: THREE.PMREMGenerator;
	private mixer?: THREE.AnimationMixer;
	private controls?: OrbitControls;
	private dracoLoader?: DRACOLoader;
	private animationAction?: THREE.AnimationAction;
	private gui?: dat.GUI;

	constructor(scene: THREE.Scene, public options: ThreeSceneOptions) {
		super(scene, options);

		this.camera = new THREE.PerspectiveCamera(40, options.width / options.height, 1, 100);
		this.camera.position.set(5, 2, 8);
		// scene.add(this.camera);

		scene.background = new THREE.Color(0xbfe3dd);

		this.clock = new THREE.Clock();
	}

	dispose = () => {
		this.dracoLoader?.dispose();
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

	private metaData: Optional<object> = null;
	private tempPlay: Optional<boolean> = null;
	private changingFrameValue: boolean = false;

	private frameController?: dat.GUIController;

	private onLoadGLTF = (gltf: GLTF) => {
		this.metaData = gltf.asset.extras ?? null;

		const group: THREE.Group = gltf.scene;
		group.position.set(1, 1, 0);
		group.scale.set(0.01, 0.01, 0.01);
		this.scene.add(group);

		this.mixer = new THREE.AnimationMixer(group);
		this.animationAction = this.mixer.clipAction(gltf.animations[0]);
		// this.animationAction.getClip().

		if (!!this.gui) {
			if (!!this.metaData) {
				const meta = this.gui.addFolder("Metadata");
				meta.add(this.metaData, "title");
				meta.add(this.metaData, "author");
				meta.add(this.metaData, "license");
				meta.add(this.metaData, "source");
				meta.open();
			}

			const folder = this.gui.addFolder("Parameters");
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
				})
				.listen();
			folder.open();

			// this.animationAction.loop = THREE.LoopPingPong;
			this.animationAction.setEffectiveTimeScale(this.guiParams.Speed);
			this.frameController = folder.add(this.guiParams, "Speed", -2.5, 2.5, 0.01).onChange((value: number) => {
				if (!!this.animationAction) {
					this.animationAction.setEffectiveTimeScale(value);
				}
			});

			folder.add(this.guiParams, "Play").onChange(this.playAnimation);

			const trolly = group.getObjectByName("Object675");
			if (!!trolly) {
				// console.log(trolly);
				// const expressions = Object.keys(trolly?.["morphTargetDictionary"] ?? {});
				// console.log(expressions);
				// const expressionFolder = gui.addFolder("Expressions");

				// for (let i = 0; i < expressions.length; i++) {
				// 	expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);
				// }

				const sceneFolder = this.gui.addFolder("Scene");
				sceneFolder.add(trolly, "visible");
				sceneFolder.open();
			}

			const objFolder = this.gui.addFolder("Objects");
			group.traverse((object) => {
				if (object.name.length === 0) return;

				objFolder.add(object, "visible").name(object.name);
			});
			objFolder.open();
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

	onUpdate = (): void => {
		const delta = this.clock.getDelta();

		if (this.guiParams.Play && !!this.mixer) {
			this.mixer.update(delta);

			if (!!this.frameController && !!this.animationAction) {
				this.changingFrameValue = true;
				// this.frameController.setValue(this.animationAction.time);
				this.guiParams.Frame = this.animationAction.time;
				this.changingFrameValue = false;
			}
		}

		this.controls?.update();
	};

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
