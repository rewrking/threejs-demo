import React, { useEffect } from "react";
import styled from "styled-components";

// import { Physics } from "@react-three/cannon";
// import { OrbitControls, Stars } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";
// import { StoreProps as FiberStoreProps } from "@react-three/fiber/dist/declarations/src/core/store";
import { useUiStore } from "Stores";
import { ThreeExampleMorphTargets } from "ThreeHelpers/ThreeExampleMorphTargets";
import { useThreeRenderer } from "ThreeHelpers/UseThreeRenderer";
import { ThreeScene } from "Types";

// import { BoxMeshPhysics, PlaneMeshPhysics, SphereMesh } from "./Three";

// type Props = {
// 	camera?: FiberStoreProps["camera"];
// };

/*const ThreeSceneBox = ({ camera }: Props) => {
	const { theme } = useUiStore();
	return (
		<Styles>
			<Canvas shadows {...{ camera }}>
				<OrbitControls />
				<ambientLight position={[0, 0, 0]} intensity={0.5} />
				<directionalLight
					position={[0, 10, 0]}
					intensity={1.5}
					castShadow
					shadow-mapSize-height={512}
					shadow-mapSize-width={512}
				/>
				<pointLight position={[-10, 0, -20]} intensity={0.5} />
				<pointLight position={[0, -10, 0]} intensity={1.5} />
				<Physics>
					<BoxMeshPhysics
						position={[0, 2, 0]}
						color="hotpink"
						onClick={(api) => {
							api.velocity.set(0, 5, 0);
						}}
						castShadow
					/>
					<PlaneMeshPhysics
						size={[10, 10]}
						position={[0, 0, 0]}
						color={theme.tertiaryColor}
						receiveShadow
						shadowOpacity={0.5}
					/>
				</Physics>
			</Canvas>
		</Styles>
	);
};

const ThreeSceneStars = ({ camera }: Props) => {
	const { theme } = useUiStore();
	return (
		<Styles>
			<Canvas shadows {...{ camera }}>
				<OrbitControls />
				<Stars />
				<ambientLight position={[0, 0, 0]} intensity={0.5} />
				<spotLight position={[10, 15, 10]} angle={0.5} intensity={2.0} />
				<SphereMesh radius={4.0} position={[0, 2, 0]} color={theme.tertiaryColor} />
				<SphereMesh radius={0.5} position={[10, 2, 3]} color="lightblue" />
			</Canvas>
		</Styles>
	);
};*/

const ThreeSceneMorphTargets = () => {
	const { theme } = useUiStore();

	const { ThreeRenderer } = useThreeRenderer(ThreeExampleMorphTargets);

	return <ThreeRenderer />;
};

const ThreeSceneMorphTargets2 = () => {
	const { theme } = useUiStore();

	// const { ThreeRenderer } = useThreeRenderer(ThreeExampleMorphTargets);

	// return <ThreeRenderer />;
	return <div />;
};

const ThreeSceneRouter = (/*props: Props*/) => {
	const { scene } = useUiStore();
	switch (scene) {
		// case ThreeScene.Stars:
		// return <ThreeSceneStars camera={{ position: [0, 15, 30] }} {...props} />;
		// case ThreeScene.Box:
		// 	return <ThreeSceneBox camera={{ position: [-3, 2, 5] }} {...props} />;
		case ThreeScene.MorphTargets:
			return <ThreeSceneMorphTargets />;
		default:
			return <ThreeSceneMorphTargets2 />;
	}
};

const Styles = styled.div`
	display: block;
	background: #181132;
	width: 100vw;
	height: 100vh;
`;

export { ThreeSceneRouter };
