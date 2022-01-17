import React from "react";
import styled from "styled-components";

import { Physics } from "@react-three/cannon";
import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { BoxMesh } from "./Three";
import { PlaneMesh } from "./Three/PlaneMesh";

type Props = React.PropsWithChildren<{}>;

const ThreeRootEasy = ({ children }: Props) => {
	return (
		<Styles>
			<Canvas>
				<OrbitControls />
				{/* <Stars /> */}
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 15, 10]} angle={0.3} />
				<Physics>
					<BoxMesh />
					<PlaneMesh />
				</Physics>
			</Canvas>
		</Styles>
	);
};

const Styles = styled.div`
	display: block;
	background: transparent;
	width: 100vw;
	height: 100vh;
`;

export { ThreeRootEasy };
