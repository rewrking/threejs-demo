import * as dat from "dat.gui";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as THREE from "three";

import { ClassType, Optional } from "@andrew-r-king/react-kitchen";

import { useResize } from "Hooks";

import { ThreeBase } from "./ThreeBase";

const ThreeRenderer = () => {
	return <Styles id="three-renderer"></Styles>;
};

const Styles = styled.div`
	display: block;
	background: #181132;
	width: 100%;
	height: 100%;
`;

export type RenderSettings = THREE.WebGLRendererParameters & {
	width?: number;
	height?: number;
};

let scene: Optional<THREE.Scene> = null;
let renderer: Optional<THREE.WebGLRenderer> = null;
let gui: Optional<dat.GUI> = null;

function useThreeRenderer<T extends ThreeBase>(
	ProgramConstructor: ClassType<T>,
	settings: RenderSettings = {
		antialias: true,
	}
): typeof ThreeRenderer {
	const [error, setError] = useState<Optional<Error>>(null);
	let [program] = useState<Optional<T>>(null);

	useResize(
		(ev) => {
			if (!!renderer && !!program) {
				program.onWindowResize?.();
				renderer.setSize(window.innerWidth, window.innerHeight);
			}
		},
		[program]
	);

	useEffect(() => {
		const container = document.getElementById("three-renderer");
		if (!!container && scene === null) {
			scene = new THREE.Scene();

			const { width, height, ...renderParamters } = settings;

			program = new ProgramConstructor(scene);

			renderer = new THREE.WebGLRenderer(renderParamters);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(width ?? window.innerWidth, height ?? window.innerHeight);
			renderer.setAnimationLoop(() => {
				if (!!scene && !!renderer && !!program) {
					program.onUpdate();
					renderer.render(scene, program.getCamera());
				}
			});
			container.replaceChildren(renderer.domElement);

			if (!!program.onMakeGui) {
				const { GUI } = require("dat.gui");
				if (gui === null) {
					gui = new GUI();
					if (!!gui) {
						program.onMakeGui(gui);
					}
				}
			}

			program.onCreateControls(renderer.domElement);
			// setProgram(newProgram);
		}

		return () => {
			if (!!gui) {
				gui.destroy();
				gui = null;
			}
			if (!!renderer) {
				renderer.dispose();
				renderer = null;
			}
			if (!!scene) {
				scene = scene.clear();
				scene = null;
			}
		};
	}, []);

	return ThreeRenderer;
}

export { useThreeRenderer };
