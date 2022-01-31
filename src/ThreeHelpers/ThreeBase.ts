import * as THREE from "three";

abstract class ThreeBase {
	constructor(scene: THREE.Scene) {}

	public abstract onWindowResize(renderer: THREE.Renderer): void;
	public abstract onCreateControls(element: HTMLElement): void;
	public abstract onFrame(scene: THREE.Scene, renderer: THREE.Renderer): void;

	onMakeGui?: (gui: dat.GUI) => void;
}

export { ThreeBase };
