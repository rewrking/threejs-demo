import React from "react";
import styled from "styled-components";

import { Physics } from "@react-three/cannon";
import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { useUiStore } from "Stores";
import { ThreeScene } from "Types";

import { BoxMesh, BoxMeshPhysics, PlaneMesh, PlaneMeshPhysics, SphereMesh } from "./Three";

const ThreeSceneBox = () => {
	const { theme } = useUiStore();
	return (
		<Styles>
			<Canvas>
				<OrbitControls />
				<ambientLight position={[0, 0, 0]} intensity={0.5} />
				<spotLight position={[10, 15, 10]} angle={0.5} intensity={2.0} />
				<Physics>
					<BoxMeshPhysics
						position={[0, 2, 0]}
						color="hotpink"
						onClick={(api) => {
							api.velocity.set(0, 10, 0);
						}}
					/>
					<PlaneMeshPhysics size={[10, 10]} position={[0, 0, 0]} color={theme.primaryColor} />
				</Physics>
			</Canvas>
		</Styles>
	);
};

const ThreeSceneStars = () => {
	const { theme } = useUiStore();
	return (
		<Styles>
			<Canvas>
				<OrbitControls />
				<Stars />
				<ambientLight position={[0, 0, 0]} intensity={0.5} />
				<spotLight position={[10, 15, 10]} angle={0.5} intensity={2.0} />
				{/* <BoxMesh position={[0, 2, 0]} velocity={[0, 10, 0]} color="hotpink" /> */}
				<SphereMesh radius={4.0} position={[0, 2, 0]} color={theme.primaryColor} />
				<SphereMesh radius={0.5} position={[10, 2, 3]} color="lightblue" />
			</Canvas>
		</Styles>
	);
};

const ThreeSceneRouter = () => {
	const { scene } = useUiStore();
	switch (scene) {
		case ThreeScene.Stars:
			return <ThreeSceneStars />;
		case ThreeScene.Box:
		default:
			return <ThreeSceneBox />;
	}
};

const Styles = styled.div`
	display: block;
	background: #181132;
	width: 100vw;
	height: 100vh;
`;

export { ThreeSceneRouter };
