import React, { useState } from "react";

import { usePlane } from "@react-three/cannon";
import { Color } from "@react-three/fiber";

import { Vec2, Vec3 } from "Types";

type Props = React.PropsWithChildren<{}> & {
	size: Vec2;
	position?: Vec3;
	color?: Color;
};

const PlaneMeshPhysics = ({ children, size, position, color }: Props) => {
	const [ref, api] = usePlane(
		() => ({
			position: position ?? [0, 0, 0],
			rotation: [-Math.PI / 2.0, 0, 0],
		}),
		undefined,
		[position]
	);
	return (
		<mesh ref={ref}>
			<planeBufferGeometry attach="geometry" args={[...size]} />
			<meshLambertMaterial attach="material" {...{ color }} />
			{children}
		</mesh>
	);
};

const PlaneMesh = ({ children, size, position, color }: Props) => {
	return (
		<mesh position={position ?? [0, 0, 0]} rotation={[-Math.PI / 2.0, 0, 0]}>
			<planeBufferGeometry attach="geometry" args={[...size]} />
			<meshLambertMaterial attach="material" {...{ color }} />
			{children}
		</mesh>
	);
};

export { PlaneMeshPhysics, PlaneMesh };
