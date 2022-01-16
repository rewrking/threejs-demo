import React from "react";

import { usePlane } from "@react-three/cannon";

type Props = {};

const PlaneMesh = (props: Props) => {
	const [ref, api] = usePlane(() => ({
		position: [0, 0, 0],
		rotation: [-Math.PI / 2.0, 0, 0],
	}));
	return (
		<mesh ref={ref}>
			<planeBufferGeometry attach="geometry" args={[100, 100]} />
			<meshLambertMaterial attach="material" color="lightblue" />
		</mesh>
	);
};

export { PlaneMesh };
