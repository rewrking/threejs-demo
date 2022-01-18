import React from "react";

import { PublicApi, useBox } from "@react-three/cannon";
import { Color } from "@react-three/fiber";

import { Vec3 } from "Types";

type PhysicsProps = {
	onClick?: (api: PublicApi) => void;
};

type Props = React.PropsWithChildren<{}> & {
	position: Vec3;
	color?: Color;
	castShadow?: boolean;
};

const BoxMeshPhysics = ({ children, position, onClick, color, castShadow }: Props & PhysicsProps) => {
	const [ref, api] = useBox(
		() => ({
			position: position ?? [0, 0, 0],
			mass: 1,
		}),
		undefined,
		[position]
	);
	return (
		<mesh onClick={() => onClick?.(api)} {...{ ref, castShadow }}>
			<boxBufferGeometry attach="geometry" />
			<meshLambertMaterial attach="material" {...{ color }} />
			{children}
		</mesh>
	);
};

const BoxMesh = ({ children, position, color, castShadow }: Props) => {
	return (
		<mesh position={position ?? [0, 0, 0]} {...{ castShadow }}>
			<boxBufferGeometry attach="geometry" />
			<meshLambertMaterial attach="material" {...{ color }} />
			{children}
		</mesh>
	);
};

export { BoxMeshPhysics, BoxMesh };
