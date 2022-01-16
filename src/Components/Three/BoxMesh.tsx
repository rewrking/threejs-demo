import React from "react";

import { useBox } from "@react-three/cannon";

type Props = {};

const BoxMesh = (props: Props) => {
	const [ref, api] = useBox(() => ({
		position: [0, 2, 0],
		mass: 1,
	}));
	return (
		<mesh
			onClick={() => {
				api.velocity.set(0, 2, 0);
			}}
			ref={ref}
		>
			<boxBufferGeometry attach="geometry" />
			<meshLambertMaterial attach="material" color="hotpink" />
		</mesh>
	);
};

export { BoxMesh };
