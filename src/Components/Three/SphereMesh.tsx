import React from "react";
import { Object3D } from "three";

import { useSphere } from "@react-three/cannon";
import { Color } from "@react-three/fiber";

import { Vec3 } from "Types";

type PhysicsProps = {
	velocity?: Vec3;
};

type Props = React.PropsWithChildren<{}> & {
	radius: number;
	position: Vec3;
	color?: Color;
};

const SphereMeshPhysics = ({ children, position, velocity, color, radius }: Props & PhysicsProps) => {
	const [ref, api] = useSphere(
		() => ({
			position: position ?? [0, 0, 0],
			mass: 1,
		}),
		undefined,
		[position]
	);
	return (
		<mesh ref={ref}>
			<sphereBufferGeometry attach="geometry" args={[radius]} />
			<meshLambertMaterial attach="material" {...{ color }} />
			{children}
		</mesh>
	);
};

const SphereMesh = ({ children, color, radius, position }: Props) => {
	return (
		<mesh {...{ position }}>
			<sphereBufferGeometry attach="geometry" args={[radius]} />
			<meshLambertMaterial attach="material" {...{ color }} />
			{children}
		</mesh>
	);
};

export { SphereMeshPhysics, SphereMesh };
