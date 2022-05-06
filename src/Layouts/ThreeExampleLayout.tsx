import React from "react";

import { Page } from "Components";
import { ControlsPanel } from "Components/ControlsPanel";
import { ThreeBase, useThreeRenderer } from "ThreeHelpers";
import { ClassType } from "Types";

type Props<T extends ThreeBase> = {
	example: ClassType<T>;
	title: string;
};

const ThreeExampleLayout = <T extends ThreeBase>({ example, title }: Props<T>) => {
	const { ThreeRenderer } = useThreeRenderer<T>(example);
	return (
		<Page title={title}>
			<ThreeRenderer />
			<ControlsPanel />
		</Page>
	);
};

export { ThreeExampleLayout };
