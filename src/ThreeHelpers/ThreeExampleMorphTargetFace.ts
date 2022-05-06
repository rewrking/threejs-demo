import { MeshoptDecoder } from "meshoptimizer";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";

import { Optional } from "Types";

import { ThreeBase, ThreeSceneOptions } from "./ThreeBase";

class ThreeExampleMorphTargetFace extends ThreeBase {
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
	private ktx2Loader?: KTX2Loader;
	private animationAction?: THREE.AnimationAction;
	private gui?: dat.GUI;

	constructor(scene: THREE.Scene, public options: ThreeSceneOptions) {
		super(scene, options);

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20);
		this.camera.position.set(-1.8, 0.8, 3);
		// scene.add(this.camera);

		scene.background = new THREE.Color(0x00aacc);

		this.clock = new THREE.Clock();
	}

	dispose = () => {
		this.ktx2Loader?.dispose();
	};

	onCreateRenderer = (renderer: THREE.WebGLRenderer) => {
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.outputEncoding = THREE.sRGBEncoding;
		this.pmremGenerator = new THREE.PMREMGenerator(renderer);
		this.scene.environment = this.pmremGenerator.fromScene(new RoomEnvironment()).texture;

		this.ktx2Loader = new KTX2Loader()
			.setTranscoderPath("https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/libs/basis/")
			.detectSupport(renderer);

		const loader = new GLTFLoader().setKTX2Loader(this.ktx2Loader).setMeshoptDecoder(MeshoptDecoder);

		loader.load(
			"https://cdn.rawgit.com/mrdoob/three.js/master/examples/models/gltf/facecap.glb",
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

		const mesh = gltf.scene.children[0];
		mesh.position.y += 0.5;

		this.scene.add(mesh);

		this.mixer = new THREE.AnimationMixer(mesh);

		this.animationAction = this.mixer.clipAction(gltf.animations[0]);
		this.animationAction.setLoop(THREE.LoopPingPong, Infinity);

		if (!!this.gui) {
			if (!!this.metaData) {
				const meta = this.gui.addFolder("Metadata");
				meta.add(this.metaData, "title");
				meta.add(this.metaData, "author");
				meta.add(this.metaData, "license");
				meta.add(this.metaData, "source");
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

			this.animationAction.setEffectiveTimeScale(this.guiParams.Speed);
			this.frameController = folder.add(this.guiParams, "Speed", -10, 10, 0.01).onChange((value: number) => {
				if (!!this.animationAction) {
					this.animationAction.setEffectiveTimeScale(value);
				}
			});

			folder.add(this.guiParams, "Play").onChange(this.playAnimation);
			folder.open();

			const head = mesh.getObjectByName("mesh_2") as THREE.Mesh | undefined;
			if (!!head && !!head.morphTargetDictionary && !!head.morphTargetInfluences) {
				const morphs = this.gui.addFolder("Morph Targets");
				for (const [key, value] of Object.entries(head.morphTargetDictionary)) {
					morphs
						.add(head.morphTargetInfluences, value as any, 0, 1, 0.01)
						.name(key.replace("blendShape1.", ""))
						.listen();
				}
				morphs.open();
			}

			const objFolder = this.gui.addFolder("Objects");
			mesh.traverse((object) => {
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

export { ThreeExampleMorphTargetFace };
