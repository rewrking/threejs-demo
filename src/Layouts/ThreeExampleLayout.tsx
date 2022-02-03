import React from "react";

import { ClassType } from "@andrew-r-king/react-kitchen";

import { Page } from "Components";
import { ControlsPanel } from "Components/ControlsPanel";
import { ThreeBase, useThreeRenderer } from "ThreeHelpers";

type Props<T extends ThreeBase> = {
	example: ClassType<T>;
	title: string;
};

const ThreeExampleLayout = <T extends ThreeBase>({ example, title }: Props<T>) => {
	const { ThreeRenderer } = useThreeRenderer(example);
	return (
		<Page title={title}>
			<ThreeRenderer />
			<ControlsPanel />
		</Page>
	);
};

export { ThreeExampleLayout };
