import * as dat from "dat.gui";
import debounce from "lodash/debounce";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import styled from "styled-components";
import * as THREE from "three";

import { ClassType, Optional } from "@andrew-r-king/react-kitchen";

import { useResize } from "Hooks";

import { ThreeBase } from "./ThreeBase";

const RendererStyles = styled.div`
	display: block;
	background: #181132;
	width: 100%;
	height: 100%;
`;

export type RenderSettings = THREE.WebGLRendererParameters & {
	width?: number;
	height?: number;
};

export type ThreeRendererResult<T extends ThreeBase> = {
	ThreeRenderer: React.FunctionComponent<{}>;
	program: T;
};

function useThreeRenderer<T extends ThreeBase>(
	ProgramConstructor: ClassType<T>,
	settings: RenderSettings = {
		alpha: true,
		premultipliedAlpha: true,
		antialias: true,
	}
): ThreeRendererResult<T> {
	// Everything is created on the first render, so state is mutable
	let [renderer] = useState<Optional<THREE.WebGLRenderer>>(null);

	let [program] = useState<Optional<T>>(null);
	let [gui] = useState<Optional<dat.GUI>>(null);

	useResize(
		debounce((ev) => {
			const { width, height } = settings;
			if (!!renderer && !!program && !width && !height) {
				program.setSize?.(window.innerWidth, window.innerHeight);
				renderer.setSize(window.innerWidth, window.innerHeight);
			}
		}, 500),
		[program]
	);

	const ref = useCallback((node: Optional<HTMLDivElement>) => {
		// console.log("ref called");
		if (!!program) {
			// console.log("destroy");
			if (!!gui) {
				gui.destroy();
				gui = null;
			}
			program = null;
			if (!!renderer) {
				renderer.dispose();
				renderer = null;
			}
		}

		if (!!node) {
			// console.log("create");
			let scene: any = new THREE.Scene();

			const { width, height, ...renderParameters } = settings;
			scene.width = width ?? window.innerWidth;
			scene.height = height ?? window.innerHeight;

			program = new ProgramConstructor(scene);

			renderer = new THREE.WebGLRenderer(renderParameters);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(scene.width, scene.height);
			renderer.setAnimationLoop(() => {
				if (!!program && !!renderer) {
					program.onUpdate();
					program.onDraw(renderer);
				}
			});
			node.replaceChildren(renderer.domElement);

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
		}
	}, []);

	const ThreeRenderer = useCallback(() => <RendererStyles ref={ref} />, [ref]);

	return {
		ThreeRenderer,
		program: program!,
	};
}

export { useThreeRenderer };
