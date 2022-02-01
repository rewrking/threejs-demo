import * as dat from "dat.gui";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { ClassType, Optional } from "@andrew-r-king/react-kitchen";

import { useResize } from "Hooks";

import { ThreeBase } from "./ThreeBase";

export type OutProps<T extends ThreeBase> = {
	program: Optional<T>;
	ref: RefObject<HTMLDivElement>;
	error: Optional<Error>;
};

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
): OutProps<T> {
	const ref = useRef<HTMLDivElement>(null);
	const [error, setError] = useState<Optional<Error>>(null);
	let [program] = useState<Optional<T>>(null);

	/*useResize(() => {
		if (!!renderer && !!program) {
			program.onWindowResize(renderer);
		}
	}, [program]);*/

	useEffect(() => {
		if (!!ref.current && scene === null) {
			scene = new THREE.Scene();

			const { width, height, ...renderParamters } = settings;

			program = new ProgramConstructor(scene);

			renderer = new THREE.WebGLRenderer(renderParamters);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(width ?? window.innerWidth, height ?? window.innerHeight);
			renderer.setAnimationLoop(() => {
				if (!!scene && !!renderer && program) {
					program.onFrame(scene, renderer);
				}
			});
			ref.current.replaceChildren(renderer.domElement);

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
			scene = null;
			renderer = null;
			// gui = null;
		};
	}, [ref.current]);

	return {
		ref,
		program,
		error,
	};
}

export { useThreeRenderer };
