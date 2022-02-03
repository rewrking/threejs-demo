import React from "react";

import { ClassType } from "@andrew-r-king/react-kitchen";

import { Page } from "Components";
import { ControlsPanel } from "Components/ControlsPanel";
import { ThreeBase, useThreeRenderer } from "ThreeHelpers";

type Props<T extends ThreeBase> = {
	example: ClassType<T>;
};

const ThreeExampleLayout = <T extends ThreeBase>({ example }: Props<T>) => {
	const { ThreeRenderer } = useThreeRenderer(example);
	return (
		<Page title={example.name ?? "Untitled"}>
			<ThreeRenderer />
			<ControlsPanel />
		</Page>
	);
};

export { ThreeExampleLayout };
