import * as THREE from "three";

export type ThreeScene = THREE.Scene & {
	width: number;
	height: number;
};

abstract class ThreeBase {
	constructor(public scene: ThreeScene) {}

	public abstract getCamera(): THREE.Camera;
	public abstract onCreateControls(element: HTMLElement): void;

	public abstract onUpdate(): void;

	onDraw(renderer: THREE.Renderer): void {
		renderer.render(this.scene, this.getCamera());
	}

	setSize(width: number, height: number) {
		this.scene.width = width;
		this.scene.height = height;
		this.onWindowResize?.(width, height);
	}

	protected onWindowResize?: (width: number, height: number) => void;
	onMakeGui?: (gui: dat.GUI) => void;
}

export { ThreeBase };
