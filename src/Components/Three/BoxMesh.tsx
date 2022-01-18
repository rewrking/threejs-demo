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
};

const BoxMeshPhysics = ({ children, position, onClick, color }: Props & PhysicsProps) => {
	const [ref, api] = useBox(
		() => ({
			position: position ?? [0, 0, 0],
			mass: 1,
		}),
		undefined,
		[position]
	);
	return (
		<mesh onClick={() => onClick?.(api)} ref={ref}>
			<boxBufferGeometry attach="geometry" />
			<meshLambertMaterial attach="material" {...{ color }} />
			{children}
		</mesh>
	);
};

const BoxMesh = ({ children, position, color }: Props) => {
	return (
		<mesh position={position ?? [0, 0, 0]}>
			<boxBufferGeometry attach="geometry" />
			<meshLambertMaterial attach="material" {...{ color }} />
			{children}
		</mesh>
	);
};

export { BoxMeshPhysics, BoxMesh };
