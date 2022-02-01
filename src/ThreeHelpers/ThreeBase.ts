import * as THREE from "three";

abstract class ThreeBase {
	constructor(scene: THREE.Scene) {}

	public abstract getCamera(): THREE.Camera;
	public abstract onCreateControls(element: HTMLElement): void;
	public abstract onUpdate(): void;

	onWindowResize?: () => void;
	onMakeGui?: (gui: dat.GUI) => void;
}

export { ThreeBase };
