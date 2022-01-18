import React, { useState } from "react";

import { usePlane } from "@react-three/cannon";
import { Color } from "@react-three/fiber";

import { Vec2, Vec3 } from "Types";

type Props = React.PropsWithChildren<{}> & {
	size: Vec2;
	position?: Vec3;
	color?: Color;
	receiveShadow?: boolean;
	shadowOpacity?: number;
};

const PlaneMeshPhysics = ({ children, size, position, color, receiveShadow, shadowOpacity }: Props) => {
	const [ref, api] = usePlane(
		() => ({
			position: position ?? [0, 0, 0],
			rotation: [-Math.PI / 2.0, 0, 0],
		}),
		undefined,
		[position]
	);
	return (
		<mesh {...{ ref, receiveShadow }}>
			<planeBufferGeometry attach="geometry" args={[...size]} />
			<meshLambertMaterial attach="material" {...{ color }} />
			{/* {!!receiveShadow && <shadowMaterial attach="material" opacity={shadowOpacity} />} */}
			{children}
		</mesh>
	);
};

const PlaneMesh = ({ children, size, position, color, receiveShadow, shadowOpacity }: Props) => {
	return (
		<mesh position={position ?? [0, 0, 0]} rotation={[-Math.PI / 2.0, 0, 0]} {...{ receiveShadow }}>
			<planeBufferGeometry attach="geometry" args={[...size]} />
			<meshLambertMaterial attach="material" {...{ color }} />
			{/* {!!receiveShadow && <shadowMaterial attach="material" opacity={shadowOpacity} />} */}
			{children}
		</mesh>
	);
};

export { PlaneMeshPhysics, PlaneMesh };
