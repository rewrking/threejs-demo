import * as THREE from "three";

abstract class ThreeBase {
	constructor(protected scene: THREE.Scene) {}

	public abstract getCamera(): THREE.Camera;
	public abstract onCreateControls(element: HTMLElement): void;

	public abstract onUpdate(): void;

	public onDraw(renderer: THREE.Renderer): void {
		renderer.render(this.scene, this.getCamera());
	}

	onWindowResize?: (width: number, height: number) => void;
	onMakeGui?: (gui: dat.GUI) => void;
}

export { ThreeBase };
