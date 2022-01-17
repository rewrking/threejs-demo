import React from "react";

import { Page, ThreeRootEasy } from "Components";
import { ControlsPanel } from "Components/ControlsPanel";

type Props = {};

const HomeLayout = (props: Props) => {
	return (
		<Page title="Home">
			<ThreeRootEasy />
			<ControlsPanel />
		</Page>
	);
};

export { HomeLayout };
