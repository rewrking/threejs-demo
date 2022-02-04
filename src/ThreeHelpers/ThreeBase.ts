import * as THREE from "three";

export type ThreeSceneOptions = {
	width: number;
	height: number;
	showStats: boolean;
};

abstract class ThreeBase {
	constructor(public scene: THREE.Scene, public options: ThreeSceneOptions) {}

	public abstract getCamera(): THREE.Camera;
	public abstract onCreateControls(element: HTMLElement): void;

	setSize(width: number, height: number) {
		this.options.width = width;
		this.options.height = height;
		this.onWindowResize?.(width, height);
	}

	protected onWindowResize?: (width: number, height: number) => void;

	onUpdate?: () => void;
	onDraw?: (renderer: THREE.WebGLRenderer) => void;
	onCreateRenderer?: (renderer: THREE.WebGLRenderer) => void;
	onMakeGui?: (gui: dat.GUI) => void;
	dispose?: () => void;
}

export { ThreeBase };
